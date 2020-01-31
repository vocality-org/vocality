import {
  RichEmbed,
  Message,
  MessageCollector,
  DMChannel,
  Guild,
} from 'discord.js';
import { COLOR } from '@vocality-org/core';
import { ANSWER_EMOJIES, WARNING } from '../config';
import { Vote } from '../types/Vote';
import { ServerQueueController } from '../controller/ServerQueueController';

export class WizardUtils {
  static async handleAnswer(
    serverQueue: Vote,
    answer: string,
    guild: Guild
  ): Promise<{ error: boolean; newMsg: RichEmbed | undefined }> {
    switch (serverQueue.currentStep) {
      case 0:
        serverQueue.question = answer;
        return { error: false, newMsg: undefined };
      case 1:
        if (answer === '1') {
          serverQueue.votes = [
            { id: ANSWER_EMOJIES.check, votes: 0, users: [] },
            { id: ANSWER_EMOJIES.cross, votes: 0, users: [] },
          ];
        } else if (answer === '2') {
          serverQueue.votes = [
            { id: ANSWER_EMOJIES.thumbs_up, votes: 0, users: [] },
            { id: ANSWER_EMOJIES.thinking, votes: 0, users: [] },
            { id: ANSWER_EMOJIES.thumbs_down, votes: 0, users: [] },
          ];
        } else if (
          answer.split(',').length > 1 &&
          answer.split(',').length <= 7
        ) {
          answer.split(',').forEach(val => {
            serverQueue.votes.push({ id: val, votes: 0, users: [] });
          });
        } else {
          return {
            error: true,
            newMsg: this.getError(serverQueue, guild),
          };
        }
        return { error: false, newMsg: undefined };
      case 2:
        if (answer === '1') {
          serverQueue.anonymous = false;
          return { error: false, newMsg: undefined };
        } else if (answer === '2') {
          serverQueue.anonymous = true;
          return { error: false, newMsg: undefined };
        } else {
          return {
            error: true,
            newMsg: this.getError(serverQueue, guild),
          };
        }
      case 3:
        serverQueue.allowedToVote = [];
        if (answer === '0') {
          serverQueue.allowedToVote.push(answer);
          return { error: false, newMsg: undefined };
        } else if (answer.split(',').every(v => Number(v))) {
          serverQueue.allowedToVote = guild.roles
            .map(v => v.id)
            .filter((v, i) => {
              const answers = answer.split(',');
              if (answers.some(a => Number(a) === i)) {
                return true;
              }
              return false;
            });
          return { error: false, newMsg: undefined };
        } else {
          const newMsg = this.getError(serverQueue, guild);
          return { error: true, newMsg };
        }
      default:
        return { error: false, newMsg: undefined };
    }
  }
  static async collect(
    serverQueue: Vote,
    collector: MessageCollector,
    message: Message
  ): Promise<{ exit: boolean; collected: undefined | Message }> {
    return new Promise((res, rej) => {
      collector.on('collect', async collected => {
        if (collected.content === 'stop') {
          const channel = collected.channel.client.channels
            .filter(c => c.type === 'dm')
            .find(
              c =>
                (c as DMChannel).recipient.username === message.author.username
            );
          console.log(serverQueue.currentStep * 2);
          const fetched = await (channel! as DMChannel).fetchMessages({
            limit: (serverQueue.currentStep + 1) * 2,
          });
          console.log(fetched.size);
          fetched.map(val => val.delete());
          ServerQueueController.getInstance().findAndRemoveVote(
            message.guild.id,
            serverQueue
          );
          res({ exit: true, collected: undefined });
        } else {
          res({ collected, exit: false });
        }
      });
    });
  }
  static getError(serverQueue: Vote, guild: Guild) {
    const newMsg = WizardUtils.getQuestion(serverQueue.currentStep, guild);
    newMsg.addBlankField();
    newMsg.addField(
      'False Value',
      WARNING + '**You did not provide the right value**'
    );
    return newMsg;
  }
  static checkDate(date: Date | undefined) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
      if (isNaN(date!.getTime())) {
        // d.valueOf() could also work
        return undefined;
      } else {
        return date;
      }
    } else {
      return undefined;
    }
  }
  static async executeLogic(serverQueue: Vote, msg: Message) {
    let hasErr = false;
    let keepgoing = true;
    let newMsg;
    let oldMsg;
    while (serverQueue.currentStep < serverQueue.maxSteps && keepgoing) {
      const timeout = setTimeout(() => {
        keepgoing = false;
        msg.author.send(
          'Waited too long for new input, please restart the setup'
        );
      }, 180000);
      let message;
      let collector;
      if (hasErr) {
        const m = (await oldMsg?.edit({ embed: newMsg })) as Message;
        collector = m.channel.createMessageCollector(m => m.content, {
          time: 300000,
          max: 1,
        });
      } else {
        const embed = WizardUtils.getQuestion(
          serverQueue.currentStep,
          msg.guild
        );
        message = await msg.author.send({ embed });
        const m = message as Message;
        oldMsg = m;
        collector = m.channel.createMessageCollector(m => m.content, {
          time: 180000,
          max: 1,
        });
      }

      const collectedAnswer = await WizardUtils.collect(
        serverQueue,
        collector,
        msg
      );
      if (collectedAnswer.exit) {
        msg.author.send('Wizard stopped!');
        clearTimeout(timeout);
        return true;
      } else {
        const error = await WizardUtils.handleAnswer(
          serverQueue,
          collectedAnswer.collected!.content,
          msg.guild
        );
        if (!error.error) {
          hasErr = false;
          serverQueue.currentStep++;
        } else {
          hasErr = true;
          newMsg = error.newMsg;
        }
      }
      clearTimeout(timeout);
    }
    if (keepgoing) {
      const finishEmbed = new RichEmbed()
        .setColor(COLOR.CYAN)
        .setTitle('Setup finished')
        .setDescription(
          'The Setup is finished, please return to your guilds chat'
        );
      msg.author.send({ embed: finishEmbed });
      return false;
    } else {
      return true;
    }
  }
  static getQuestion(index: number, guild: Guild) {
    switch (index) {
      case 0:
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('Whats your question?')
          .setDescription(
            'Try to be as explanatory as possible in one Sentence'
          )
          .setFooter('You can write stop to exit the setup');
      case 1:
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('What are the possible answers?')
          .setDescription(
            'What are the answers the user can choose from(max. 7)? Everything works with reactions so no writing is involved'
          )
          .addField(
            'Press 1',
            `- ${ANSWER_EMOJIES.check} ${ANSWER_EMOJIES.cross}`
          )
          .addField(
            'Press 2',
            `- ${ANSWER_EMOJIES.thumbs_down} ${ANSWER_EMOJIES.thinking} ${ANSWER_EMOJIES.thumbs_up}`
          )
          .addField(
            'Custom answers',
            `- divide your answers with ',' e.g. apple,banana,pear`
          )
          .setFooter('You can write stop to exit the setup');
      case 2:
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('Is your poll anonymus?')
          .setDescription(
            'Nobody sees **who has voted for which answer**, at the end of an poll **you will only see the people who participated but not their answers**'
          )
          .addField('Press 1', `Pulbic`)
          .addField('Press 2', `Anonymos`)
          .setFooter('You can write stop to exit the setup');
      case 3:
        const roles = guild.roles.map(v => v);
        let roleString = '* `0 for no restriction` \n';
        for (let i = 0; i < roles.length; i++) {
          roleString += `* \`${i + 1} for ${roles[i].name}\` \n`;
        }
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('Who do you want to allow to vote')
          .setDescription(roleString)
          .addField(
            'Example',
            `Press just 0 for everyone. If you only want specific Roles to vote write their numbers and concat them with a comma`
          )
          .setFooter('You can write stop to exit the setup');

      default:
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('An Error occured')
          .setDescription('There is an Error please exit the setup')
          .setFooter('You can write stop to exit the setup');
    }
  }
}

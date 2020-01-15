import { RichEmbed, Message, MessageCollector, DMChannel } from 'discord.js';
import { COLOR } from '@vocality-org/core';
import { ANSWER_EMOJIES, WARNING } from '../config';
import { Vote } from '../types/Vote';
import { ServerQueueController } from '../controller/ServerQueueController';

export class WizardUtils {
  /*ts-ignore*/
  static async handleAnswer(
    serverQueue: Vote,
    msg: Message,
    answer: string,
    sentEmbed: Message
  ) {
    switch (serverQueue.currentStep) {
      case 0:
        serverQueue.question = answer;
        return true;
      case 1:
        if (answer === '1') {
          serverQueue.votes = [
            { id: ANSWER_EMOJIES.check, votes: 0 },
            { id: ANSWER_EMOJIES.cross, votes: 0 },
          ];
        } else if (answer === '2') {
          serverQueue.votes = [
            { id: ANSWER_EMOJIES.thumbs_up, votes: 0 },
            { id: ANSWER_EMOJIES.thinking, votes: 0 },
            { id: ANSWER_EMOJIES.thumbs_down, votes: 0 },
          ];
        } else if (answer.split(',').length !== 1) {
          console.log('right');
          answer.split(',').forEach(val => {
            serverQueue.votes.push({ id: val, votes: 0 });
          });
        } else {
          console.log('Error');
          const newMsg = WizardUtils.getQuestion(serverQueue.currentStep);
          newMsg.addBlankField();
          newMsg.addField(
            'False Value',
            WARNING + 'You did not provide the right value'
          );
          const editMsg = await sentEmbed.edit({ embed: newMsg });
          const collector = editMsg.channel.createMessageCollector(
            m => m.content,
            {
              time: 300000,
              max: 1,
            }
          );
          const exit = await WizardUtils.collect(
            serverQueue,
            collector,
            msg,
            editMsg
          );
          if (exit) {
            msg.author.send('Wizard stopped!');
            return true;
          }
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        return true;

      default:
        return true;
    }
  }
  static async collect(
    serverQueue: Vote,
    collector: MessageCollector,
    message: Message,
    sentEmbed: Message
  ) {
    return new Promise((res, rej) => {
      collector.on('collect', async collected => {
        if (collected.content === 'stop') {
          const channel = collected.channel.client.channels
            .filter(c => c.type === 'dm')
            .find(
              c =>
                (c as DMChannel).recipient.username === message.author.username
            );
          const fetched = await (channel! as DMChannel).fetchMessages({
            limit: serverQueue.currentStep * 2,
          });
          fetched.map(val => val.delete());
          ServerQueueController.getInstance().findAndRemoveVote(
            message.guild.id,
            serverQueue
          );
          res(true);
        } else {
          const noError = await WizardUtils.handleAnswer(
            serverQueue,
            message,
            collected.content,
            sentEmbed
          );
          console.log(noError);
          if (noError) {
            serverQueue.currentStep++;
          } else {
          }
        }
        res(false);
      });
    });
  }
  static getQuestion(index: number) {
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
            'What are the answers the user can choose from? Everything works with reactions so no writing is involved'
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
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('When does your poll end?')
          .setDescription('Please use one of the folling formats')
          .addField('dd:MM:yyyy HH:mm:ss', `Date and Time will be used`, true)
          .addField(
            'dd:MM:yyyy',
            `Only a date will be used so the poll ends at 0 o'click`,
            true
          )
          .addField(
            'HH:mm:ss',
            `Only the time will be used so the poll ends at the same date`,
            true
          )
          .addField(
            'Press 0 for custom',
            `The poll ends when you what it to end`
          )
          .setFooter('You can write stop to exit the setup');

      default:
        return new RichEmbed()
          .setColor(COLOR.CYAN)
          .setTitle('Whats your question?')
          .setDescription(
            'Try to be as explanatory as possible in one Sentence'
          )
          .setFooter('You can write stop to exit the setup');
    }
  }
}

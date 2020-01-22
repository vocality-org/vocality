import { Answer } from './Answer';
import { TextChannel, DMChannel, GroupDMChannel, Message } from 'discord.js';

export interface Vote {
  textChannel: TextChannel | DMChannel | GroupDMChannel;
  initiator: string;
  initMessage: Message;
  question: string;
  votes: Answer[];
  deadline: Date | undefined;
  currentStep: number;
  maxSteps: number;
  anonymous: boolean;
  allowedToVote: string[];
}

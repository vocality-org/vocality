import { Answer } from './Answer';
import { TextChannel, DMChannel, GroupDMChannel } from 'discord.js';

export interface Vote {
  textChannel: TextChannel | DMChannel | GroupDMChannel;
  initiator: string;
  question: string;
  votes: Answer[];
  deadline: Date | undefined;
  currentStep: number;
  maxSteps: number;
  anonymous: boolean;
}

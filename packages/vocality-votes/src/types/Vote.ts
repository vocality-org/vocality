import { Answer } from './Answer';
import { TextChannel, DMChannel, GroupDMChannel, Message } from 'discord.js';

export interface Vote {
  id: string;
  textChannel: TextChannel | DMChannel | GroupDMChannel | undefined;
  initiator: string;
  initMessage: Message | undefined;
  votingMessage: Message | undefined;
  question: string;
  votes: Answer[];
  currentStep: number;
  maxSteps: number;
  anonymous: boolean;
  allowedToVote: string[];
  maxVotes: number;
  startTime: Date;
}

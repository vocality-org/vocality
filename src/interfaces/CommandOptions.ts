export interface CommandOptions {
  name: string;
  description: string;
  hasArguments: boolean;
  cooldown?: number;
}

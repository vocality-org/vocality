import { CommandOptions } from '../interfaces/CommandOptions';

export function CommandData (data: CommandOptions): ClassDecorator {
  return (target: any) => {
    const instance = new target();
    // add the instance and data to the bots command list
    return target;
  };
}

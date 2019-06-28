import { CommandOptions } from '../interfaces/CommandOptions';

/**
 * Adds a new `data` property to the class holding the given `CommandOptions`
 * @example
 * ```
 * InitCommand({
 *    name: 'changePrefix',
 *    description: 'Change the bots prefix',
 *    hasArguments: true
 * })
 * export class ChangePrefix implements Command {
 *    options: CommandOptions;   // Data from decorator moves here
 * }
 * 
 * ```
 */
export function InitCommand (data: CommandOptions): any {
  return (target: any) => {
    return class extends target {
      options = data;
    }
  };
}

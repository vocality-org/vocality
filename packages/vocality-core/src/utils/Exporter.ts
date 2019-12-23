import { Command } from '@vocality-org/types';

export class Exporter {
  /**
   * Tries to convert imported module to an array of commands
   */
  static loadCommands(imports: any): Command[] {
    const cmds: Command[] = [];

    try {
      Object.keys(imports).forEach(key => {
        const cmd: Command = new ((imports as ConstructorMap)[key] as any)();
        cmds.push(cmd);
      });
    } catch (e) {
      console.log(e);
    }

    return cmds;
  }
}

interface ConstructorMap {
  [key: string]: Function;
}

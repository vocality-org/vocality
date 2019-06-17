import { Command } from '../interfaces/Command';

export class Skip implements Command {
    execute (): void {
        throw new Error('Method not implemented.');
    }
}

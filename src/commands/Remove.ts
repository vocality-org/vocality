import { Command } from '../interfaces/Command';

export class Remove implements Command {
    options = {
        name: 'remove',
        description: 'Remove an item from the queue',
        hasArguments: false,
        socketEnabled: true,
    };

    execute(): void {
        throw new Error('Method not implemented.');
    }
}

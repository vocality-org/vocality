abstract class Command {
    arguments: string[]; 

    constructor(args: string[]) {
        this.arguments = args;
    }

    abstract execute(): void;
}
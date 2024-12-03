import { ICommand } from './ICommand'

export class CommandInvoker {
    private commands: Map<string, ICommand>;

    constructor() {
        this.commands = new Map();
    }

    addCommand(key: string, command: ICommand): void {
        this.commands.set(key, command);
    }

    executeCommand(key: string): void {
        const command = this.commands.get(key);
        if (command) {
            command.execute();
        }
    }
}

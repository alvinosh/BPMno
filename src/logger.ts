import {Action, Command} from "./types";

export interface IEngineLogger {
    log_step: (step: Action) => void;
    log_commands: (commands: Command[]) => void;
}

export class EngineLogger implements IEngineLogger {
    log_commands(commands: Command[]): void {
        console.log("Available Commands : ");
        console.log(commands.map(x => x.name).join(", "))
    }

    log_step(step: Action): void {
        console.log("Current Step : ", step.name ?? step.type);
    }

}
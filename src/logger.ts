import { Action, SeqFlow } from './types';
import { inspect } from 'util';

export interface IEngineLogger {
  log_deep: (obj: any) => void;
  log_step: (step: Action) => void;
  log_commands: (commands: SeqFlow[]) => void;
}

export class EngineLogger implements IEngineLogger {
  log_deep(obj: any): void {
    console.log(inspect(obj, { showHidden: false, depth: null, colors: true }));
  }

  log_commands(commands: SeqFlow[]): void {
    console.log('Available Commands : ');
    console.log(commands.map((x) => x.name).join(', '));
  }

  log_step(step: Action): void {
    console.log('Current Step : ', step.name ?? step.type);
  }
}

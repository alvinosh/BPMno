import { BPMLParser } from './parser';
import { EngineLogger } from './logger';
import { Engine } from './engine';
import { prompt } from './utils';
import { SeqFlow } from './types';
import { WorkflowBuilder } from './workflowBuilder';

async function main() {
  const logger = new EngineLogger();
  const wf = new WorkflowBuilder(new BPMLParser());

  let workflow = await wf.fromXml('1', '/src/assets/courier.bpmn');

  const engine = new Engine();

  while (true) {
    logger.log_step(engine.getCurrentStep(workflow));

    if (engine.getCurrentStep(workflow).type == 'EndEvent') {
      break;
    }

    logger.log_commands(engine.getCommands(workflow));

    let cmd: SeqFlow | null = null;
    do {
      const user_command = await prompt('Enter Command: ');
      cmd = engine.findCommand(workflow, user_command!);
    } while (!cmd);

    engine.executeCommand(workflow, 'User', cmd);
  }

  console.log('WorkFlow Complete');
  return;
}

main().catch((e) => {
  console.error(e);
});

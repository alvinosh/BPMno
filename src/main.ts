import { join } from "path";
import {BPMLParser,} from "./parser";
import {Engine} from "./engine";
import {EngineBuilder} from "./enginebuilder";
import {EngineLogger} from "./logger";
import { Command} from "./types";
import {prompt} from "./utils";


async function main() {
  const EB = new EngineBuilder(new BPMLParser());
  const logger = new EngineLogger()

  let engine: Engine = await EB.initialiseFromBPMN( "1", join(process.cwd(), "/src/assets/diagram.bpmn"));

  while (true) {
    logger.log_step(engine.getCurrentStep())

    if (engine.getCurrentStep().type == "EndEvent") {
      break;
    }

    logger.log_commands(engine.getCommands())

    let cmd: Command | null = null;
    do {
      const user_command = await prompt("Enter Command: ");
      cmd = engine.findCommand(user_command!);
    } while (!cmd)

    engine.executeCommand(cmd);

  }

  console.log("WorkFlow Complete");

}

main().catch(e => {
  console.log(e);
})
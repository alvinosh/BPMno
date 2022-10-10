import { Action, Process, SeqFlow, UUID, Workflow } from './types';

export class Engine {
  constructor() {}

  process(workflow: Workflow, id: UUID): Process {
    const p = workflow.processes.find((p) => p.id == id);
    if (!!p) return p;
    else throw Error(`Process With UUID ${id} Not Found`);
  }

  entity(workflow: Workflow, id: UUID): Action {
    if (!workflow.entity_map.get(id)) throw Error('Step Not Found In Map');
    return workflow.entity_map.get(id)!;
  }

  flow(workflow: Workflow, id: UUID): SeqFlow {
    if (!workflow.flow_map.get(id)) throw Error('Step Not Found In Map');
    return workflow.flow_map.get(id)!;
  }

  findCommand(workflow: Workflow, name: string): SeqFlow | null {
    let cmd = this.getCommands(workflow).find(
      (a) => a.name.toLowerCase() === name.toLowerCase(),
    );
    if (cmd) return cmd;
    return null;
  }

  getCurrentStep(workflow: Workflow): Action {
    return this.entity(workflow, workflow.current_step);
  }

  getCommands(workflow: Workflow): SeqFlow[] {
    return Array.from(workflow.flow_map.values()).filter(
      (a) => a.source === workflow.current_step,
    );
  }

  checkRole(workflow: Workflow, role: string) {
    const role_names = workflow.actors
      .filter((x) => x.process_id == workflow.current_process)
      .map((x) => x.name);
    return role_names.includes(role);
  }

  executeCommand(workflow: Workflow, role: string, command: SeqFlow) {
    if (!this.checkRole(workflow, role)) {
      console.log('No Permissions');
      return;
    }
    const flow = this.flow(workflow, command.id);
    workflow.current_step = flow.target;
    workflow.current_process = this.entity(
      workflow,
      workflow.current_step,
    ).process_id;
  }
}

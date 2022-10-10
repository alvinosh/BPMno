export type UUID = string;

export type ActionType = 'Gateway' | 'Task' | 'StartEvent' | 'EndEvent';

export interface Workflow {
  id: UUID;
  processes: Process[];
  actors: Actor[];

  entity_map: Map<UUID, Action>;
  flow_map: Map<UUID, SeqFlow>;

  current_process: UUID;
  current_step: UUID;
}

export function export_workflow(workflows: Workflow[]): string {
  let output: any[] = [];

  workflows.forEach((workflow) => {
    let obj: any = {};
    obj.id = workflow.id;
    obj.processes = workflow.processes;
    obj.actors = workflow.actors;
    obj.current_step = workflow.current_step;
    obj.current_process = workflow.current_process;
    obj.entity_map = Object.fromEntries(workflow.entity_map);
    obj.flow_map = Object.fromEntries(workflow.flow_map);
    output.push(obj);
  });

  return JSON.stringify(output);
}

export function import_workflow(json: string): Workflow[] {
  let parsedarr = JSON.parse(json);

  return parsedarr.map((parsed: any) => ({
    id: parsed['id'],
    processes: parsed['processes'],
    actors: parsed['actors'],
    current_process: parsed['current_process'],
    current_step: parsed['current_step'],
    entity_map: new Map(Object.entries(parsed['entity_map'])),
    flow_map: new Map(Object.entries(parsed['flow_map'])),
  }));
}

export interface Process {
  id: UUID;
}

export interface Actor {
  id: UUID;
  process_id: UUID;
  name: string;
}

export interface Action {
  type: ActionType;
  process_id: UUID;
  id: UUID;
  name: string;
  incoming: UUID[];
  outgoing: UUID[];
}

export interface SeqFlow {
  id: UUID;
  name: string;
  source: UUID;
  target: UUID;
}

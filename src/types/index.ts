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

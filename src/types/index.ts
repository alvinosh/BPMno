export type UUID = string;

export type ActionType = "Gateway" | "Task" | "StartEvent" | "EndEvent";

export interface Action {
  type: ActionType;
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

export class Command {
  id: UUID;
  source: UUID;
  target: UUID;
  name: string

  constructor(flow: SeqFlow) {
    this.id = flow.id;
    this.source = flow.source;
    this.target = flow.target;
    this.name = flow.name ?? "Next"
  }
}


import { UUID, Workflow } from './types';
import { BPMLParser } from './parser';

export class WorkflowBuilder {
  constructor(private parser: BPMLParser) {}

  async fromXml(uuid: UUID, path: string): Promise<Workflow> {
    return this.parser.parse_workflow(uuid, path);
  }
}

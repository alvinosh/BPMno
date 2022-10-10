import { UUID, Workflow } from './types';
import { BPMLParser } from './parser';
import { Repository } from './jsonDB';

export class WorkflowBuilder {
  constructor(
    private repository: Repository<Workflow>,
    private parser: BPMLParser,
  ) {}

  async fromXml(uuid: UUID, path: string): Promise<Workflow> {
    if (this.repository.findByUUID(uuid)) {
      return this.repository.findByUUID(uuid)!;
    }
    return this.parser.parse_workflow(uuid, path);
  }
}

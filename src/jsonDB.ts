import { export_workflow, import_workflow, UUID, Workflow } from './types';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface Repository<T> {
  findAll: () => T[];
  findByUUID: (uuid: UUID) => T | null;
  save: (arg: T) => T;
  delete: (uuid: UUID) => void;
}

export class JSONDB implements Repository<Workflow> {
  readonly DB_SOURCE = join(process.cwd(), '/src/db.json');

  constructor() {}

  findAll(): Workflow[] {
    return [];
  }

  findByUUID(uuid: UUID): Workflow | null {
    let result = import_workflow(readFileSync(this.DB_SOURCE).toString());
    return result.find((x) => x.id == uuid)!;
  }

  save(workflow: Workflow): Workflow {
    let result = import_workflow(readFileSync(this.DB_SOURCE).toString());
    let idx = result.findIndex((x) => x.id == workflow.id);
    if (idx != -1) {
      result.splice(idx, 1);
    }
    result.push(workflow);

    writeFileSync(this.DB_SOURCE, export_workflow(result), 'utf8');
    return workflow;
  }

  delete(_uuid: UUID) {
    let json = JSON.stringify([]);
    writeFileSync(this.DB_SOURCE, json, 'utf8');
  }

  // delete(uuid: UUID): Workflow {
  //   return undefined;
  // }
}

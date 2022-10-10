import { UUID, Workflow } from './types';
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

  findByUUID(_uuid: UUID): Workflow | null {
    let result: Workflow[] = JSON.parse(
      readFileSync(this.DB_SOURCE).toString(),
    );
    return result.length == 1 ? result[0] : null;
  }

  save(workflow: Workflow): Workflow {
    let json = JSON.stringify([workflow]);
    writeFileSync(this.DB_SOURCE, json, 'utf8');
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

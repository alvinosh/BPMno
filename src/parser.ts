import {
  Action,
  ActionType,
  Actor,
  Process,
  SeqFlow,
  UUID,
  Workflow,
} from './types';
import { parseStringPromise } from 'xml2js';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface IBPMLParser {
  parse_action: (
    id: UUID,
    type: ActionType,
    process_id: UUID,
    data: any,
  ) => Action;
  parse_flow: (flow: any) => SeqFlow;
}

export class BPMLParser implements IBPMLParser {
  async parse_workflow(id: UUID, path: string): Promise<Workflow> {
    let result = await parseStringPromise(
      readFileSync(join(process.cwd(), path)),
    );

    let processes: Process[] = [];
    let actors: Actor[] = [];

    let entity_map = new Map<UUID, Action>();
    let flow_map = new Map<UUID, SeqFlow>();

    let start: UUID = '0';

    result['bpmn:definitions']['bpmn:process'].forEach((bpmn_process: any) => {
      const id = bpmn_process['$']['id'];

      processes.push({
        id: id,
      });
      (bpmn_process['bpmn:exclusiveGateway'] ?? [])
        .map((a: any) => this.parse_action(id, 'Gateway', a))
        .forEach((action: Action) => {
          entity_map.set(action.id, action);
        });

      (bpmn_process['bpmn:task'] ?? [])
        .map((a: any) => this.parse_action(id, 'Task', a))
        .forEach((action: Action) => {
          entity_map.set(action.id, action);
        });
      (bpmn_process['bpmn:startEvent'] ?? [])
        .map((a: any) => this.parse_action(id, 'StartEvent', a))
        .forEach((action: Action) => {
          start = action.id;
          entity_map.set(action.id, action);
        });
      (bpmn_process['bpmn:endEvent'] ?? [])
        .map((a: any) => this.parse_action(id, 'EndEvent', a))
        .forEach((action: Action) => {
          entity_map.set(action.id, action);
        });
      (bpmn_process['bpmn:sequenceFlow'] ?? [])
        .map((a: any) => this.parse_flow(a))
        .forEach((flow: SeqFlow) => {
          flow_map.set(flow.id, flow);
        });
    });

    // !!!TODO: FIX INDEX 0
    result['bpmn:definitions']['bpmn:collaboration'][0][
      'bpmn:participant'
    ].forEach((bpmn_participant: any) => {
      actors.push(this.parse_actor(bpmn_participant));
    });

    result['bpmn:definitions']['bpmn:collaboration'][0][
      'bpmn:messageFlow'
    ].forEach((bpmn_message: any) => {
      let flow = this.parse_flow(bpmn_message);
      flow_map.set(flow.id, flow);
    });

    return {
      id: id,
      processes: processes,
      actors: actors,
      entity_map: entity_map,
      flow_map: flow_map,
      current_process: processes[0].id,
      current_step: start,
    };
  }

  parse_process(bpmn_process: any): Process {
    const id = bpmn_process['$']['id'];
    return {
      id: id,
    };
  }

  parse_actor(actor: any): Actor {
    return {
      id: actor['$']['id'],
      process_id: actor['$']['processRef'],
      name: actor['$']['name'],
    };
  }

  parse_action(id: UUID, type: ActionType, action: any): Action {
    return {
      process_id: id,
      type: type,
      id: action.$.id,
      name: action.$.name,
      incoming: action['bpmn:incoming'],
      outgoing: action['bpmn:incoming'],
    };
  }

  parse_flow(flow: any): SeqFlow {
    return {
      id: flow.$.id,
      source: flow.$['sourceRef'],
      target: flow.$['targetRef'],
      name: flow.$['name'] ?? 'Next',
    };
  }
}

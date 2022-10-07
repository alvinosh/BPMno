import {Action, ActionType, SeqFlow} from "./types";


export interface IBPMLParser {
    parse_action: (type: ActionType  , data: any) => Action
    parse_flow: (flow: any) => SeqFlow
}

export class BPMLParser implements IBPMLParser {
   parse_action(type: ActionType  , action: any): Action {
        return {
            type: type,
            id: action.$.id,
            name: action.$.name,
            incoming: action["bpmn:incoming"],
            outgoing: action["bpmn:incoming"],
        };
    }

    parse_flow(flow: any): SeqFlow {
        return {
            id: flow.$.id,
            source: flow.$["sourceRef"],
            target: flow.$["targetRef"],
            name: flow.$["name"],
        };
    }
}
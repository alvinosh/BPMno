import {Action, SeqFlow, UUID} from "./types";
import {parseStringPromise} from "xml2js";
import {readFileSync} from "fs";
import {BPMLParser} from "./parser";
import {Engine} from "./engine";

export class EngineBuilder {

    constructor(private parser: BPMLParser) {}


    async initialiseFromBPMN(id: UUID,path: string): Promise<Engine> {
        let result = await parseStringPromise(readFileSync(path));

        const bpmn_process = result["bpmn:definitions"]["bpmn:process"][0];

        const gateways: Action[] = bpmn_process["bpmn:exclusiveGateway"].map((a: any) => this.parser.parse_action("Gateway", a));
        const tasks: Action[] = bpmn_process["bpmn:task"].map((a: any) => this.parser.parse_action("Task", a));
        const startEvents: Action[] = bpmn_process["bpmn:startEvent"].map((a: any) => this.parser.parse_action("StartEvent", a));
        const endEvents: Action[] =  bpmn_process["bpmn:endEvent"].map((a: any) => this.parser.parse_action("EndEvent", a));
        const seqFlows: SeqFlow[] = bpmn_process["bpmn:sequenceFlow"].map((a: any) => this.parser.parse_flow(a));

        return new Engine(id,[...gateways,...tasks,...startEvents,...endEvents],seqFlows,startEvents[0].id);


    }
}
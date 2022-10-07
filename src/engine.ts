import {Action, Command, SeqFlow, UUID} from "./types";


export class Engine {
    id: UUID;

    entity_map: Map<UUID, Action>;
    flow_map: Map<UUID, SeqFlow>;

    flows: SeqFlow[];
    current_step: UUID;

    constructor(id: UUID,actions: Action[], flows: SeqFlow[], start: UUID) {
        this.entity_map = new Map();
        this.flow_map = new Map();
        this.id = id;

        actions.forEach(action => {
            this.entity_map.set(action.id, action);
        })

        flows.forEach(flow => {
            this.flow_map.set(flow.id, flow);
        })
        this.current_step = start;
        this.flows = flows;
    }

    entity(id: UUID): Action{
        if (!this.entity_map.get(id)) throw Error("Step Not Found In Map");
        return this.entity_map.get(id)!
    }

    flow(id: UUID): SeqFlow {
        if (!this.flow_map.get(id)) throw Error("Flow Not Found In Map");
        return this.flow_map.get(id)!
    }

    findCommand(name: string): Command | null {
        let cmd = this.getCommands().find(a => a.name === name);
        if (cmd) return cmd;
        return null;

    }


    getCurrentStep(): Action {
        return this.entity(this.current_step);
    }


    getCommands(): Command[] {
        return this.flows.filter(a => a.source === this.current_step).map(a => new Command(a));
    }

    executeCommand(command: Command) {
        const flow = this.flow(command.id);
        this.current_step = flow.target;
    }
}
import {useContext} from "react";
import { DataContext } from "~~/pages/llmservice/data";
import Collapsible from "./Collapsible";
import AgentLogEntry from "./AgentLogEntry";

const StatusTab =()=>{
    const { is_done, status, agent_logs } = useContext(DataContext);

    return (
      <Collapsible
        icon="🌈"
        title={
          <div className="flex items-center">
            Status
            <div className="flex ml-2">
              {["Plan", "Research", "Update", "Narrate", "Evaluate"].map(
                (step) => (
                  <div
                    key={step}
                    className={`ml-2 px-2 leading-6 rounded font-code font-semibold text-[12px] ${
                      is_done
                        ? "bg-fg-1 text-ac-1"
                        : status.step.startsWith(step)
                        ? "bg-fg-2 text-ac-2 animate-bounce-fast"
                        : "bg-fg-3 text-ac-3"
                    }`}
                  >
                    {step[0]}
                  </div>
                )
              )}
            </div>
          </div>
        }
        info={
          <span className="font-code text-[14px] font-medium">
            Round #{status.round}
          </span>
        }
        defaultCollapsed={false}
      >
        <div className="flex flex-col-reverse">
          {agent_logs.map((log) => (
            <AgentLogEntry key={log.timestamp + log.message} {...log} />
          ))}
        </div>
      </Collapsible>
    );
};
export default StatusTab;
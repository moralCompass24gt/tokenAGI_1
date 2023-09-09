import {memo,useState,useEffect} from "react";
import { AgentLog } from "~~/pages/llmservice/type";
import delay from "delay";

function formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
  
    return `${hours}:${minutes}:${seconds}`;
  }
  
const AgentLogEntry = memo(function _AgentLogEntry({
timestamp,
message,
round,
idx,
}: AgentLog) {
const [messageQueue, setMessageQueue] = useState("");
const [doneAnimating, setDoneAnimating] = useState(false);

useEffect(() => {
    if (Date.now() - timestamp.getTime() > 3000) {
    setMessageQueue(message);
    setDoneAnimating(true);
    return;
    }

    (async () => {
    for (let i = 0; i < message.length; i++) {
        setMessageQueue(message.slice(0, i + 1));
        await delay(12);
    }
    await delay(350);
    setDoneAnimating(true);
    })();
}, []);

return (
    <div
    className={`transition-all flex-0 min-h-0 flex text-[13px] font-code whitespace-pre-wrap break-words items-start py-2 px-3 ${
        doneAnimating ? (idx && idx % 2 ? "bg-bg-2" : "bg-bg-1") : "bg-fg-1"
    }`}
    >
    <div className="w-[80px] text-ft-2 ml-2">{formatTime(timestamp)}</div>
    <div
        className={`transition-all ml-1 px-2 leading-6 rounded font-code font-semibold text-[12px] ${
        doneAnimating ? "bg-fg-3 text-ac-3" : "bg-ac-1 text-fg-1"
        }`}
    >
        {round ? `R#${round}` : "PREPARING"}
    </div>
    <div className="flex-1 ml-3">{messageQueue}</div>
    </div>
);
});
export default AgentLogEntry;
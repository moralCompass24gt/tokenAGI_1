import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "~~/pages/llmservice/data";
import Collapsible from "./Collapsible";

function LLMLogTab() {
    const { llm_logs } = useContext(DataContext);
    const [autoscroll, setAutoscroll] = useState(true);
    const [scrollDiff, setScrollDiff] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollDiff < 0 && autoscroll) setAutoscroll(false);
    }, [scrollDiff < 0]);

    useEffect(() => {
        if (autoscroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [
        llm_logs.length && llm_logs[llm_logs.length - 1]?.response?.length,
        scrollRef,
        autoscroll,
    ]);

    // Keep track of the scroll diff
    useEffect(() => {
        let lastScroll = 0;
        function setScroll() {
            const scroll = scrollRef?.current?.scrollTop || 0;
            setScrollDiff(scroll - lastScroll); // positive if scrolling down
            lastScroll = scroll;
        }
        scrollRef?.current?.addEventListener("scroll", setScroll, false);
        return () =>
            scrollRef?.current?.removeEventListener("scroll", setScroll, false);
    }, [scrollRef]);

    return (
        <Collapsible
            icon="🤖"
            title="LLM Log"
            info={
                <div className="flex items-center">
                    <span className="font-code text-[14px] font-medium mr-3">
                        Autoscroll
                    </span>
                    <label className="relative flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoscroll}
                            className="sr-only peer"
                            onChange={(e) => {
                                setAutoscroll(e.target.checked);
                            }}
                        />
                        <div
                            className={
                                "w-11 h-6 bg-fg-3 border border-ft-2 rounded-full peer " +
                                "peer-checked:ring-2 peer-checked:ring-fg-1 " +
                                "peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-ac-1 " +
                                "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-bg-1 after:border-ft-2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                            }
                        ></div>
                    </label>
                </div>
            }
            defaultCollapsed={false}
            ref={scrollRef}
        >
            <div className="min-h-full bg-bg-2 whitespace-pre-wrap py-4 px-6 font-code text-[13px] leading-[16px]">
                {llm_logs.slice(-20).map(({ idx, prompt, response }) => (
                    <>
                        <div className="flex my-4 items-center">
                            <div className="border-t-2 border-t-ac-1 flex-1"></div>
                            <div className="mx-3 text-ac-1 font-semibold">
                                Prompt #{(idx || 0) + 1}
                            </div>
                            <div className="border-t-2 border-t-ac-1 flex-1"></div>
                        </div>
                        <div
                            key={`${idx}-prompt-${prompt.length}`}
                            className="my-3 text-ft-2 transition-all break-words"
                        >
                            {prompt}
                        </div>
                        <div
                            key={`${idx}-reponse-${response.length}`}
                            className="my-3 text-ft-1 transition-all break-words"
                        >
                            {response}
                        </div>
                    </>
                ))}
            </div>
        </Collapsible>
    );
};
export default LLMLogTab;
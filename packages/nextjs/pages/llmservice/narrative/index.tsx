import { useState,useEffect,useContext,useCallback } from "react";
import { DataContext } from "../../../components/llm-service/data";
import copy from "copy-to-clipboard";
import Image from "next/image";
import NarrativeMarkdown from "~~/components/llm-service/narrative/NarrativeMarkdown";


const Narrative = ()=>{
    const [numOptions, setNumOptions] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { narratives } = useContext(DataContext);
  const narrative = narratives[selectedIdx]?.markdown || "";

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedIdx(narratives.length - 1);
    setNumOptions(narratives.length);
  }, [narratives.length > 0]);

  useEffect(() => {
    if (narratives.length < numOptions) {
      setSelectedIdx(0);
    } else if (narratives.length > numOptions) {
      if (selectedIdx === numOptions - 1) setSelectedIdx(narratives.length - 1);
    }
    setNumOptions(narratives.length);
  }, [narratives.length, selectedIdx, numOptions]);

  const copyMarkdown = useCallback(() => {
    copy(narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [narrative]);

  return (
    <article className="min-w-0 min-h-full w-full flex-1 rounded-lg shadow-article bg-bg-2 overflow-auto scroll-smooth max-w-[760px] relative">
      <div
        className={`sticky relative z-[100] flex items-end font-code text-[14px] transition-all ${
          narrative ? "top-0" : "top-[-80px] mt-[-80px]"
        } left-0 right-0 h-[80px] px-16 py-6 bg-gradient-to-b from-[rgba(247,247,247,1)] via-[rgba(247,247,247,0.95)] via-80% to-[rgba(247,247,247,0)]`}
      >
        <div
          className="flex items-center text-ft-2 cursor-pointer hover:opacity-80 transition-all mb-1"
          onClick={copyMarkdown}
        >
          <Image alt="Copy" src="/copy.svg" height={24} width={24} />
          <div
            className={`ml-2 transition-all ${
              copied ? "text-ft-1 font-semibold" : ""
            }`}
          >
            {copied ? "Copied to Clipboard" : "Copy as Markdown"}
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <Image alt="Ref" src="/ref.svg" height={24} width={24} />
          <div className="mr-2 ml-2 text-ft-2">Report from</div>
          <select
            value={selectedIdx}
            className="font-code text-ft-1 border border-bd-1 outline-0 w-[110px] transition-all hover:border-ac-1 text-center h-[32px] rounded-md text-[14px]"
            onChange={(e) => setSelectedIdx(parseInt(e.target.value))}
          >
            {narratives.map((_, idx) => (
              <option value={idx} key={idx}>
                Round #{idx + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="z-[0] w-full px-16 pb-12">
        {narrative ? (
          <NarrativeMarkdown>{narrative}</NarrativeMarkdown>
        ) : (
          <div className="h-[420px] flex items-center justify-center">
            <div className="font-bold text-center text-ft-2 animate-pulse text-[24px]">
              🤔 Agent Thinking and Researching ...
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
export default Narrative;
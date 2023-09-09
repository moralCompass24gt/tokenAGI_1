import { useContext } from "react";
import { DataContext } from "~~/pages/llmservice/data";
import Image from "next/image";

const Header = () => {
  const { is_live, is_done } = useContext(DataContext);
  return (
    <div className="flex mt-4 mb-8">
      <div>
        <div className="flex">
          <div className="inline-flex">
            <Image
              alt="BlockAGI Logo"
              src="/blockagi.svg"
              width={44}
              height={44}
            />
          </div>
          <div className="ml-4 tracking-wide">
            <div className="font-bold text-[22px] leading-7 bg-clip-text text-transparent bg-gr-1">
              BlockAGI
            </div>
            <div className="font-bold text-[18px] text-ft-1">
              Your Self-Hosted, Hackable Research Agent
            </div>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <span
          className={`inline-block px-2 leading-6 rounded font-code font-semibold text-[12px] ${is_done
              ? "bg-fg-1 text-ac-1"
              : is_live
                ? "bg-fg-2 text-ac-2"
                : "bg-fg-4 text-ac-4"
            }`}
        >
          {is_done
            ? "AGENT FINISHED"
            : is_live
              ? "AGENT RUNNING"
              : "AGENT STOPPED"}
        </span>
      </div>
    </div>
  );
};
export default Header;
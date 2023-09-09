import { DataContext } from "~~/pages/llmservice/data";
import {useContext} from "react";
import Collapsible from "./Collapsible";

function ObjectivesTab() {
    const { objectives, generated_objectives } = useContext(DataContext);

    const expertise =
        objectives.reduce((acc, objective) => acc + objective.expertise, 0) /
        objectives.length;

    return (
        <Collapsible
        icon="⛳️"
        title={
            <div className="flex items-center">
            Objectives
            <span className="inline-block ml-4 px-2 leading-6 rounded bg-fg-1 text-ac-1 font-code font-semibold text-[12px]">
                {generated_objectives.length} generated
            </span>
            </div>
        }
        info={
            <span className="font-code text-[14px] font-medium">
            Expertise: {(expertise * 100).toFixed(1)}%
            </span>
        }
        defaultCollapsed={true}
        >
        <div className="py-4 px-6">
            <div className="mb-4 text-ft-2 font-semibold">
            ✍️ User-Defined Objectives
            </div>
            {objectives.map(({ topic, expertise }) => (
            <div key={`${topic}_${expertise}`} className="my-2 flex">
                <div className="block h-fit text-center w-[50px] px-2 leading-6 rounded bg-fg-3 text-ac-3 font-code font-semibold text-[12px]">
                {(expertise * 100).toFixed(1)}%
                </div>
                <div className="flex-1 ml-3 text-16px break-words">{topic}</div>
            </div>
            ))}
            <div className="mt-6 mb-4 text-ft-2 font-semibold">
            📟 Auto-Generated Objectives
            </div>
            {generated_objectives.map(({ topic, expertise }) => (
            <div key={`${topic}_${expertise}`} className="my-2 flex">
                <div className="block h-fit text-center w-[50px] px-2 leading-6 rounded bg-fg-3 text-ac-3 font-code font-semibold text-[12px]">
                {(expertise * 100).toFixed(1)}%
                </div>
                <div className="flex-1 ml-3 text-16px break-words">{topic}</div>
            </div>
            ))}
        </div>
        </Collapsible>
    );
    }

export default ObjectivesTab;
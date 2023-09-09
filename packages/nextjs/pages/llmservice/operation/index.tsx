import Header from "~~/components/llm-service/operation/Header";
import StatusTab from "~~/components/llm-service/operation/StatusTab";
import ObjectivesTab from "~~/components/llm-service/operation/ObjectivesTab";
import ResourcesTab from "~~/components/llm-service/operation/ResourcesTab";
import LLMLogTab from "~~/components/llm-service/operation/LLMLogTab";
import SearchTab from "~~/components/llm-service/operation/SearchTab";

import Image from "next/image";

const Operation = () => {
    return (
        <section className="min-w-0 flex-1 flex flex-col justify-stretch mx-auto px-12 max-w-[760px]">
            <Header />
            {/* search Input */}
            <SearchTab/>
            {/* Main */}
            <div className="flex flex-col min-h-0 flex-1 rounded-md border border-bd-1 overflow-hidden">
                <StatusTab />
                <ObjectivesTab />
                <ResourcesTab />
                <LLMLogTab />
            </div>
            {/* Footer */}
            <div className="flex items-center mt-6 font-bold text-ft-2">
                <div className="flex space-x-12">
                    <a href="https://github.com" target="_blank">
                        Github
                    </a>
                    <a href="https://github.com" target="_blank">
                        Documentation
                    </a>
                </div>

                <div className="flex items-center ml-auto font-semibold text-ft-1 text-[15px]">
                    Brought to you by{" "}
                    <a
                        className="inline-flex ml-2 hover:text-ac-2 hover:decoration-ac-2 group"
                        href="https://blockpipe.io"
                        target="_blank"
                    >
                        <div className="inline-flex mr-1 group-hover:animate-spin-fast">
                            <Image
                                alt="Blockpipe Logo"
                                src="/blockpipe.svg"
                                width={18}
                                height={18}
                            />
                        </div>
                        Blockpipe
                    </a>
                </div>
            </div>
        </section>
    );
};
export default Operation;
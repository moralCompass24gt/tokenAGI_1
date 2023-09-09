import { useContext } from "react";
import { DataContext } from "~~/pages/llmservice/data";
import Collapsible from "./Collapsible";



function ResourcesTab() {
    const { links } = useContext(DataContext);

    return (
        <Collapsible
            icon="🔗"
            title={
                <div className="flex items-center">
                    Resource Pool
                    <span className="inline-block ml-4 px-2 leading-6 rounded bg-fg-1 text-ac-1 font-code font-semibold text-[12px]">
                        {links.length} links
                    </span>
                </div>
            }
            info={
                <span className="font-code text-[14px] font-medium">
                    Visited: {links.filter(({ visited }) => visited).length}
                </span>
            }
            defaultCollapsed={true}
        >
            <div className="py-4 px-6">
                <div className="mb-4 text-ft-2 font-semibold">✅ Visited Links</div>
                {links
                    .filter(({ visited }) => visited)
                    .map(({ url, description }) => (
                        <div key={url} className="my-2 flex">
                            <div className="block h-fit text-center w-[65px] px-2 leading-6 rounded bg-fg-2 text-ac-2 font-code font-semibold text-[12px]">
                                Visited
                            </div>
                            <div className="flex-1 ml-3 text-16px truncate">
                                <a href={url} target="_blank" rel="noreferrer">
                                    {description}
                                </a>
                            </div>
                        </div>
                    ))}
                <div className="mt-6 mb-4 text-ft-2 font-semibold">
                    📥 New Links (Pending Agent Visit)
                </div>
                {links
                    .filter(({ visited }) => !visited)
                    .map(({ url, description }) => (
                        <div key={url} className="my-2 flex">
                            <div className="block h-fit text-center w-[65px] px-2 leading-6 rounded bg-fg-3 text-ac-3 font-code font-semibold text-[12px]">
                                New
                            </div>
                            <div className="flex-1 ml-3 text-16px truncate">
                                <a href={url} target="_blank" rel="noreferrer">
                                    {description}
                                </a>
                            </div>
                        </div>
                    ))}
            </div>
        </Collapsible>
    );
};
export default ResourcesTab;
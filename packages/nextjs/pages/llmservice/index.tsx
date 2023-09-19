import { NextPage } from "next";
import { useEffect, useState, ReactElement } from "react";
import { DataContext, BlockAGIDataType, fetchData, initialData } from "./data";
import Narrative from "./narrative";
import Operation from "./operation";
// import RootLayout from "../../components/llm-service/layout";
import { NextPageWithLayout } from "../_app";

const LLMservice: NextPageWithLayout = () => {
    const [data, setData] = useState<BlockAGIDataType>(initialData);

    useEffect(() => {
        const interval = setInterval(async () => {
            const newData = await fetchData();
            if (newData) setData(newData);
            else setData((prevData) => ({ ...prevData, is_live: false }));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <DataContext.Provider value={data}>
            <main className="flex max-h-screen min-h-screen items-stretch font-sans p-8">
                <Operation />
                <Narrative />
            </main>
        </DataContext.Provider>
    );
};

export default LLMservice;

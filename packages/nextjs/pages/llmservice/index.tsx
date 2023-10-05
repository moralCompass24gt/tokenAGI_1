import { useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { BlockAGIDataType, DataContext, fetchData, initialData } from "../../components/llm-service/data";
import Narrative from "./narrative";
import Operation from "./operation";
import { useAccount } from "wagmi";

const LLMservice: NextPageWithLayout = () => {
  const [data, setData] = useState<BlockAGIDataType>(initialData);
  const { address } = useAccount();
  useEffect(() => {
    const interval = setInterval(async () => {
      const newData = await fetchData(address);
      if (newData) setData(newData);
      else setData(prevData => ({ ...prevData, is_live: false }));
    }, 2000);
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

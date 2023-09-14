import { useContext, useEffect, useState } from "react";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { types } from "util";
import { DataContext } from "~~/pages/llmservice/data";


const SearchTab = function(){

    const [newSearch,setNewSearch]=useState("");

    // 重置还是查询
    const [reset,setReset]=useState(false);
    //获取代理目前的运行状态，如果是正在运行，则不运行再提交问题，只有当前问题运行完成，才可以重新提问
    const {is_done}=useContext(DataContext);

    const is_done1=true;
    const [hasSearch,setHasSearch]=useState(false);
    //获取当前连接用户的连接状态与地址
    const {address,isConnecting,isDisconnected}=useAccount();
    // console.log(address)
    //NFT token gated access
    const [available,setAvailable]=useState<boolean|undefined>(false);

    const isAvailable=useScaffoldContractRead({
      contractName:"YourContract",
      functionName:"isExist",
      args:[address],
    });
    // console.log(isAvailable.data);
    //将用户输入内容传输给后端
    useEffect(()=>{
      // console.log(isAvailable.data);
      setAvailable(isAvailable.data);
      // console.log(available);
    })
    //将search的内容传给blockagi
    const writeAsync=()=>{
      if (reset){
        //调用接口重置后端blockagi_state
        fetch("http://localhost:8000/api/reset");
        //清空搜索框内容
        setNewSearch('');
        //reset->search
        setReset(false);
        setHasSearch(false);
      }else{
        //把用户输入的问题发给后端。
        fetch(`http://localhost:8000/api/obj/?objectives=${newSearch}`);
        //变更按钮样式
        setHasSearch(true);
        setReset(true);
      }
    }
    return(
        <div className="mt-1 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
        <input
          type="text"
          value={newSearch}
          placeholder={available?`Write your objective here`:`Pls mint nft to get access to this service!`}
          className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
          onChange={e => setNewSearch(e.target.value)}
          disabled={!available}
        />
        <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
          <div className="flex rounded-full border-2 border-primary p-1">
            <button
              className="btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
              onClick={() => writeAsync()}
              disabled={!available || !(hasSearch?is_done:is_done1)}
            >
              {!(hasSearch?is_done:is_done1) ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                reset?(
                <>
                  Reset <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </> 
                ):(
                <>
                  Send <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </> 
                )
                
              )}
            </button>
          </div>
        </div>
      </div>
    )
};

export default SearchTab;
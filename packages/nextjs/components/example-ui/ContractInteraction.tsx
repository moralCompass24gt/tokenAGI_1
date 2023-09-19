import { useState } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

export const ContractInteraction = () => {
  const [isSuccess, setSuccess] = useState(false);
  //进行路由跳转
  const router = useRouter();
  //获取当前用户的钱包地址
  const {address}=useAccount();
  const { writeAsync, isLoading,isMining } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "safeMint",
    args: [address],
    onBlockConfirmation: txnReceipt => {
      setSuccess(true);
      console.log("Mint Successfully!");
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleClick =()=>{
    if (isSuccess){
      router.push('/llmservice');
    }
    else{
      writeAsync();
    }
  }

  return (
    <div className="flex bg-base-300 relative pb-10 top-200">
      {/* <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" /> */}
      <div className="flex w-full h-400 mx-5 sm:mx-8 2xl:mx-20 justify-center items-center">
        {/* <div className={`mt-10 flex gap-2 ${visible ? "" : "invisible"} max-w-2xl`}>
          <div className="flex gap-5 bg-base-200 bg-opacity-80 z-0 p-7 rounded-2xl shadow-lg">
            <span className="text-3xl">👋🏻</span>
            <div>
              <div>
                In this page you can see how some of our <strong>hooks & components</strong> work, and how you can bring
                them to life with your own design! Have fun and try it out!
              </div>
              <div className="mt-2">
                Check out{" "}
                <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem]">
                  packages / nextjs/pages / example-ui.tsx
                </code>{" "}
                and its underlying components.
              </div>
            </div>
          </div>
          <button
            className="btn btn-circle btn-ghost h-6 w-6 bg-base-200 bg-opacity-80 z-0 min-h-0 drop-shadow-md"
            onClick={() => setVisible(false)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div> */}

        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-6xl text-black">Get Access to the LLM Service__</span>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            {/* <input
              type="text"
              placeholder="Copy your address here."
              className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
              onChange={e => setNewGreeting(e.target.value)}
            /> */}
            <span>
              {
                !isSuccess?"Pls click the button to mint your NFT!":"Cool!Now you can access the LLM Service."
              }
            </span>
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0 items-center justify-center">
              <div className="flex rounded-full border-2 border-primary p-1">
                <button
                  className="btn btn-primary rounded-full capitalize font-bold font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
                  onClick={() => handleClick()}
                  disabled={isMining}
                >
                  {isMining ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    isSuccess?(
                      <>
                      Use LLM <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>
                    ):(<>
                      Mint NFT <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>)
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* <div className="mt-4 flex gap-2 items-start">
            <span className="text-sm leading-tight">Price:</span>
            <div className="badge badge-warning">0.01 ETH + Gas</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

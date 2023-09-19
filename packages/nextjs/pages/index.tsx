import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
const Home: NextPage = () => {
  //获取当前用户钱包连接状态
  const {address,isConnecting,isDisconnected}=useAccount();
  //NFT token gated
  const isExist = useScaffoldContractRead({
    contractName:"YourContract",
    functionName:"isExist",
    args:[address]
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8 items-center justify-center mt-20">
            <span className="block text-4xl mb-2">Welcome to</span>
            <span className="block text-6xl font-bold">TokenMind</span>
            <span className="block text-4xl italic mt-4">Turn AI Into Trust</span>
          </h1>
          <div className="items-center justify-center mt-10 flex">
            <ConnectButton/>
          </div>
        </div>
        <div className="flex items-center justify-center mt-10">
            {/* 连接后的button */}
            {
              isDisconnected?null:(
                <div className="flex flex-wrapmt-10 rounded-full p-1 flex-shrink-0 items-center justify-center">
                  <div className="text-center items-center justify-center">
                    <span className="block text-2xl font-bold">{
                      isExist.data?"Welcome! You have minted the tokenmind token.":"Sorry, you don't have the nft, pls mint the nft first."
                    }</span>
                  </div>
                 <div className="items-center justify-center">
                  <button className="btn btn-primary ">
                      {
                        isExist.data?(
                            <Link href="/llmservice">
                              Go to LLM Service
                            </Link>
                        ):(
                            <Link href="/example-ui">
                              MINT NFT
                            </Link>
                        )
                      }
                    </button>
                 </div>
                </div>
                
              )
            }
          </div>

        {/* <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Example UI
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;

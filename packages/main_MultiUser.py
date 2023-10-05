import os
import dotenv
import typer
import uvicorn
import webbrowser
import threading
from typing import Any, Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from langchain.callbacks.base import BaseCallbackHandler
from starlette.responses import FileResponse
import re

from blockagi.chains.base import BlockAGICallbackHandler
from blockagi.schema import Objective, Findings, Narrative, Resource
from blockagi.resource_pool import ResourcePool
from blockagi.run import run_blockagi


app = FastAPI()


@app.get("/")
def get_index():
    return FileResponse("packages/nextjs/.next/server/pages/index.html")


# 防止cors，所以添加了下面这些内容
origins = [
    # "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/state/{address}")
def get_api_state(address: str):
    if address in app.state.multiBlockagi_state:
        app.state.multiBlockagi_state[address].resource_pool = app.state.multiResource_pool[address]
        return app.state.multiBlockagi_state[address]


# app.mount("/", StaticFiles(directory="dist"), name="dist")
@app.post("/api/search")
def searchbyObjAndAddress(objectives: str, address: str):
    # 现在对blockagistate进行初始化
    block_agi_state1 = BlockAGIState(
        start_time=datetime.utcnow().isoformat(),
        end_time=None,
        agent_role=app.state.agent_role,
        status=Status(step="PlanChain", round=0),
        historical_steps=[],
        agent_logs=[
            AgentLog(datetime.utcnow().isoformat(),
                     0, f"You are {app.state.agent_role}"),
            AgentLog(datetime.utcnow().isoformat(),
                     0, f"Using {app.state.openai_model}"),
        ],
        objectives=None,
        findings=[],
        resource_pool=ResourcePool(),
        llm_logs=[],
        narratives=[],
    )
    # 以address为key，blockagistate为value，添加进multiBlockState
    app.state.multiBlockagi_state[address] = block_agi_state1

    # 以address为key，resourcePool为value，添加进multiResourcePool
    app.state.multiResource_pool[address] = ResourcePool()

    # 把目标切割为单独的问题后再传入blockagi_state
    app.state.multiBlockagi_state[address].add_objectives(objectives)
    # 单独开个线程启动代理
    def target(**kwargs):
        try:
            run_blockagi(**kwargs)
        except Exception as e:
            app.state.multiBlockagi_state[address].add_agent_log(f"Error: {e}")
        app.state.multiBlockagi_state[address].end_time = datetime.utcnow(
        ).isoformat()

    threading.Thread(
        target=target,
        kwargs=dict(
            agent_role=app.state.multiBlockagi_state[address].agent_role,
            openai_api_key=app.state.openai_api_key,
            openai_model=app.state.openai_model,
            resource_pool=app.state.multiResource_pool[address],
            objectives=app.state.multiBlockagi_state[address].objectives,
            blockagi_callback=BlockAGICallback(
                app.state.multiBlockagi_state[address]),
            llm_callback=LLMCallback(app.state.multiBlockagi_state[address]),
            iteration_count=app.state.iteration_count,
        ),
    ).start()


@app.post("/api/reset/{address}")
def reset_blockagi_state(address: str):
    # 将multiblockagistate与multiresourcepool里该address的记录删除
    # 由于在search接口中设计的思路是接收到obj后重新在state和resourcepool字典中重新插入该地址的记录
    # 故不再在reset接口中重置这两者，直接进行删除操作
    # 判断在multiblockagistate中是否存在该地址
    if address in app.state.multiBlockagi_state:
        del app.state.multiBlockagi_state[address]

    # 判断在multiresourcepool是否存在该地址
    if address in app.state.multiResource_pool:
        del app.state.multiResource_pool[address]


@dataclass
class StepHistory:
    timestamp: str
    value: str


@dataclass
class AgentLog:
    timestamp: str
    round: int
    message: str


@dataclass
class Status:
    step: str
    round: int


@dataclass
class LLMLog:
    prompt: str
    response: str


@dataclass
class BlockAGIState:
    start_time: str
    end_time: Optional[str]
    agent_role: str
    status: Status
    agent_logs: list[AgentLog]
    historical_steps: list[StepHistory]
    objectives: Optional[list[Objective]]
    findings: list[Findings]
    resource_pool: ResourcePool
    llm_logs: list[LLMLog]
    narratives: list[Narrative]

    def add_agent_log(self, message: str):
        self.agent_logs.append(
            AgentLog(
                timestamp=datetime.utcnow().isoformat(),
                round=self.status.round,
                message=message,
            )
        )

    def add_objectives(self, objectives: str):
        obj: list[str] = objectives.split('?')
        self.objectives = [Objective(topic=topic, expertise=0.0)
                           for topic in obj]
        # print(self.objectives)


@app.on_event("startup")
def on_startup():
    # resource_pool也需要被定义为dict，按照用户地址来索引
    app.state.multiResource_pool: Dict[str, ResourcePool] = {}


@app.on_event("shutdown")
def on_shutdown():
    os._exit(0)


class BlockAGICallback(BlockAGICallbackHandler):
    state: BlockAGIState

    def __init__(self, blockagi_state):
        self.state = blockagi_state

    def on_iteration_start(self, inputs: Dict[str, Any]) -> Any:
        self.state.status.round += 1

    def on_log_message(self, message: str) -> Any:
        self.state.add_agent_log(message)

    def on_step_start(self, step, inputs, **kwargs):
        self.state.status.step = step

    def on_step_end(self, step, inputs, outputs, **kwargs):
        if step == "PlanChain":
            pass
        elif step == "ResearchChain":
            pass
        elif step == "NarrateChain":
            self.state.narratives.append(outputs["narrative"])
        elif step == "EvaluateChain":
            self.state.objectives = outputs["updated_objectives"]
            self.state.findings = outputs["updated_findings"]


class LLMCallback(BaseCallbackHandler):
    state: BlockAGIState

    def __init__(self, blockagi_state):
        self.state = blockagi_state

    def on_llm_start(self, serialized, prompts, **kwargs):
        self.state.llm_logs.append(
            LLMLog(
                prompt="".join(prompts),
                response="",
            )
        )

    def on_llm_new_token(self, token: str, **kwargs):
        self.state.llm_logs[-1].response += token


def main(
    host: str = typer.Option(envvar="WEB_HOST"),
    port: int = typer.Option(envvar="WEB_PORT"),
    agent_role: str = typer.Option(envvar="BLOCKAGI_AGENT_ROLE"),
    iteration_count: int = typer.Option(envvar="BLOCKAGI_ITERATION_COUNT"),
    openai_api_key: str = typer.Option(envvar="OPENAI_API_KEY"),
    openai_model: str = typer.Option(envvar="OPENAI_MODEL"),
):
    app.state.host = host
    app.state.port = port
    # 直接将agent_role记录为全局变量
    app.state.agent_role = agent_role
    app.state.openai_api_key = openai_api_key
    app.state.openai_model = openai_model
    app.state.iteration_count = iteration_count
    # 初始化multiBlockagi_state为一个空字典，具体每个kv对的初始化等待obj接口再做
    app.state.multiBlockagi_state: Dict[str, BlockAGIState] = {}
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    dotenv.load_dotenv()
    typer.run(main)

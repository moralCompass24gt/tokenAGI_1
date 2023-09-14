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


# @app.get("/")
# def get_index():
#     return FileResponse("dist/index.html")


# 防止cors，所以添加了下面这些内容
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # 認証情報のアクセスを許可(今回は必要ない)
    allow_credentials=True,
    # 全てのリクエストメソッドを許可(["GET", "POST"]など個別指定も可能)
    allow_methods=["*"],
    # アクセス可能なレスポンスヘッダーを設定（今回は必要ない）
    allow_headers=["*"],
)


@app.get("/api/state")
def get_api_state():
    app.state.blockagi_state.resource_pool = app.state.resource_pool
    return app.state.blockagi_state


# app.mount("/", StaticFiles(directory="dist"), name="dist")
@app.get("/api/obj")
def get_objectives(objectives: str):
    # print(objectives)
    # 把目标切割为单独的问题后再传入blockagi_state
    app.state.blockagi_state.add_objectives(objectives)
    # print(objectives);
    # 单独开个线程启动代理
    def target(**kwargs):
        try:
            run_blockagi(**kwargs)
        except Exception as e:
            app.state.blockagi_state.add_agent_log(f"Error: {e}")
        app.state.blockagi_state.end_time = datetime.utcnow().isoformat()

    threading.Thread(
        target=target,
        kwargs=dict(
            agent_role=app.state.blockagi_state.agent_role,
            openai_api_key=app.state.openai_api_key,
            openai_model=app.state.openai_model,
            resource_pool=app.state.resource_pool,
            objectives=app.state.blockagi_state.objectives,
            blockagi_callback=BlockAGICallback(app.state.blockagi_state),
            llm_callback=LLMCallback(app.state.blockagi_state),
            iteration_count=app.state.iteration_count,
        ),
    ).start()

@app.get("/api/reset")
def reset_blockagi_state():
    # 通过重置blockagi_state的方式将上一次输入的结果清空，因为结果都被记录在blockagi_state里
    #同时还要重置resource_pool
    app.state.resource_pool=ResourcePool()
    agent_role=os.getenv("BLOCKAGI_AGENT_ROLE")
    openai_model=os.getenv("OPENAI_MODEL")
    app.state.blockagi_state = BlockAGIState(
        start_time=datetime.utcnow().isoformat(),
        end_time=None,
        agent_role=agent_role,
        status=Status(step="PlanChain", round=0),
        historical_steps=[],
        agent_logs=[
            AgentLog(datetime.utcnow().isoformat(), 0, f"You are {agent_role}"),
            AgentLog(datetime.utcnow().isoformat(), 0, f"Using {openai_model}"),
        ],
        objectives=None,
        findings=[],
        resource_pool=ResourcePool(),
        llm_logs=[],
        narratives=[],
    )



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

    def add_objectives(self,objectives:str):
        obj:list[str]=objectives.split('?')
        self.objectives=[Objective(topic=topic,expertise=0.0) for topic in obj]
        # print(self.objectives)



@app.on_event("startup")
def on_startup():
    app.state.resource_pool = ResourcePool()

    # def target(**kwargs):
    #     try:
    #         run_blockagi(**kwargs)
    #     except Exception as e:
    #         app.state.blockagi_state.add_agent_log(f"Error: {e}")
    #     app.state.blockagi_state.end_time = datetime.utcnow().isoformat()

    # threading.Thread(
    #     target=target,
    #     kwargs=dict(
    #         agent_role=app.state.blockagi_state.agent_role,
    #         openai_api_key=app.state.openai_api_key,
    #         openai_model=app.state.openai_model,
    #         resource_pool=app.state.resource_pool,
    #         objectives=app.state.blockagi_state.objectives,
    #         blockagi_callback=BlockAGICallback(app.state.blockagi_state),
    #         llm_callback=LLMCallback(app.state.blockagi_state),
    #         iteration_count=app.state.iteration_count,
    #     ),
    # ).start()
    # webbrowser.open(f"http://{app.state.host}:{app.state.port}")


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
    objectives: list[str] = typer.Option(None, "--objectives", "-o"),
    openai_api_key: str = typer.Option(envvar="OPENAI_API_KEY"),
    openai_model: str = typer.Option(envvar="OPENAI_MODEL"),
):
    app.state.host = host
    app.state.port = port
    # if not objectives:
    #     for index in range(1, 11):
    #         key = f"BLOCKAGI_OBJECTIVE_{index}"
    #         if objective := os.getenv(key):
    #             objectives.append(objective.strip())
    # if not objectives:
    #     raise ValueError("No objectives specified")

    app.state.openai_api_key = openai_api_key
    app.state.openai_model = openai_model
    app.state.iteration_count = iteration_count
    app.state.blockagi_state = BlockAGIState(
        start_time=datetime.utcnow().isoformat(),
        end_time=None,
        agent_role=agent_role,
        status=Status(step="PlanChain", round=0),
        historical_steps=[],
        agent_logs=[
            AgentLog(datetime.utcnow().isoformat(),
                     0, f"You are {agent_role}"),
            AgentLog(datetime.utcnow().isoformat(),
                     0, f"Using {openai_model}"),
        ],
        objectives=None,
        findings=[],
        resource_pool=ResourcePool(),
        llm_logs=[],
        narratives=[],
    )
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    dotenv.load_dotenv()
    typer.run(main)

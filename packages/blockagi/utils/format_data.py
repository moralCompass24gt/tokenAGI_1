import json
import dataclasses
from typing import Any, List
from blockagi.schema import Objective, Resource


def format_objectives(objectives: List[Objective]) -> str:
    if len(objectives) == 0:
        return "- None"

    return "\n".join(
        [
            f"{i+1}. {o.topic} (expertise: {o.expertise})"
            for i, o in enumerate(objectives)
        ]
    )


def format_resources(resources: List[Resource]) -> str:
    if len(resources) == 0:
        return "- No resources available"

    return "\n".join([f"- {r.url} ({r.description})" for r in resources])


def to_json_str(data: Any) -> str:
    return json.dumps(to_simple(data), indent=2)


def to_simple(data: Any) -> Any:
    if dataclasses.is_dataclass(data):
        return dataclasses.asdict(data)
    elif isinstance(data, dict):
        _data = {}
        for k, v in data.items():
            _data[k] = to_simple(v)
        return _data
    elif isinstance(data, list):
        return [to_simple(i) for i in data]
    else:
        return data

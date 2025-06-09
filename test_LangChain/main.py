from typing import Annotated

from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_tavily import TavilySearch
from langgraph.types import Command, interrupt
from langchain_core.tools import InjectedToolCallId, tool
from langchain.tools import Tool, StructuredTool
from langchain_core.pydantic_v1 import BaseModel, Field

import os

os.environ['TAVILY_API_KEY'] = "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"

from langchain_tavily import TavilySearch

tool = TavilySearch(max_results=2)


def human_assistance(query: str) -> str:
    """Request assistance from a human."""
    print('STOP')
    human_response = interrupt({"query": query})
    return human_response["data"]

def human_assistance2(
    name: str, birthday: str, tool_call_id: Annotated[str, InjectedToolCallId]="8"
) -> str:
    """Request assistance from a human."""
    human_response = interrupt(
        {
            "question": "Is this correct?",
            "name": name,
            "birthday": birthday,
        },
    )
    # If the information is correct, update the state as-is.
    if human_response.get("correct", "").lower().startswith("y"):
        verified_name = name
        verified_birthday = birthday
        response = "Correct"
    # Otherwise, receive information from the human reviewer.
    else:
        verified_name = human_response.get("name", name)
        verified_birthday = human_response.get("birthday", birthday)
        response = f"Made a correction: {human_response}"

    # This time we explicitly update the state with a ToolMessage inside
    # the tool.
    state_update = {
        "name": verified_name,
        "birthday": verified_birthday,
        "messages": [ToolMessage(response, tool_call_id=tool_call_id)],
    }
    # We return a Command object in the tool to update our state.
    return Command(update=state_update)

tool2 = Tool.from_function(
    func=human_assistance,
    name="human_assistance",
    description="Ask for human assistance.",
)

class AssistInput(BaseModel):
    name: str = Field(description="Name to validate")
    birthday: str = Field(description="Birthday to check")

tool3 = StructuredTool.from_function(
    func=human_assistance2,
    name="Human_validation",
    description="Ask for human verification of passed data. Requires: name (str), birthday (str).",
    args_schema=AssistInput
)

tools = [tool, tool2, tool3]
#tool.invoke("What's a 'node' in LangGraph?")


class State(TypedDict):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list, add_messages]
    name:str
    birthday:str


graph_builder = StateGraph(State)



llm = ChatOllama(
    model="llama3.1:8b",
    temperature=0,
    # other params...
).bind_tools(tools)

def chatbot(state: State):
    print("LLM called")
    return {"messages": [llm.invoke(state["messages"])]}


# The first argument is the unique node name
# The second argument is the function or object that will be called whenever
# the node is used.
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")


import json

from langchain_core.messages import ToolMessage


class BasicToolNode:
    """A node that runs the tools requested in the last AIMessage."""

    def __init__(self, tools: list) -> None:
        self.tools_by_name = {tool.name: tool for tool in tools}

    def __call__(self, inputs: dict):
        if messages := inputs.get("messages", []):
            message = messages[-1]
        else:
            raise ValueError("No message found in input")
        outputs = []
        for tool_call in message.tool_calls:
            print(tool_call["args"])
            tool_result = self.tools_by_name[tool_call["name"]].invoke(
                tool_call["args"]
            )
            outputs.append(
                ToolMessage(
                    content=json.dumps(tool_result),
                    name=tool_call["name"],
                    tool_call_id=tool_call["id"],
                )
            )
        return {"messages": outputs}


tool_node = BasicToolNode(tools=tools)
graph_builder.add_node("tools", tool_node)

def route_tools(
    state: State,
):
    """
    Use in the conditional_edge to route to the ToolNode if the last message
    has tool calls. Otherwise, route to the end.
    """
    if isinstance(state, list):
        ai_message = state[-1]
    elif messages := state.get("messages", []):
        ai_message = messages[-1]
    else:
        raise ValueError(f"No messages found in input state to tool_edge: {state}")
    if hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls) > 0:
        return "tools"
    return END

# The `tools_condition` function returns "tools" if the chatbot asks to use a tool, and "END" if
# it is fine directly responding. This conditional routing defines the main agent loop.
graph_builder.add_conditional_edges(
    "chatbot",
    route_tools,
    # The following dictionary lets you tell the graph to interpret the condition's outputs as a specific node
    # It defaults to the identity function, but if you
    # want to use a node named something else apart from "tools",
    # You can update the value of the dictionary to something else
    # e.g., "tools": "my_tools"
    {"tools": "tools", END: END},
)
# Any time a tool is called, we return to the chatbot to decide the next step
graph_builder.add_edge("tools", "chatbot")


# MEMOIRE
memory = MemorySaver()


graph = graph_builder.compile(checkpointer=memory)

def stream_graph_updates(user_input: str):
    for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}, {"configurable": {"thread_id": "1"}}):
        for value in event.values():
            if(hasattr(value, "messages")):
              print("Assistant:", value["messages"][-1].content)

# TEST --------------

if False:
  stream_graph_updates("I need some expert guidance for building an AI agent. Could you request assistance for me?")

  # Simule la réponse humaine (suite à l'interruption)
  human_response = (
      "We, the experts are here to help! We'd recommend you check out LangGraph to build your agent. "
      "It's much more reliable and extensible than simple autonomous agents."
  )
  human_command = Command(resume={"data": human_response})

  # Reprend l'exécution du graphe avec la réponse humaine
  events = graph.stream(human_command, {"configurable": {"thread_id": "1"}}, stream_mode="values")
  for event in events:
      if "messages" in event:
          event["messages"][-1].pretty_print()

# TEST 2 ______
if True:
  user_input = (
    "Can you look up when LangGraph was released? "
    "When you have the answer, use the Human_validation tool for review."
  )
  config = {"configurable": {"thread_id": "1"}}

  events = graph.stream(
      {"messages": [{"role": "user", "content": user_input}]},
      config,
      stream_mode="values",
  )
  for event in events:
      if "messages" in event:
          event["messages"][-1].pretty_print()

  human_command = Command(
      resume={
          "name": "LangGraph",
          "birthday": "Jan 17, 2024",
      },
  )

  events = graph.stream(human_command, config, stream_mode="values")
  for event in events:
      if "messages" in event:
          event["messages"][-1].pretty_print()


while False:
    try:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        elif user_input.lower() in ["human_assist", "ha"]:
            events = graph.stream(human_command, {"configurable": {"thread_id": "1"}}, stream_mode="values")
            for event in events:
              if "messages" in event:
                  event["messages"][-1].pretty_print()
                  break
            
            continue
        
        snapshot = graph.get_state({"configurable": {"thread_id": "1"}})
        print(snapshot.next)


        stream_graph_updates(user_input)
    except:
        # fallback if input() is not available
        user_input = "What do you know about LangGraph?"
        print("User: " + user_input)
        stream_graph_updates(user_input)
        break
from langgraph.graph import StateGraph, START, END
from langchain.tools import Tool, StructuredTool
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from ..providers.Ollama import OllamaModel

from .State import State
from .nodes.BasicToolNode import BasicToolNode, route_tools

class GraphBuilder():

    def __init__(self, modelProvider:OllamaModel):
        self.__modelProvider = modelProvider # Provider including methods for this model
        self.__chatLLM = self.__modelProvider.getModel() # Ollama LLM, direct access
        self.__tools = self.__modelProvider.getTools()

        # Creation of the graph builder
        self.__graphBuilder = StateGraph(State)
        self.__graphBuilder.add_node("chatbot", self.__modelProvider.chatbot)
        self.__graphBuilder.add_edge(START, "chatbot")

        self.__graphBuilder.add_node("tools", BasicToolNode(tools=self.__tools))
        self.__graphBuilder.add_conditional_edges(
            "chatbot", # From chatbot, to tools OR end.
            route_tools, # Function that checks if tools were called
            # The following dictionary lets you tell the graph to interpret the condition's outputs as a specific node
            # It defaults to the identity function, but if you
            # want to use a node named something else apart from "tools",
            # You can update the value of the dictionary to something else
            # e.g., "tools": "my_tools"
            {"tools": "tools", END: END},
        )
        # Any time a tool is called, we return to the chatbot to decide the next step
        self.__graphBuilder.add_edge("tools", "chatbot")                                  

    def compile(self, memory:MemorySaver):
        """
        Validates the current Graph, and compile it, so we can start answering

        Returns:
            CompiledGraph: Graph ready to use
        """
        self.__compiledGraph = self.__graphBuilder.compile(checkpointer=memory)
        return self.__compiledGraph


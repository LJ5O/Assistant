from langchain_ollama import ChatOllama

from .providers.Ollama import OllamaModel
from .providers.Test import TestModel
from .tools.Tools import Tools
from .graph.GraphBuilder import GraphBuilder
from .graph.CompiledGraph import CompiledGraph
from .runner.Runner import Runner
from Json.Types import UserRequest, UserAnswer, HumanMessageJson, AIMessageJson, ToolMessageJson

class LLM():
        """
        Class in charge of preparing the brain/LLM. Requires 0llama to be available and running.
        """

        def __init__(self, model:str="llama3.1:8b"):
            """
            Creates a new LLM, a full AI application able to execute user inputs.

            Args:
                model (str, optional): Main LLM model. Defaults to "llama3.1:8b".
            """
            self.__modelName = model
            
            if self.__modelName == "test":
                self.LLM = TestModel()
            else:
                self.LLM = OllamaModel(self.__modelName, Tools.getAll())

            self.__graph = CompiledGraph(GraphBuilder(self.LLM))
            self.__runner = Runner(self.__graph)

        def getCompiledGraph(self) -> CompiledGraph:
            """
            Get the compiled graph for this app.
            Useful for some advanced usages

            Returns:
                CompiledGraph: CompiledGraph, our custom layer over the LangGraph Compiled Graph
            """
            return self.__graph

        def getRunner(self) -> Runner:
            """
            When you are working with the AI graph,
            this Runner is the main entry point to interact with the app.

            Returns:
                Runner: A Runner object, with methods allowing easy interactions with the AI graph
            """
            return self.__runner
        
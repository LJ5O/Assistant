from langchain_ollama import ChatOllama

from .providers.Ollama import OllamaModel
from .tools.Tools import Tools
from .graph.GraphBuilder import GraphBuilder
from .graph.CompiledGraph import CompiledGraph

class LLM():
        """
        Class in charge of preparing the brain/LLM. Requires 0llama to be available and running.
        """

        def __init__(self, model:str="llama3.1:8b"):
            self.__modelName = model
            self.LLM = OllamaModel(self.__modelName, Tools.getAll())

            self.graph = CompiledGraph(GraphBuilder(self.LLM))

            self.run()


        def run(self):
            while True:
                userInput = input("user: ")
                if userInput == "q": break
                
                self.graph.stream_graph_updates(userInput)

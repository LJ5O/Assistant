from langchain_ollama import ChatOllama

from .providers.Ollama import OllamaModel
from .tools.Tools import Tools
from .graph.GraphBuilder import GraphBuilder
from .graph.CompiledGraph import CompiledGraph
from Json.Types import UserRequest, UserAnswer

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
            self.LLM = OllamaModel(self.__modelName, Tools.getAll())

            self.graph = CompiledGraph(GraphBuilder(self.LLM))

        def handleUserRequest(self, request:UserRequest) -> UserAnswer:
            """
            Runs the LLM using the provided request, and returns an answer

            Args:
                request (UserRequest): What the user asked.

            Returns:
                UserAnswer: Our answer to this query.
            """
            a = self.graph.submitInput(request.input)
            for e in a:
                print(e)

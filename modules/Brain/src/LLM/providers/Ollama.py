import sys

from langchain_ollama import ChatOllama
from langchain.tools import Tool, StructuredTool

from ..graph.State import State

class OllamaModel():
    
    def __init__(self, model:str, tools:list[Tool|StructuredTool]=[], temperature=0):
        self.__modelName = model
        self.__tools = tools
        self.__temperature = temperature

        self.__model:ChatOllama = self.__getModel()

    def __getModel(self) -> ChatOllama:
        """
        Provider function to get an Ollama LLM. Ollama must be running.


        Args:
            model (str): Name of the model you want to start
            tools (list[Tool | StructuredTool]): List of available tools for this model to use
            temperature (int, optional): 0 is for deterministic answers, increase to get creative asnwers. Defaults to 0. 

        Returns:
            ChatOllama: An instance of ChatOllama, ready to be used as a StateGraph Node.
        """
        try:
            return ChatOllama(
                model=self.__modelName,
                #system="Ne propose d'utiliser des outils que si la demande l'exige clairement. Sinon, réponds directement.",
                temperature=self.__temperature # 
            ).bind_tools(self.__tools, tool_choice='auto')
            # See https://python.langchain.com/docs/how_to/tool_calling/
            # See https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.BaseChatOpenAI.html#langchain_openai.chat_models.base.BaseChatOpenAI.bind_tools
        
        except Exception as err:
            sys.stderr.write(f"ERROR : Please, ensure Ollama is up and running on your computer :\n {err}")
            raise

    def getModel(self) -> ChatOllama:
        """
        Get the Ollama LLM.

        Returns:
            ChatOllama: An instance of ChatOllama, ready to be used as a StateGraph Node.
        """
        return self.__model

    def getTools(self) -> list[Tool|StructuredTool]:
        """
        Get the list of tools passed to this model

        Returns:
            list[Tool|StructuredTool]: List of available tools.
        """
        return self.__tools

    def chatbot(self, state:State):
        """
        Function called by the graph to talk to this model.
        Should be only used within a Graph none.

        Args:
            state (State): Graph state
        """
        return {"messages": [self.getModel().invoke(state["messages"])]}
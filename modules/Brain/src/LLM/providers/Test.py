import sys
from langchain_core.language_models import BaseChatModel
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.messages import BaseMessage, AIMessage

from ..graph.State import State


class MinimalTestModel(BaseChatModel):

    def _generate(
        self,
        messages: list[BaseMessage],
        stop: None|list[str] = None,
        run_manager = None,
        **kwargs
    ) -> ChatResult:
        message = AIMessage(content="OK") # Always replies by "OK"
        generation = ChatGeneration(message=message)
        return ChatResult(generations=[generation])

    @property
    def _llm_type(self) -> str:
        return "minimal-test-model"

class TestModel():
    
    def __init__(self, temperature=0):
        self.__modelName = "test"
        self.__temperature = temperature

        self.__model:MinimalTestModel = self.__getModel()

    def __getModel(self) -> MinimalTestModel:
        """
        Provider function to get an Test LLM.

        Returns:
            Test: An instance of TestModel, ready to be used as a StateGraph Node.
        """
        return MinimalTestModel()

    def getModel(self) -> MinimalTestModel:
        """
        Get the Test LLM.

        Returns:
            MinimalTestModel: An instance of MinimalTestModel, ready to be used as a StateGraph Node.
        """
        return self.__model

    def getTools(self): return []

    def chatbot(self, state:State):
        """
        Function called by the graph to talk to this model.
        Should be only used within a Graph none.

        Args:
            state (State): Graph state
        """
        return {"messages": [self.getModel().invoke(state["messages"])]}
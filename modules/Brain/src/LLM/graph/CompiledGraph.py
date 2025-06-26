from .GraphBuilder import GraphBuilder
from ..memory.Postgres import Postgres

from langgraph.checkpoint.memory import MemorySaver

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage

class CompiledGraph():
    def __init__(self, graphBuiler:GraphBuilder, memory:Postgres=None):
        """Compile a GraphBuilder object. This object can also be used to run convenient methods on it.

        Args:
            graphBuiler (GraphBuilder): A Graph builder, ready to be built.
            memory (Postgres, optional): Memory to store checkpoints. Defaults to None, stored in RAM.
        """

        if memory:
            # Storage defined !
            if not memory.isReady(): raise Exception("Memory provider was not ready when tried to compile the Graph !")
            self.__memory = memory.toCheckPointSaver()
        else:
            # In RAM memory
            self.__memory = MemorySaver()

        self.__rawGraph = graphBuiler
        self.__compiledGraph = graphBuiler.compile(self.__memory)

    def getGraph(self):
        """
        Get the compiled graph directly

        Returns:
            CompiledGraph: A compiled graph from LangGraph
        """
        return self.__compiledGraph

    def stream_graph_updates(self, user_input: str):
        """
        Debug method used to query the graph and print answers in console

        Args:
            user_input (str): A string input to the graph
        """
        #system_message = SystemMessage(content="Tu es un assistant IA. N'appelle des function seulement, et seulement si tu en as besoin pour répondre.")
        user_message = HumanMessage(content=user_input)
        for event in self.getGraph().stream({"messages": [user_message]}, {}, stream_mode="values"):
            if "messages" in event:
                event["messages"][-1].pretty_print()

    def submitInput(self, humanMessage:HumanMessage, systemMessage:SystemMessage=None, threadId:str="default"):
        """
        A method that can be used to query the graph. Will Yield Graph outputs, ready to be worked on.

        See:
            https://langchain-ai.lang.chat/langgraph/how-tos/streaming/#streaming-api

        Args:
            humanMessage (HumanMessage): Message from an Human user.
            systemMessage (SystemMessage, optional): System message, adding some optinal instructions or context. Defaults to None.
            threadId (str, optional): Unique thread id, used for short term memory. Defaults to "default".

        Yields:
            Dict: Updates about the graph execution. Messages are under element['messages'].
        """
        messages:list[HumanMessage|SystemMessage] = [humanMessage]
        if systemMessage: messages.append(systemMessage)

        config = {"configurable": {"thread_id": threadId}}

        yield from self.getGraph().stream({"messages": messages}, config, stream_mode="values")

    def getHistory(self, threadId:str)->list[HumanMessage|AIMessage|ToolMessage|SystemMessage]:
        """
        Get the messages history for a given thread ID

        Args:
            threadId (str): Unique identifier for a thread

        Returns:
            list[HumanMessage|AIMessage|ToolMessage|SystemMessage]: List including all recent messages here.
        """
        try:
            return self.__memory.get({"configurable": {"thread_id": threadId}})['channel_values'].get('messages', [])
        except:
            # We never for any messages from this ID, let's return an empty list
            return []

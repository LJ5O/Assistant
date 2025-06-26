from .GraphBuilder import GraphBuilder
from langgraph.checkpoint.memory import MemorySaver

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage

class CompiledGraph():
    def __init__(self, graphBuiler:GraphBuilder):
        """
        Compile a GraphBuilder object. This object can also be used to run convenient methods on it.

        Args:
            graphBuiler (GraphBuilder): A Graph builder, ready to be built.
        """

        ### TEST
        # https://medium.com/@sajith_k/using-postgresql-with-langgraph-for-state-management-and-vector-storage-df4ca9d9b89e

        from psycopg import Connection
        from langgraph.checkpoint.postgres import PostgresSaver
        conn = Connection.connect("postgresql://postgres:NeverUseMeInProd@127.0.0.1:5432", autocommit=True) # TODO, close it when done
        checkpointer = PostgresSaver(conn)
        checkpointer.setup()

        ### TEST END

        self.__rawGraph = graphBuiler
        self.__memory = checkpointer#MemorySaver()
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

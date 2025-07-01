from ..memory.Postgres import Postgres
from ..graph.CompiledGraph import CompiledGraph

from Json.Types import ConversationsRequest, AvailableConversations

from langgraph.checkpoint.memory import MemorySaver

class ContextualQueries():
    """
    How many plugins are available ? What are the available threads ?
    Such requests will be answered by this class !
    """

    def __init__(self, graph:CompiledGraph, memory:Postgres=None):
        """
        Prepares this object to answer contextual requests to the Brain

        Args:
            graph (CompiledGraph): Compiled graph, as used by the Agent
            memory (Postgres, optional): Postgres memory. Defaults to None.
        """
        self.__graph:CompiledGraph = graph
        self.__memory:Postgres = memory

    def handleConversationsRequest(self, request:ConversationsRequest)->AvailableConversations:
        """
        From a ConversationsRequest, find every threads associated with a given user ID

        Args:
            request (ConversationsRequest): Request from Node Backend

        Returns:
            AvailableConversations: A JSON object with a list of every threads available
        """
        return AvailableConversations(request.userId, self.__getThreadsForUser(request.userId))

    def __getThreadsForUser(self, user:str)->list[str]:
        if(self.__memory):
            # We have a memory we can use to get the threads
            return self.__memory.getThreadsForUser(user)
        else:
            # We are running on RAM memory
            # Really, I hope we're not in prod '-'
            mem:MemorySaver = self.__graph.getMemory() 
            # https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.InMemorySaver

            threads = []
            for e in mem.list(None): #e has type CheckpointTuple
                thread = e[0]['configurable']['thread_id']
                if(thread.startswith(user) and (thread not in threads)): threads.append(thread)
            return threads
            
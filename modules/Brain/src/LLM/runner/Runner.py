import sys

from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage, AIMessage

from ..graph.CompiledGraph import CompiledGraph
from Json.Types import UserRequest, UserAnswer, AIMessageJson, HumanMessageJson, ToolMessageJson, History

def LangChainMessageToJsonFriendlyMessage(message:HumanMessage|ToolMessage|AIMessage)->AIMessageJson|HumanMessageJson|ToolMessageJson:
    """
    Takes a message object from Langchain, and convert it to a Json friendly message

    Args:
        message (HumanMessage | ToolMessage | AIMessage): Message from LangChain

    Raises:
        NotImplementedError: In case you sent a message not supported

    Returns:
        AIMessageJson|HumanMessageJson|ToolMessageJson: Converted message
    """
    if(type(message) == HumanMessage):
        return (HumanMessageJson.fromHumanMessage(message))
    elif(type(message) == AIMessage):
        return (AIMessageJson.fromAIMessage(message))
    elif(type(message) == ToolMessage):
        return (ToolMessageJson.fromToolMessage(message))
    else:
        # Unknwown message type !
        # Related : https://python.langchain.com/docs/concepts/messages/
        raise NotImplementedError("Received an unknown message type !")

class Runner():
    """
    Class use to run cleanly the AI application by interacting properly with the graph
    """

    def __init__(self, graph:CompiledGraph):
        """
        Prepares a new instance of Runner, used to interact cleanly with the compiled graph

        Args:
            graph (CompiledGraph): Compiled graph
        """
        self.__graph:CompiledGraph = graph

    def handleUserRequest(self, request:UserRequest, systemInput:str=None) -> UserAnswer:
        """Will run the user request object through the AI app, and return the result as an UserAnswer

        Args:
            request (UserRequest): Object sent by the node backend, what the user asked us
            systemInput (str, optional): Some System context to add. Defaults to None.

        Returns:
            UserAnswer: Answer from the AI app
        """
        if(len(request.linked)>0): sys.stderr.write("[WARN] Linked elements are still a TODO and will be ignored.\n")
        humanMessage = HumanMessage(content=request.input)

        sysMessage:SystemMessage = None # Defined if a system message was passed
        if(systemInput): sysMessage = SystemMessage(content=systemInput)

        messagesFromGraph: list[AIMessageJson, HumanMessageJson, ToolMessageJson] = []
        savedIDs: list[str] = []

        for event in self.__graph.submitInput(humanMessage, systemMessage=sysMessage, threadId=request.threadId): # Waiting for events from the graph
            for message in event.get("messages", []):
                if(message.id in savedIDs): continue # Already saved

                savedIDs.append(message.id) # So we don't save it twice
                messagesFromGraph.append(LangChainMessageToJsonFriendlyMessage(message))

        # Graph execution ended, let's return the results :
        return UserAnswer(messagesFromGraph[-1].content, steps=messagesFromGraph, thread_id=request.threadId)

    def getHistory(self, threadId:str) -> History:
        """
        Get the messages associated with a given thread id

        Args:
            threadId (str): Unique ID for a thread

        Returns:
            History: Messages in this conversation
        """
        messages = self.__graph.getHistory(threadId)
        JsonFriendlyMessages = []

        for message in messages:
            JsonFriendlyMessages.append(LangChainMessageToJsonFriendlyMessage(message))
        return History(threadId, JsonFriendlyMessages)
from .GraphBuilder import GraphBuilder

from langchain_core.messages import SystemMessage, HumanMessage

class CompiledGraph():
    def __init__(self, graphBuiler:GraphBuilder):
        self.__rawGraph = graphBuiler
        self.__compiledGraph = graphBuiler.compile()

    def getGraph(self):
        return self.__compiledGraph

    def stream_graph_updates(self, user_input: str):
        #system_message = SystemMessage(content="Tu es un assistant IA. N'appelle des function seulement, et seulement si tu en as besoin pour répondre.")
        user_message = HumanMessage(content=user_input)
        for event in self.getGraph().stream({"messages": [user_message]}, {}, stream_mode="values"):
            if "messages" in event:
                event["messages"][-1].pretty_print()

    def submitInput(self, input:str):
        userMsg = HumanMessage(content=input)
        return self.getGraph().stream({"messages": [userMsg]}, {}, stream_mode="values")

from langchain.tools import Tool

def nothing(*args) -> None:
    """
    As models may crave for calling tools, even when nothing was asked, here is a tool that does nothing.
    """
    pass

def getTool(name:str="nothing", description:str="When you don't have to call any tools to answer. Accepts any args, and returns null") -> Tool:
    """
    Get the actual tool

    Returns:
        Tool: Tool object that can be used by the model
    """
    return Tool.from_function(
        func=nothing,
        name=name,
        description=description
    )

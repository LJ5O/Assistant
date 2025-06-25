from langchain.tools import Tool

from ..ToolConfig import ToolConfig

def nothing(*args) -> None:
    """
    As models may crave for calling tools, even when nothing was asked, here is a tool that does nothing.
    """
    pass

def getTool(name:str="Nothing", description:str="When you don't have to call any tools to answer. Accepts any args, and returns null") -> Tool:
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

def getConfig() -> ToolConfig:
    """
    Get the configuration for this tool

    Returns:
        ToolConfig: Project config about this tool
    """
    return ToolConfig(chatHidden=True, listHidden=True)
from langchain.tools import StructuredTool
from pydantic import BaseModel, Field

from ..ToolConfig import ToolConfig

class CalculatorInput(BaseModel):
    a: int = Field(description="first number")
    b: int = Field(description="second number")

def multiply(a: int, b:int) -> int:
    """
    Tool usable by an LLM to multiply two numbers.
    Used as an example showing how to declare and add tools

    Args:
        a (int): First number to multiply
        b (int): Second number to multiply

    Returns:
        int: Multiplication between a*b
    """
    return a*b

def getTool(name:str="Multiply", description:str="Multiply two numbers") -> StructuredTool:
    """
    Get the actual tool

    Returns:
        Tool: Tool object that can be used by the model
    """
    return StructuredTool.from_function(
        func=multiply,
        name=name,
        description=description,
        args_schema=CalculatorInput
    )

def getConfig() -> ToolConfig:
    """
    Get the configuration for this tool

    Returns:
        ToolConfig: Project config about this tool
    """
    return ToolConfig()
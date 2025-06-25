from langchain.tools import StructuredTool
from pydantic import BaseModel, Field

from ..ToolAbstract import ToolAbstract
from ..ToolConfig import ToolConfig

class CalculatorInput(BaseModel):
    a: int = Field(description="first number")
    b: int = Field(description="second number")

class MultiplyTool(ToolAbstract):

    def __init__(self, name:str="Multiply", description:str="Multiply two numbers", config:ToolConfig=None):
        self._name = name
        self._description = description

        self._tool = StructuredTool.from_function(
            func=self._multiply,
            name=self._name,
            description=self._description,
            args_schema=CalculatorInput
        )

        self._config = config if config else ToolConfig()

    def _multiply(self, a: int, b:int) -> int:
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




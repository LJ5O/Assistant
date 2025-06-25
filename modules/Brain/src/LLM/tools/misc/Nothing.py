from langchain.tools import Tool

from ..ToolConfig import ToolConfig
from ..ToolAbstract import ToolAbstract

class NothingTool(ToolAbstract):

    def __init__(self, name:str="Nothing", description:str="When you don't have to call any tools to answer. Accepts any args, and returns null", config:ToolConfig=None):
        self._name = name
        self._description = description

        self._tool = Tool.from_function(
            func=self._nothing,
            name=self._name,
            description=self._description
        )

        self._config = config if config else ToolConfig()


    def _nothing(*args) -> None:
        """
        As models may crave for calling tools, even when nothing was asked, here is a tool that does nothing.
        """
        pass
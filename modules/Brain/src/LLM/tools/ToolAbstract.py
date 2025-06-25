from langchain.tools import StructuredTool, Tool
from .ToolConfig import ToolConfig

class ToolAbstract():
    """
    Abstract object shaping the tool classes
    """

    def __init__(self):
        self._name = ""
        self._description = ""

        self._tool = None
        self._config = ToolConfig()

    def getTool(self) -> Tool|StructuredTool:
        """
        Get the Tool ready to bind to the model

        Returns:
            Tool|StructuredTool: Ready to bind tool
        """
        return self._tool

    def getConfig(self) -> ToolConfig:
        """
        Get the project configuration for this tool

        Returns:
            ToolConfig: Project config about this tool
        """
        return self._config

    def getName(self) -> str:
        return self._name

    def getDescription(self) -> str:
        return self._description
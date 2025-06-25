from langchain.tools import Tool, StructuredTool
from .ToolConfig import ToolConfig

from .math.Multiply import getTool as MultiplyTool, getConfig as MultiplyConfig
from .misc.Nothing import getTool as NothingTool, getConfig as NothingConfig

class Tools():

    multiply:Tool = MultiplyTool()
    nothing:Tool = NothingTool()

    @staticmethod
    def getAll()->list[Tool | StructuredTool]:
        """
        Gives a list including ALL tools

        Returns:
            list[Tool | StructuredTool]: ALL defined tools
        """
        return [
            MultiplyTool(),
            NothingTool()
        ]

    @staticmethod
    def getConfigs()->dict['str':ToolConfig]:
        """
        Returns a dict object, were keys are tool names, and values are a ToolConfig object.
        Useful to get tool project configs.
        """
        return {
            'Multiply':MultiplyConfig(),
            'Nothing':NothingConfig()
        }

    @staticmethod
    def getConfig(toolName:str)->ToolConfig:
        """
        Instead of returning a whole dict, queries only one tool.
        Raises if tool not found

        Returns:
            ToolConfig: Associated ToolConfig
        """
        config = Tools.getConfigs()[toolName]
        if not config: raise Exception('Tool not found !')
        return config
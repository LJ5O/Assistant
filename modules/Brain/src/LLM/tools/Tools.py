from langchain.tools import Tool, StructuredTool

from .ToolAbstract import ToolAbstract
from .ToolConfig import ToolConfig

from .math.Multiply import MultiplyTool
from .misc.Nothing import NothingTool

class Tools():

    multiply:MultiplyTool = MultiplyTool
    nothing:NothingTool = NothingTool

    @staticmethod
    def toolList()->list[ToolAbstract]:
        """
        A list of all tools objects
        -- ADD HERE NEW TOOLS --

        Returns:
            list[ToolAbstract]: List of all tools objects
        """
        return [
            MultiplyTool(),
            NothingTool(config=ToolConfig(chatHidden=True, listHidden=True))
        ]

    @staticmethod
    def getAll()->list[Tool | StructuredTool]:
        """
        Gives a list including ALL tools

        Returns:
            list[Tool | StructuredTool]: ALL defined tools
        """
        return [t.getTool() for t in Tools.toolList()]

    @staticmethod
    def getConfigs()->dict['str':ToolConfig]:
        """
        Returns a dict object, were keys are tool names, and values are a ToolConfig object.
        Useful to get tool project configs.
        """
        configs = {}
        for t in Tools.toolList():
            configs[t.getName()] = t.getConfig()
        return configs

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
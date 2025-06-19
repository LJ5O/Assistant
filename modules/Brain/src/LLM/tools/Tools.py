from langchain.tools import Tool, StructuredTool

from .math.Multiply import getTool as MultiplyTool
from .misc.Nothing import getTool as NothingTool

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
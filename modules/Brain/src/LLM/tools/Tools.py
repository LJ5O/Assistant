from langchain.tools import Tool, StructuredTool

from .math.Multiply import getTool as MultiplyTool

class Tools():

    multiply:Tool = MultiplyTool()

    @staticmethod
    def getAll()->list[Tool | StructuredTool]:
        """
        Gives a list including ALL tools

        Returns:
            list[Tool | StructuredTool]: ALL defined tools
        """
        return [
            MultiplyTool()
        ]
import json

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from LLM.tools.ToolConfig import ToolConfig
from LLM.tools.Tools import Tools


class JsonConvertible():
    """
    Used only to propagate the toJSON() method to types defined here
    """

    def toJSON(self, indent:int=None) -> str:
        """
        Get a JSON string from this object

        Args:
            indent (int, optional): Prettier output, for debug. Defaults to None.

        Returns:
            str: JSON string object
        """
        return json.dumps(self.dict, ensure_ascii=False, indent=indent)

class UserRequest(JsonConvertible):
    """
    Class used to represent a JSON object going to/from the node backend
    """

    def __init__(self, input:str, thread_id:str, linked:list[str]=[]):
        """
        Prepare a new instance of UserRequest

        Args:
            input (str): Request input. What do you want ?
            Reqtype (str, optional): Type of request. Defaults to "user_request".
            linked (list[str], optional): Anything attached ( pictures, documents ) ? Defaults to [].
        """
        self.input = input
        self.threadId = thread_id
        self.type = "userRequest"
        self.linked = linked

        self.dict = {"type":self.type, "thread_id":self.threadId, "fields":{"input":self.input, "linked":self.linked}}

    @staticmethod
    def fromJSON(json_str: str) -> 'UserRequest':
        """
        Parse a JSON string to create a UserRequest instance

        Args:
            json_str (str): JSON string to parse

        Returns:
            UserRequest: instance created from JSON data
        """
        data = json.loads(json_str)
        
        type_ = data.get("type", "userRequest")
        thread_ = data.get("thread_id", "default")
        fields = data.get("fields", {})
        input_ = fields.get("input", "")
        linked = fields.get("linked", [])

        return UserRequest(input=input_, thread_id=thread_, linked=linked)

class ToolCall(JsonConvertible):

    def __init__(self, name:str, args:list[str], id:str, hidden=False):
        """
        Prepare a tool call to be sent by JSON

        Args:
            name (str): Name of the called tool
            args (list[str]): Arguments passed
            id (str): ID of this tool
            hidden (bool, optional): Should this call be hidden ? Defaults to False.
        """
        self.name = name
        self.args = args
        self.id = id
        self.hidden = hidden

        self.dict = {
            "type": "ToolCall",
            "name": self.name,
            "args": self.args,
            "display": {
                "hidden": self.hidden
            },
            "id": self.id
        }

class AIMessageJson(JsonConvertible):

    def __init__(self, content:str, id:str, tool_calls:list[ToolCall]=[], input_tokens:int=-1, output_tokens:int=-1, total_tokens:int=-1):
        """
        Prepares an AIMessage to be sent to the node backend

        Args:
            content (str): Content of this message
            id (str): His ID
            tool_calls (list[ToolCall], optional): Tools that were called at this step. Defaults to [].
            input_tokens (int, optional): Input tokens for this message. Defaults to -1.
            output_tokens (int, optional): Output tokens. Defaults to -1.
            total_tokens (int, optional): Total number of tokens. Defaults to -1.
        """
        self.content = content
        self.id = id
        self.tools = tool_calls

        self.dict = {
            "type": "AIMessage",
            "content": self.content,
            "id": self.id,
            "tool_calls": [tool.dict for tool in self.tools],
            "usage_metadata": {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": total_tokens
            }
        }

    @staticmethod
    def fromAIMessage(message: AIMessage) -> 'AIMessageJson':
        """
        Builds an AIMessageJson ready to be sent from an HumanMesage object

        Args:
            message (AIMessage): Object given by LangChain

        Returns:
            AIMessageJson: Object json friendly
        """
        tools = []
        for tool in message.tool_calls:
            args = []
            config: ToolConfig = Tools.getConfig(tool['name']) # So we can check how this tool is supposed to be displayed

            for key in tool['args'].keys():
                args.append(f"{key}:{tool['args'][key]}")
            tools.append(ToolCall(tool['name'], args, tool['id'], hidden=config.chatHidden))
            
        return AIMessageJson(message.content, message.id, tools,
            message.usage_metadata['input_tokens'] if message.usage_metadata else None,
            message.usage_metadata['output_tokens'] if message.usage_metadata else None,
            message.usage_metadata['total_tokens'] if message.usage_metadata else None
        )

class ToolMessageJson(JsonConvertible):

    def __init__(self, name:str, content:str, id:str, tool_call_id:str="", hidden=False):
        """
        Defines a new ToolMessage ready to be sent to the node backend

        Args:
            name (str): Name of the called tool
            content (str): Answer we got from the tool
            id (str): ID of this message
            tool_call_id (str, optional): ID of the message where this tool was called. Defaults to "".
            hidden (bool, optional): Should this message be hidden ? Defaults to False
        """
        self.name = name
        self.content = content
        self.id = id
        self.toolCallID = tool_call_id
        self.hidden = hidden

        self.dict = {
            "type": "ToolMessage",
            "name": self.name,
            "content": self.content,
            "id": self.id,
            "tool_call_id": self.toolCallID,
            "display": {
                "hidden": self.hidden
            }
        }
    
    @staticmethod
    def fromToolMessage(message:ToolMessage) -> 'ToolMessageJson':
        """
        Builds a ToolMessageJson ready to be sent from an ToolMessage object

        Args:
            message (ToolMessage): Object given by LangChain

        Returns:
            ToolMessageJson: Object json friendly
        """
        config: ToolConfig = Tools.getConfig(message.name)
        return ToolMessageJson(message.name, message.content, message.id, message.tool_call_id, hidden=config.chatHidden)

class HumanMessageJson(JsonConvertible):

    def __init__(self, content:str, id:str):
        """
        Defines a new HumanMessage to be sent to the node backend

        Args:
            content (str): Text wrote by an human
            id (str): ID of this message
        """
        self.content = content
        self.id = id

        self.dict = {
            "type": "HumanMessage",
            "content": self.content,
            "id": self.id
        }

    @staticmethod
    def fromHumanMessage(message:HumanMessage) -> 'HumanMessageJson':
        """
        Builds an HumanMessageJson ready to be sent from an HumanMesage object

        Args:
            message (HumanMessage): Object given by LangChain

        Returns:
            HumanMessageJson: Object json friendly
        """
        return HumanMessageJson(message.content, message.id)

class UserAnswer(JsonConvertible):
    def __init__(
        self, 
        output:str,
        thread_id:str,
        linked:list[str]=[],
        steps:list[ToolMessageJson|AIMessageJson|HumanMessageJson]=[]
    ):
        """
        Generate a new User Answer, to answer to a request made by an user

        Args:
            output (str): Reply from the model to the user
            linked (list[str], optional): Attached elements. Links to a document, picture... Defaults to [].
            steps (list[BrainStep], optional): Though steps, or history. Defaults to [].
        """
        self.output = output
        self.threadId = thread_id
        self.linked = linked
        self.steps = [step.dict for step in steps]

        self.dict = {
            "type": "UserAnswer",
            "thread_id": self.threadId,
            "fields": {
                "output": self.output,
                "linked": self.linked,
                "steps": self.steps
            }
        }

class History(JsonConvertible):
    def __init__(self, threadId:str, messages:list[HumanMessageJson|AIMessageJson|ToolMessageJson]):
        self.messages = messages
        self.threadId = threadId
        self.dict = {
            "type": "History",
            "thread_id": self.threadId,
            "messages": [m.dict for m in self.messages]
        }

class HistoryRequest(JsonConvertible):
    def __init__(self, threadId:str):
        self.threadId = threadId
        self.dict = {
            "type": "HistoryRequest",
            "thead_id": threadId
        }

    @staticmethod
    def fromJSON(json_str: str) -> 'HistoryRequest':
        """
        Parse a JSON string to create a HistoryRequest instance

        Args:
            json_str (str): JSON string to parse

        Returns:
            UserRequest: instance created from JSON data
        """
        data = json.loads(json_str)
        
        thread_ = data['thread_id']
        return HistoryRequest(thread_)

class ConversationsRequest(JsonConvertible):
    def __init__(self, userId:str):
        self.userId = userId
        self.dict = {
            "type": "ConversationsRequest",
            "user_id": self.userId
        }

    @staticmethod
    def fromJSON(json_str: str)-> 'ConversationsRequest':
        """
        Parse a JSON string to create a ConversationsRequest instance

        Args:
            json_str (str): JSON string to parse

        Returns:
            ConversationsRequest: instance created from JSON data
        """
        data = json.loads(json_str)
        
        user = data['user_id']
        return ConversationsRequest(user)

class AvailableConversations(JsonConvertible):
    def __init__(self, userId:str, threads:list[str]):
        self.userId = userId
        self.threads = threads

        self.dict = {
            "type": "AvailableConversations",
            "user_id": self.userId,
            "threads": self.threads
        }
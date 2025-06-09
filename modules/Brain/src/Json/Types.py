import json

class UserRequest():
    """
    Class used to represent a JSON object going to/from the node backend
    """

    def __init__(self, input:str, Reqtype:str="user_request", linked:list[str]=[]):
        """
        Prepare a new instance of UserRequest

        Args:
            input (str): Request input. What do you want ?
            Reqtype (str, optional): Type of request. Defaults to "user_request".
            linked (list[str], optional): Anything attached ( pictures, documents ) ? Defaults to [].
        """
        self.input = input
        self.type = Reqtype
        self.linked = linked

        self.dict = {"type":self.type, "fields":{"input":self.input, "linked":self.linked}}

    def toJSON(self) -> str:
        """
        Prepare the object to the JSON format

        Returns:
            str: JSON string
        """
        return json.dumps(self.dict, ensure_ascii=False)

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
        
        type_ = data.get("type", "user_request")
        fields = data.get("fields", {})
        input_ = fields.get("input", "")
        linked = fields.get("linked", [])

        return UserRequest(input=input_, Reqtype=type_, linked=linked)

class BrainStep():
    def __init__(self, action:str, input:str, output:str, id:str=None):
        """
        Create a new BrainStep object used to communicate with node backend

        Args:
            action (str): _description_
            input (str): _description_
            output (str): _description_
            id (str, optional): _description_. Defaults to None.
        """
        self.action = action
        self.input = input
        self.output = output
        self.id = id

        self.dict = {
            "action": self.action,
            "input": self.input,
            "output": self.output,
            "id": self.id
        }

    def toJSON(self) -> str:
        """
        Transforms this object into a JSON string

        Returns:
            str: JSON string
        """
        return json.dumps(self.dict, ensure_ascii=False)

class UserAnswer():
    def __init__(
        self, 
        output:str, 
        ansType:str="user_answer",
        calledTools:list[str]=[],
        linked:list[str]=[],
        steps:list[BrainStep]=[]
    ):
        """
        Generate a new User Answer, to answer to a request made by an user

        Args:
            output (str): Reply from the model to the user
            ansType (str, optional): Reply type. Defaults to "user_answer".
            calledTools (list[str], optional): List of tools that were used. Defaults to [].
            linked (list[str], optional): Attached elements. Links to a document, picture... Defaults to [].
            steps (list[BrainStep], optional): Though steps, or history. Defaults to [].
        """
        self.output = output
        self.type = ansType
        self.calledTools = calledTools
        self.linked = linked
        self.steps = [step.dict for step in steps]

        self.dict = {
            "type": self.type,
            "fields": {
                "output": self.output,
                "called_tools": self.calledTools,
                "linked": self.linked,
                "steps": self.steps
            }
        }
    
    def toJSON(self) -> str:
        """
        Converts this object into a JSON string

        Returns:
            str: JSON string
        """
        return json.dumps(self.dict, ensure_ascii=False)
from .Types import UserRequest, HistoryRequest, ConversationsRequest

import json

class unknownJsonObject(Exception):
    def __init__(self, message="We got an unknown JSON object !"):
        super().__init__(message)

class InvalidInputException(Exception):
    def __init__(self, message="The string we received was not formatted in JSON !"):
        super().__init__(message)

def processInput(input:str) -> UserRequest|HistoryRequest:
    """
    Gets the input sent by Nodejs backend, and process it to get an object we can work on

    Args:
        input (str): JSON string we received

    Returns:
        UserRequest|HistoryRequest|ConversationsRequest: Object representing this JSON string
    """
    try:
        data = json.loads(input.strip())

        type_ = data["type"]
        if(type_=="UserRequest"):
            return UserRequest.fromJSON(input)
        elif(type_=="HistoryRequest"):
            return HistoryRequest.fromJSON(input)
        elif(type_=="ConversationsRequest"):
            return ConversationsRequest.fromJSON(input)
        else:
            raise unknownJsonObject()
    except json.JSONDecodeError as e:
        raise InvalidInputException(f"Invalid JSON received : {e}")


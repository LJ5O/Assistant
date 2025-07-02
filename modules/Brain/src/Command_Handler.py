import json
import sys

from LLM.LLM import LLM
from Json.Types import UserRequest, UserAnswer, HistoryRequest, History, ConversationsRequest, AvailableConversations

class unknownJsonRequestObject(Exception):
    def __init__(self, message="Received an unknown JSON request type !"):
        super().__init__(message)

def handle_command(llm:LLM, command:str)->str|None:
    """
    This function takes the JSON input sent by the Node Backend, and will return the JSON output ready to be sent back

    Args:
        llm (LLM): Agent main class, so we can interact with it and run the requests
        command (str): Valid JSON input. Should be something like {UUID:string, request:<Any request Object>}

    Returns:
        str|None: Valid JSON output. Will be something like {UUID:string, answer:<Any answer Object>}. May be None if exception occured.
    """

    # Let's try to load the JSON string
    try:
        command = json.loads(command)
        uuid = command['UUID']
        request = command['request']

        if(request['type'] == 'UserRequest'):
            r = UserRequest.fromJSON(request)
            a = llm.getRunner().handleUserRequest(r)

        elif(request['type'] == 'HistoryRequest'):
            r = HistoryRequest.fromJSON(request)
            a = llm.getRunner().getHistory(r.threadId)

        elif(request['type'] == 'ConversationsRequest'):
            r = ConversationsRequest.fromJSON(request)
            a = llm.query().handleConversationsRequest(r)
        
        else:
            # Unknown request !
            raise unknownJsonRequestObject()

        output = {
            "UUID": uuid,
            "answer": a.dict # a.toJSON() is also available
        }
        return json.dumps(output) # Return JSON string ready to be sent back


    except json.JSONDecodeError as e:
        sys.stderr.write("Error: A non JSON input was received !\n")
        return None

    except unknownJsonRequestObject as e:
        sys.stderr.write("Error: Unknown request type !\n")
        return None

if __name__ == "__main__":
    print("Hi ! This file is only defining some utils functions used by main.py to manage incoming requests.")
    print("If you would like to run the Brain subprocess from console, please try 'python src/main.py -t true' and send messages there.")
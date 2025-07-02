import sys
from LLM.LLM import LLM
from LLM.memory.Postgres import Postgres

from Json.utils import processInput
from Json.Types import UserRequest, UserAnswer, HistoryRequest, History, ConversationsRequest, AvailableConversations

class Brain():
    """
    Class used to manage the LLM in charge of the AI.
    """

    def __init__(self, model_version:str, prelude:str="", test:bool=False, memory:str=None):
        """Instanciate a new Brain object, that is the central place where we manage the text generation model
        Usually ran as a subprocess. If model is successfully loaded, we directly start the processing loop.

        Args:
            model_version (str): What version of GPT4All model should we use ?
            prelude (str): A text included everytime we ask something to the AI. Defaults to \"\"
            test (bool): Manual test mode, don't use this unless you know what you are doing. Defaults to False
            memory (str, optional): Where to store memories, should be a PostgreSQL URI. Defaults to None, in RAM.
        """
        try:
            self.__prelude = prelude # TODO, useless
            self.__modelVersion = model_version
            self.__memory = None

            # Preparing Postgres
            if memory:
                self.__memory = Postgres(DB_URI=memory) # Auto starts

            self.__LLM = LLM(self.__modelVersion, memory=self.__memory)
            self.__TEST = test
            
        except Exception as err:
            sys.stderr.write("$error$ : can't start or load the model ! Are you sure you gave a valid version ?\n") # TODO for better error management
            import traceback
            traceback.print_exception(type(err), err, err.__traceback__, file=sys.stderr)
            return # Don't start the loop, stops here
        
        # Start the work loop !
        try:
            self.__launchProcessLoop()
        except Exception as err:
            import traceback
            traceback.print_exception(type(err), err, err.__traceback__, file=sys.stderr)
        finally:
            if self.__memory: # Let's not forget to close this
                if self.__memory.isReady(): self.__memory.close()

    def __launchProcessLoop(self):
        """
        When everything is ready, we can use this method to start the loop managing requests
        The subprocess will start to listen to commands and will respond with the result.
        """

        print("{\"UUID\":\"\", \"answer\":\"ready\"}") # So parent process knows we're ready to work
        sys.stdout.flush() # Flush to "sent" it to parent process

        while True:

            command = sys.stdin.readline().strip() # Wait for a command
            if command.lower() == "exit": 
                break

            if not self.__TEST:
                # Classical behavior

                # --- Temporary fix ---
                import json #TODO : Better management of messages
                command = json.loads(command)
                uuid = command['UUID']
                command = json.dumps(command['request'])
                # --- Temporary fix ---

                request = processInput(command) # JSON -> Object
                if(type(request) is UserRequest):
                    answer:UserAnswer = self.__LLM.getRunner().handleUserRequest(request) # Processing
                elif(type(request) is HistoryRequest):
                    answer:History = self.__LLM.getRunner().getHistory(request.threadId)
                elif(type(request) is ConversationsRequest):
                    answer:AvailableConversations = self.__LLM.query().handleConversationsRequest(request)
                else:
                    raise NotImplementedError("Unknown command !")

                print("{\"UUID\":\""+uuid+"\", \"answer\":"+answer.toJSON()+"}") # Answer object -> JSON # --- Temporary fix ---
                sys.stdout.flush()
            
            else:
                # TEST MODE
                # Inputs are no longer JSON, but simple strings, easier to test manually in console
                # Have fun !
                thread_id = "test"

                request = UserRequest(command, thread_id)
                answer = self.__LLM.getRunner().handleUserRequest(request) # Processing
                print(answer.toJSON()) # Answer object -> JSON

                print('-'*20)
                print(answer.output)
                print('-'*20)

                sys.stdout.flush()

# -------------------

def printHelp():
    print("Brain - Help - If you don't know what you're doing, you are in the wrong place !")
    print("This subprocess takes your human input, and will think about something to answer\n")
    print("Valid args :\n")
    print("-m <Model> : Models from Ollama, or 'test' for testing purposes")
    print("-p \"[The text you want to append at the begining of every request made to the AI.]\" : That's a good place to remember it to answer as you like. ")
    print("-t <true|false> : General testing mode, you should not use this unless you are testing manually the system")
    print("--postgres <URI String> : Uses PostgresSQL to store Agent memories")

if __name__ == "__main__":

    if("-h" in sys.argv): # Displaying help
        printHelp()
        sys.exit(0)

    # Defining default values
    model_to_use:str = "llama3.1:8b" # -m
    prelude:str = "" # -p
    test:bool = False # -t
    memory:str = None # --postgres

    for i in range(1, len(sys.argv), 2):
        arg = sys.argv[i]
        value = sys.argv[i+1]

        if arg == "-m":
            model_to_use = value

        elif arg == "-p":
            prelude = value

        elif arg == "-t":
            test = True if value == "true" else False

        elif arg == "--postgres":
            memory = value

    # We're now ready to start the real work here !
    manager = Brain(model_version=model_to_use, prelude=prelude, test=test, memory=memory)

# The idea for it to work :
# 1 - This file is launched as a subprocess
# 2 - Parent awaits to receive "ready"
# 3 - Parent sends JSON objects and child works on them
# 4 - Parents can receive the answer
# 5 - When it's finished, parent can send "exit" to stop this

# TEST command : python src/main.py -t true --postgres "postgresql://postgres:NeverUseMeInProd@127.0.0.1:5432"
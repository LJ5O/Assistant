print("Brain backend - Starting...")

import sys
from LLM.LLM import LLM

class Brain():
    """
    Class used to manage the LLM in charge of the AI.
    """

    def __init__(self, model_version:str, prelude:str=""):
        """
        Instanciate a new Brain object, that is the central place where we manage the text generation model
        Usually ran as a subprocess. If model is successfully loaded, we directly start the processing loop.

        Args:
            model_version (str): What version of GPT4All model should we use ?
            prelude (str): A text included everytime we ask something to the AI. Defaults to \"\"
        """
        try:
            self.__prelude = prelude # TODO, useless
            self.__modelVersion = model_version
            self.__LLM = LLM(self.__modelVersion)
            
        except:
            print("$error$ : can't start or load the model ! Are you sure you gave a valid version ?") # TODO for better error management
            return # Don't start the loop, stops here
        
        # Start the work loop !
        self.__launchProcessLoop()

    def __launchProcessLoop(self):
        """
        When everything is ready, we can use this method to start the loop managing requests
        The subprocess will start to listen to commands and will respond with the result.
        """

        print("ready") # So parent process knows we're ready to work
        sys.stdout.flush() # Flush to "sent" it to parent process

        while True:

            command = sys.stdin.readline().strip() # Wait for a command
            if command.lower() == "exit": 
                break

            self.__LLM.graph.stream_graph_updates(command)
            sys.stdout.flush()


# -------------------

def printHelp():
    print("Brain - Help - If you don't know what you're doing, you are in the wrong place !")
    print("This subprocess takes your human input, and will think about something to answer\n")
    print("Valid args :\n")
    print("-m <Model> : Models from Ollama")
    print("-p \"[The text you want to append at the begining of every request made to the AI.]\" : That's a good place to remember it to answer as you like. ")

if __name__ == "__main__":

    if("-h" in sys.argv): # Displaying help
        printHelp()
        sys.exit(0)

    # Defining default values
    model_to_use:str = "llama3.1:8b" # -m
    prelude:str = "" # -p

    for i in range(1, len(sys.argv), 2):
        arg = sys.argv[i]
        value = sys.argv[i+1]

        if arg == "-m":
            model_to_use = value

        elif arg == "-p":
            prelude = value

    # We're now ready to start the real work here !
    manager = Brain(model_version=model_to_use, prelude=prelude)

# The idea for it to work :
# 1 - This file is launched as a subprocess
# 2 - Parent awaits to receive "ready"
# 3 - Parent sends JSON objects and child works on them
# 4 - Parents can receive the answer
# 5 - When it's finished, parent can send "exit" to stop this
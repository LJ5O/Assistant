# Brain
> Python subprocess in charge of managing AIs.

This small server is waiting for JSON inputs from the **Back-end**, and will ask to an Agent to generate an answer.

## Installation

You can start by creating a Python environment for this project
```
python3 -m venv .venv
source .venv/bin/activate
```

Then, you can install dependencies,
```
pip install -r requirements.txt
```

And start the Brain
```
python src/main.py -t true
```
Usage of `-t` is the "test mode", the Brain is not expecting JSON inputs, but text strings, which is easier to test and work on.
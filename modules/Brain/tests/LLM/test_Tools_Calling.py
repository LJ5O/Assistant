from LLM.LLM import LLM

llm = LLM(model="qwen3:0.6b") # Small model able to use tools
runner = llm.getRunner()

def test_call_Multiply():
    from Json.Types import UserRequest

    request = UserRequest("Hi, what's 45*78", "default")
    steps = runner.handleUserRequest(request).steps
    for step in steps:
        if step['type'] == "ToolMessage":
            # That's the tool anwser, let's check it's right
            assert step['content'] == str(45*78)
            return
    raise Exception("Tool was not called !")
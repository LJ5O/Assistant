from LLM.LLM import LLM

llm = LLM(model="test")
runner = llm.getRunner()

def test_llm_call():
    from Json.Types import UserRequest

    request = UserRequest("Hello World", "default")
    # The test model/provider always returns "OK"
    assert runner.handleUserRequest(request).output == "OK"
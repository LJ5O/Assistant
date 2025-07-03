from LLM.LLM import LLM
from Json.Types import UserRequest, HistoryRequest, ConversationsRequest

llm = LLM(model="qwen3:0.6b") # Small model able to use tools
runner = llm.getRunner()

def test_llm_short_memory():
    request = UserRequest("Hi ! My name is TEST123", "user1.default")
    runner.handleUserRequest(request)

    request = UserRequest("What was my name ?", "user1.default")
    assert "TEST123" in runner.handleUserRequest(request).output
    
    request = UserRequest("What was my name ?", "user2.other_thread")
    assert "TEST123" not in runner.handleUserRequest(request).output

def test_llm_get_history():
    request = HistoryRequest("user1.default")
    history = runner.getHistory(request.threadId)

    assert len(history.messages)>0 # Messages must be present
    assert "TEST123" in history.messages[-1].content # Must get the history of conv from previous test

def test_llm_get_available_conversations():
    request = ConversationsRequest("user1")
    convs = llm.query().handleConversationsRequest(request)

    assert len(convs.threads) == 1
    assert convs.threads[0] == "user1.default"
    assert convs.userId == "user1"
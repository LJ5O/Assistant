// User request to Brain
interface UserRequest {
  type: "UserRequest";
  thread_id: string;
  fields: {
    input: string;
    linked: string[];
  };
}
export type { UserRequest };

// Query sent to Brain
interface QueryModules {
  type: "query:modules";
  fields: Record<string, never>;
}
export type { QueryModules };

interface HumanMessage {
  type: 'HumanMessage';
  content: string;
  id: string;
}
export type { HumanMessage };

interface ToolCall {
  type: 'ToolCall'
  name: string;
  args: string[];
  id: string;
}
export type { ToolCall };

interface AIMessage {
  type: 'AIMessage';
  content: string;
  id: string;
  tool_calls: ToolCall[];
  usage_metadata: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  }
}
export type { AIMessage };

interface ToolMessage {
  type: 'ToolMessage';
  name: string;
  content: string;
  id: string;
  tool_call_id: string;
}
export type { ToolMessage };

// Answer from Brain
interface UserAnswer {
  type: "UserAnswer";
  thread_id: string;
  fields: {
    output: string;
    linked: string[];
    steps: (HumanMessage|AIMessage|ToolMessage)[];
  };
}
export type { UserAnswer };

interface History {
  type: "History",
  thread_id: string,
  messages: (HumanMessage|AIMessage|ToolMessage)[]
}
export type { History };

interface HistoryRequest {
  type: "HistoryRequest",
  thread_id: string
}
export type { HistoryRequest };
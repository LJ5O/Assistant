// User request to Brain
export interface UserRequest {
  type: "UserRequest";
  thread_id: string;
  fields: {
    input: string;
    linked: string[];
  };
}

// Query sent to Brain
export interface QueryModules {
  type: "query:modules";
  fields: Record<string, never>;
}

export interface HumanMessage {
  type: 'HumanMessage';
  content: string;
  id: string;
}

export interface ToolCall {
  type: 'ToolCall'
  name: string;
  args: string[];
  id: string;
}

export interface AIMessage {
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

export interface ToolMessage {
  type: 'ToolMessage';
  name: string;
  content: string;
  id: string;
  tool_call_id: string;
}

// Answer from Brain
export interface UserAnswer {
  type: "UserAnswer";
  thread_id: string;
  fields: {
    output: string;
    linked: string[];
    steps: (HumanMessage|AIMessage|ToolMessage)[];
  };
}
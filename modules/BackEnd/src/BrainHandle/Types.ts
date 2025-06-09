// User request to Brain
export interface UserRequest {
  type: "user_request";
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

// Step in Brain though process
export interface BrainStep {
  action: "chatbot" | "tool";
  input: string;
  output: string;
  id: string;
}

// Answer from Brain
export interface UserAnswer {
  type: "user_answer";
  fields: {
    output: string;
    called_tools: string[];
    linked: string[];
    steps: BrainStep[];
  };
}
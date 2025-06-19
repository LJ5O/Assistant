/**
 * Hi ! In this file, we are importing types defined in the Node TS backend, and re-exporting them.
 * If one day, we need to move the backend ( which will probably happen at some point ), 
 * we will only need to update this file alone, and not every single import we are doing to types.
 * Finding a better way to import this is also a TODO
 */

import type {
    UserAnswer,
    UserRequest,
    HumanMessage,
    ToolCall,
    AIMessage,
    ToolMessage,
    History,
    HistoryRequest
} from '../../../../../modules/BackEnd/src/Types/BrainHandle'

export type {
    UserAnswer,
    UserRequest,
    HumanMessage,
    ToolCall,
    AIMessage,
    ToolMessage,
    History,
    HistoryRequest
}
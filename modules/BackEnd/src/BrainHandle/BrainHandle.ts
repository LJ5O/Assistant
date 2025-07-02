import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import crypto from "crypto"

import {UserRequest, UserAnswer, HistoryRequest, History, ConversationsRequest, AvailableConversations} from '../Types/BrainHandle'

type Requests = UserRequest|HistoryRequest|ConversationsRequest // Types used to ask something to the brain
type Answers = UserAnswer|History|AvailableConversations // Types used to receive an asnwer from the brain

interface BrainRequest{
  UUID:string,
  request: Requests
}
interface BrainAnswer{
  UUID:string,
  answer: Answers
}

export class BrainManager {
    
  private process: ChildProcessWithoutNullStreams | null = null;
  private ready: boolean = false;
  private messagesFile: string[] = [];

  constructor(private scriptPath: string) {}

  async start(model:string|undefined=undefined): Promise<void> {
    if (this.process) {
      console.log("Process already running");
      return;
    }

    if(model) this.process = spawn("python3", [this.scriptPath, '-m', model]);
    else this.process = spawn("python3", [this.scriptPath]);
    

    this.process.stdout.on("data", (data) => {
      this.messagesFile.push(data);
    });

    this.process.stderr.on("data", (data) => {
      console.error(`[BRAIN ERROR]: ${data}`);
    });

    this.process.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      this.process = null;
      this.ready = false;
      if(code!=0) process.exit(1);
    });

    // Check for Brain start
    const message = await this.getAnswerFromBrain(3000, '') as string;
    if(message.trim() == "ready"){
        console.log("Python process started.");
        this.ready = true;
    }else{
      console.error("ERROR : Brain seems to be not working...")
      this.stop();
      process.exit(1); // Error, we stop here
    }
    
  }

  private sendRaw(input:string):void{
    if (!this.process) {
      console.error("Process not started");
      return;
    }
    this.process.stdin.write(input + "\n");
  }

  send(input: BrainRequest): void {
    if (!this.process) {
      console.error("Process not started");
      return;
    }
    this.process.stdin.write(JSON.stringify(input) + "\n");
  }

  async ask(input: Requests): Promise<Answers> {
    /**
     * Ask something to the brain, and wait for the answer
     * Will always return the corresponding Answer object ( UserRequest -> UserAnswer; HistoryRequest->History, ... )
     */
    const uuid:string = crypto.randomUUID();
    this.send({
      UUID: uuid,
      request: input
    } as BrainRequest);

    const answer = await this.getAnswerFromBrain(50000, uuid) as BrainAnswer
    return answer.answer
  }

  stop(): void {
    if (this.process) {
      this.sendRaw("exit")
      this.process = null;
      this.ready = false;
    }
  }

  getAnswerFromBrain(timeoutMs:number = 5000, uuid:string): Promise<BrainAnswer|string>{
    /**
     * Awaits for a message to be available in the Brain messages arrivals waiting room.
     * It will be returned as a BrainAnswer if can be JSON parsed, string otherwise 
     */
    return new Promise<BrainAnswer|string>((resolve, reject)=>{

      let stop = false; // Timeout stop, stops the recursive check
      let found = false; // Found : stops the timeout rejection
      let timeoutId: NodeJS.Timeout // So we can clear this timeout when finished
      const check = ()=>{
        if(stop)return; // Timeout reached
        console.log("lookin")
        try{
          if(this.messagesFile.length>0){ // If some messages are waiting // TODO : avoid messages indefinitely here

            for(let i=0; i<this.messagesFile.length; i++){ // For each message
              const v = this.messagesFile[i]
              try{
                const obj:BrainAnswer = JSON.parse(v); // Try to load this message

                console.log(obj.UUID +' '+ uuid)
                console.log(obj.UUID === uuid)
    
                if(obj.UUID === uuid){ // If that's the one we're looking for
                  this.messagesFile.splice(i,1); // We found the message we were looking for !
                  found = true;stop = true;
                  clearTimeout(timeoutId)
                  resolve(obj);
                  return
                }
              }catch(e){
                // Not a JSON object, certainly the "ready" from server startup
                if((v+'').trim() === "ready"){
                  found = true;stop = true;
                  clearTimeout(timeoutId)
                  this.messagesFile.splice(i,1)
                  resolve(v+''); // v may be a Buffer
                }else{
                  console.log(e)
                  // TODO error on invalid JSON
                  
                }
              }
            }

          }else{
            setTimeout(check, 100);
          }
        }catch(err){
          reject(err);
        }
      }

      timeoutId = setTimeout(()=>{
        stop = true;
        if(!found)reject(new Error("Timeout for answer awaiting"));
      }, timeoutMs);
      check();
    })
  }

  getSubprocess():ChildProcessWithoutNullStreams | null{
    return this.process
  }

  isReady():boolean{
    return this.ready
  }
}
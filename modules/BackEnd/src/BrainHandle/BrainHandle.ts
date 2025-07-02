import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import crypto from "crypto"

import {UserRequest, UserAnswer, HistoryRequest, History, ConversationsRequest, AvailableConversations} from '../Types/BrainHandle'

type BrainReady = string // That's for the "ready" sent by the Brain subprocess

type Requests = UserRequest|HistoryRequest|ConversationsRequest // Types used to ask something to the brain
type Answers = BrainReady|UserAnswer|History|AvailableConversations // Types used to receive an asnwer from the brain

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
  private messagesMap: Map<string, Answers> = new Map();

  constructor(private scriptPath: string) {}

  async start(model:string|undefined=undefined): Promise<void> {
    if (this.process) {
      console.log("Process already running");
      return;
    }

    if(model) this.process = spawn("python3", [this.scriptPath, '-m', model]);
    else this.process = spawn("python3", [this.scriptPath]);
    

    this.process.stdout.on("data", (data) => {
      try{
        const obj = JSON.parse(data) as BrainAnswer
        this.messagesMap.set(obj.UUID, obj.answer)
      }catch{
        console.error("Received non JSON output from Python Brain ! This is a Fatal error !\n"+data)
        this.stop()
        process.exit(1)
      }
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
    const message = await this.getAnswerFromBrain('') as BrainReady;
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

    const answer = await this.getAnswerFromBrain(uuid) as Answers
    return answer
  }

  stop(): void {
    if (this.process) {
      this.sendRaw("exit")
      this.process = null;
      this.ready = false;
    }
  }

  getAnswerFromBrain(uuid:string, timeoutMs:number = 5000): Promise<Answers>{
    /**
     * Awaits for a message to be available in the Brain messages arrivals waiting room.
     * It will be returned as a BrainAnswer if can be JSON parsed, string otherwise 
     */
    return new Promise<Answers>((resolve, reject)=>{
      let stop = false;
      let iters = 0;
      
      const check = () => {
        if(iters>timeoutMs/100){
          // TODO : Add uuid to deletion scheduled list
          reject(new Error(`Timeout waiting for message with UUID: ${uuid}`))
          return
        }
        
        if(this.messagesMap.has(uuid)){
          // Available, let's resolve
          const value = this.messagesMap.get(uuid)
          this.messagesMap.delete(uuid)
          resolve(value!)
          return
        }else{
          // Not yet, let's wait
          iters++
          setTimeout(check, 100);
        }
      }
      check()
    })
  }

  getSubprocess():ChildProcessWithoutNullStreams | null{
    return this.process
  }

  isReady():boolean{
    return this.ready
  }
}
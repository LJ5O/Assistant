import { spawn, ChildProcessWithoutNullStreams } from "child_process";

import {UserRequest, UserAnswer} from './Types'
import { rejects } from "assert";

export class BrainManager {
    
  private process: ChildProcessWithoutNullStreams | null = null;

  private messagesFile: string[] = [];

  constructor(private scriptPath: string) {}

  start(): void {
    if (this.process) {
      console.log("Process already running");
      return;
    }

    this.process = spawn("python3", [this.scriptPath]);

    this.process.stdout.on("data", (data) => {
      this.messagesFile.push(data);
    });

    this.process.stderr.on("data", (data) => {
      console.error(`[BRAIN ERROR]: ${data}`);
    });

    this.process.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      this.process = null;
    });

    // Check for Brain start
    this.getAnswerFromBrain().then(message=>{
      if(message.trim() == "ready") console.log("Python process started.");
      else{
        console.error("ERROR : Brain seems to be not working...")
        this.stop();
        process.exit(1); // Error, we stop here
      }
    });
    
  }

  send(input: string): void {
    if (!this.process) {
      console.error("Process not started");
      return;
    }
    this.process.stdin.write(input + "\n");
  }

  ask(input: UserRequest): void {
    this.send(JSON.stringify(input));
  }

  stop(): void {
    if (this.process) {
      this.send("exit")
      this.process = null;
    }
  }

  getAnswerFromBrain(timeoutMs:number = 5000): Promise<string>{
    /**
     * Awaits for a message to be available in the Brain messages arrivals waiting room.
     * It will be returned as a String
     */
    return new Promise<string>((resolve, reject)=>{

      let stop = false; // Timeout stop, stops the recursive check
      let found = false; // Found : stops the timeout rejection
      const check = ()=>{
        if(stop)return; // Timeout reached

        try{
          if(this.messagesFile.length>0){ // A message arrived !
            const msg:string = this.messagesFile[0]
            this.messagesFile.splice(0,1); // Remove the message we just took
            found = true;
            resolve((''+msg).trim()); // msg may be a Buffer, ''+ is used to convert it to String
          }else{
            setTimeout(check, 100);
          }
        }catch(err){
          reject(err);
        }
      }

      setTimeout(()=>{
        stop = true;
        if(!found)reject(new Error("Timeout for answer awaiting"));
      }, timeoutMs);
      check();
    })
  }
}
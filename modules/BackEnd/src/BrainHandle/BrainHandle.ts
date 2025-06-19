import { spawn, ChildProcessWithoutNullStreams } from "child_process";

import {UserRequest, UserAnswer, HistoryRequest, History} from '../Types/BrainHandle'

export class BrainManager {
    
  private process: ChildProcessWithoutNullStreams | null = null;
  private ready: boolean = false;
  private messagesFile: string[] = [];

  constructor(private scriptPath: string) {}

  start(model:string|undefined=undefined): void {
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
    this.getAnswerFromBrain(3000).then(message=>{
      if(message.trim() == "ready"){
        console.log("Python process started.");
        this.ready = true;
      }
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

  async ask(input: UserRequest): Promise<UserAnswer> {
    this.send(JSON.stringify(input));
    return JSON.parse(await this.getAnswerFromBrain(5000, input.thread_id))
  }

  async askHistory(input: HistoryRequest): Promise<History> { // TODO : Merge the two ask methods
    this.send(JSON.stringify(input));
    return JSON.parse(await this.getAnswerFromBrain(5000, input.thread_id))
  }

  stop(): void {
    if (this.process) {
      this.send("exit")
      this.process = null;
      this.ready = false;
    }
  }

  getAnswerFromBrain(timeoutMs:number = 5000, threadIdFilter:string|undefined = undefined): Promise<string>{
    /**
     * Awaits for a message to be available in the Brain messages arrivals waiting room.
     * It will be returned as a String
     */
    return new Promise<string>((resolve, reject)=>{

      let stop = false; // Timeout stop, stops the recursive check
      let found = false; // Found : stops the timeout rejection
      let timeoutId: NodeJS.Timeout // So we can clear this timeout when finished
      const check = ()=>{
        if(stop)return; // Timeout reached

        try{
          if(this.messagesFile.length>0 && !threadIdFilter){ // A message arrived !
            const msg:string = this.messagesFile[0] // Just take the first one
            this.messagesFile.splice(0,1); // Remove the message we just took
            found = true;
            clearTimeout(timeoutId)
            resolve((''+msg).trim()); // msg may be a Buffer, ''+ is used to convert it to String
          }else if(this.messagesFile.length>0 && threadIdFilter){

            this.messagesFile.map((v,i)=>{
              // We are looking for one message corresponding to the filter
              try{
                if(JSON.parse(v).thread_id == threadIdFilter){
                  this.messagesFile.splice(i,1); // We found the message we were looking for !
                  found = true;
                  clearTimeout(timeoutId)
                  resolve((''+v).trim());
                }
              }catch{}
            })

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
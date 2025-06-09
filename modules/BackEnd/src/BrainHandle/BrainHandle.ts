import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export class BrainManager {
    
  private process: ChildProcessWithoutNullStreams | null = null;

  constructor(private scriptPath: string) {}

  start(): void {
    if (this.process) {
      console.log("Process already running");
      return;
    }

    this.process = spawn("python3", [this.scriptPath]);

    this.process.stdout.on("data", (data) => {
      console.log(`[PYTHON STDOUT]: ${data}`);
    });

    this.process.stderr.on("data", (data) => {
      console.error(`[PYTHON STDERR]: ${data}`);
    });

    this.process.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      this.process = null;
    });

    console.log("Python process started.");
  }

  send(input: string): void {
    if (!this.process) {
      console.error("Process not started");
      return;
    }
    this.process.stdin.write(input + "\n");
  }

  stop(): void {
    if (this.process) {
      this.send("exit")
      this.process = null;
      console.log("Python process stopped.");
    }
  }
}
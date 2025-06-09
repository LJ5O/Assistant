import { BrainManager } from "./BrainHandle/BrainHandle";
import { UserRequest } from "./BrainHandle/Types";

const manager = new BrainManager("../Brain/src/main.py");

manager.start();

// Exemple d'envoi de commande après un délai
setTimeout(() => {

  const r:UserRequest = {
    type: "user_request",
    fields: {
      input: "Hello, what's 2*4 .",
      linked:[]
    }
  }

  manager.ask(r);
}, 5000);

// Arrêt après 10 secondes
setTimeout(() => {
  manager.stop();
}, 15000);

import { BrainManager } from "./BrainHandle/BrainHandle";

const manager = new BrainManager("../Brain/src/main.py");

manager.start();

// Exemple d'envoi de commande après un délai
setTimeout(() => {
  manager.send("Bonjour ! Que font 2*2 ?");
}, 5000);

// Arrêt après 10 secondes
setTimeout(() => {
  manager.stop();
}, 15000);

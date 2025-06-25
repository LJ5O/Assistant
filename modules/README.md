# Modules

> Where everything working under the hood is stored !

This folder is were modules not directly shown to end-users are stored. I can be NodeJS Backend, the Brain subprocess, videogames playing bots, and others utilities.

Stored modules are :

- **BackEnd** : This Typescript NodeJS server exposes an **HTTP API** that can be used by any **front-end** (*see `/app`*). Alongside this API, the **Brain subprocess** is also started. **BackEnd** is essentially a layer between the **HTTP API**, and the **Brain**.
- **Brain** : A Python server launched as a subprocess, used to interact with **AI models**. It receives **JSON inputs** by *stdin*, and returns **JSON outputs** by *stdout*. This program is also in charge of executing **Tools** called by AIs, and others tasks.
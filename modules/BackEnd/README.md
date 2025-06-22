# BackEnd
This folder is the main **back-end** for the app. The role of this *NodeJS* server is to serve as a bridge between **front-ends** and the Python subprocess (brain) in charge of AIs.

## Installation

Start by installing dependencies with
```
npm i --include=dev
```

Then, launch the project with
```
npm run start
```

You can also run some tests, for checking types, or running *Cypress* for e2e tests.
```
npm run typecheck
npm run test
```
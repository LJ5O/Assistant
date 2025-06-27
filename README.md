# Assistant

<img src="docs/public/logo.svg" alt="Project Logo" width="150" height="150">

## What's this project about ?
> Have you ever wondered about having an assistant always ready to help you whenever you need ?
> Want a convenient way to get the weather, set up reminders, ask for some information, ... ?

This project is an implementation of a LLM Agent (Large Language Model), that is able to perform simple tasks, like writing emails, helping on Github, ...

**The goal of this project is to offer a virtual assistant, like a secretary, doing boring or simple tasks, so humans can free some time to concentrate on more important topics.**

## What can really do this assistant ?

For now, only multiplication of two numbers. **TODO**

## How does it works ?
There are two parts in this project, a **back-end**, consisting in a NodeJS server starting a Python subprocess and exposing an HTTP API. And the **front-end**, a VueJS website fitting the API that can be easily used by users.

Under the hood, all AI tasks are performed by the Python subprocess (Brain submodule). An LLM Agent has access to a variety of tools to manage requests.

## Installation

### Production

**TODO**
Still waiting, as databases implementations is still a WIP

### Dev
**TODO**

#### Tests
**TODO**
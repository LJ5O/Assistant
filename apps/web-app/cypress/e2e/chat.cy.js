const answer = {
  "type": "UserAnswer",
  "thread_id": "admin.123",
  "fields": {
    "output": "The result of multiplying 2 by 2 is 4.",
    "linked": [],
    "steps": [
      {
        "type": "HumanMessage",
        "content": "What's 2*2 ?",
        "id": "2e99684f-66a7-429a-bb9b-4c54161db1b1"
      },
      {
        "type": "AIMessage",
        "content": "",
        "id": "run--a7c5f7f6-6aa1-4341-a2be-b611fd451192-0",
        "tool_calls": [
          {
            "type": "ToolCall",
            "name": "Multiply",
            "args": [
              "a:2",
              "b:2"
            ],
            "id": "f840a722-9da5-4bef-b028-919f63faa81c",
            "display": {"hidden":false}
          }
        ],
        "usage_metadata": {
          "input_tokens": 172,
          "output_tokens": 22,
          "total_tokens": 194
        }
      },
      {
        "type": "ToolMessage",
        "name": "Multiply",
        "content": "4",
        "id": "37be1a9c-0b9b-4d9d-aa48-9922bf0c1cee",
        "tool_call_id": "f840a722-9da5-4bef-b028-919f63faa81c",
        "display": {"hidden":false}
      },
      {
        "type": "AIMessage",
        "content": "The result of multiplying 2 by 2 is 4.",
        "id": "run--f468379b-4392-495c-bdd9-abb0c94a8c42-0",
        "tool_calls": [],
        "usage_metadata": {
          "input_tokens": 94,
          "output_tokens": 14,
          "total_tokens": 108
        }
      }
    ]
  }
}

const history = {
  "type": "History",
  "thread_id": "admin.123",
  "messages": [
    {
      "type": "HumanMessage",
      "content": "Test OK",
      "id": "17edf288-d3a5-4a3b-b84a-51282b1bdf9b"
    }
  ]
}

const history2 = {
  "type": "History",
  "thread_id": "admin.456",
  "messages": [
    {
        "type": "HumanMessage",
        "content": "Hi, how are you ?",
        "id": "ec251086-ade3-41cf-8a50-223b809e26b2"
      },
      {
        "type": "AIMessage",
        "content": "",
        "id": "run--1772fd21-3c71-4467-98b7-15d3606d7745-0",
        "tool_calls": [
          {
            "type": "ToolCall",
            "name": "Nothing",
            "args": [
              "__arg1:Hi, how are you?"
            ],
            "display": {
              "hidden": true
            },
            "id": "2b6a0caf-4471-4f5a-ab16-3a85cda6f337"
          }
        ],
        "usage_metadata": {
          "input_tokens": 232,
          "output_tokens": 23,
          "total_tokens": 255
        }
      },
      {
        "type": "ToolMessage",
        "name": "Nothing",
        "content": "null",
        "id": "ef17e860-70b8-4829-aa25-b6753854a5ce",
        "tool_call_id": "2b6a0caf-4471-4f5a-ab16-3a85cda6f337",
        "display": {
          "hidden": true
        }
      },
      {
        "type": "AIMessage",
        "content": "I'm just a language model, so I don't have feelings or emotions like humans do. I'm functioning properly and ready to assist with any questions or tasks you may have!",
        "id": "run--4a38cfd2-673e-4918-a60f-9dc5e1a76800-0",
        "tool_calls": [],
        "usage_metadata": {
          "input_tokens": 96,
          "output_tokens": 37,
          "total_tokens": 133
        }
      }
  ]
}

const conversations = {
  "type": "AvailableConversations",
  "user_id": "admin",
  "threads": ["admin.123", "admin.456"]
}

function prepare(cy){
  // To run before each test
  cy.intercept('GET', '/conversations', { // So this doesn't mess with our test
    statusCode: 200,
    body: conversations
  });

  cy.window().then((win) => {
    win.sessionStorage.setItem("jwt", "aaa.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6NDA5OTY4MDAwMH0.ccc");
  });
}

describe('Chat with Agent', () => {

    it('Can open the chat page with a JWT saved', () => {
      prepare(cy);
      cy.visit('/talk')
      cy.location('pathname').should('eq', '/talk')
    })

    it('Can NOT open the chat page without a JWT saved', () => {
      cy.visit('/talk')
      cy.location('pathname').should('eq', '/')
    })

    it('Can get an History of all messages sent when opening', () => {
      prepare(cy);

      cy.intercept('GET', '/history?conversation=123', {
        statusCode: 200,
        body: history
      }).as('mockAsk');

      cy.visit('/talk/123') // History is auto loaded when oppening
      cy.get('.human-message > .text-xs > p').contains('Test OK') // So we just have to wait for this


    })
  
    it('Messages element are displaying properly', () => {
      prepare(cy);

      cy.intercept('GET', '/history?conversation=123', { // So this doesn't mess with our test
        statusCode: 200,
        body: history
      }).as('mockHist');

      cy.intercept('POST', '/ask', {
        statusCode: 200,
        body: answer
      }).as('mockAsk');

      cy.visit('/talk/123')
      cy.get('#message-input').type('What\'s 2*2 ?')
      cy.get('#message-send').click()

      cy.get('.human-message > .text-xs > p').contains('What\'s 2*2 ?')
      cy.get('.tool-call > .font-bold > .font-extrabold').contains('Multiply')
      cy.get('.tool-call > :nth-child(5)').contains('Arg b = 2')
      cy.get('.tool-answer > .font-bold').contains('Answer from Tool : Multiply')
      cy.get(':nth-child(4) > .text-xs > p').contains('4')
    })

    it('useless tool calls are not shown', () => {
      prepare(cy);

      cy.intercept('GET', '/history?conversation=456', { // So this doesn't mess with our test
        statusCode: 200,
        body: history2
      }).as('mockHist');
      cy.visit('/talk/456')

      cy.get('.overflow-y-scroll').should('not.include.text', 'Nothing') // Useless calls must not be displayed
    })

    it('Shows error on Axios errors', () => {
      prepare(cy);

      // History request error
      cy.intercept('GET', '/history?conversation=123', (req)=>{
        req.destroy()//network error, https://docs.cypress.io/api/commands/intercept
      });
      cy.visit('/talk/123')

      cy.get('.dialog').should('be.visible')
      cy.get('.dialog-cancel').click()
      cy.get('.dialog').should('not.exist')

      // Ask request error
      cy.intercept('POST', '/ask', (req)=>{
        req.destroy()
      });

      cy.get('#message-input').type('What\'s 2*2 ?')
      cy.get('#message-send').click()
      
      cy.get('.dialog').should('be.visible')
      cy.get('.dialog-cancel').click()
      cy.get('.dialog').should('not.exist')
    })
 
})

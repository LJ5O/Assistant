const answer = {
  "type": "UserAnswer",
  "thread_id": "admin",
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
            "name": "multiply",
            "args": [
              "a:2",
              "b:2"
            ],
            "id": "f840a722-9da5-4bef-b028-919f63faa81c"
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
        "name": "multiply",
        "content": "4",
        "id": "37be1a9c-0b9b-4d9d-aa48-9922bf0c1cee",
        "tool_call_id": "f840a722-9da5-4bef-b028-919f63faa81c"
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

describe('Chat with Agent', () => {

    it('Can open the chat page', () => {
      cy.window().then((win) => {
        // Set the user object in the sessionStorage
        win.sessionStorage.setItem("jwt", "aaa.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6NDA5OTY4MDAwMH0.ccc"); // Valid exp expiring in 2100
      });
      cy.visit('/control')
      cy.location('pathname').should('eq', '/control')
    })
  
    it('Messages element are displaying properly', () => {
      cy.window().then((win) => {
        win.sessionStorage.setItem("jwt", "aaa.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6NDA5OTY4MDAwMH0.ccc");
      });

      cy.intercept('POST', '/ask', {
        statusCode: 200,
        body: answer
      }).as('mockAsk');

      cy.visit('/control')
      cy.get('#message-input').type('What\'s 2*2 ?')
      cy.get('#message-send').click()

      cy.get('.human-message > .text-xs > p').contains('What\'s 2*2 ?')
      cy.get('.tool-call > .font-bold > .font-extrabold').contains('multiply')
      cy.get('.tool-call > :nth-child(5)').contains('Arg b = 2')
      cy.get('.tool-answer > .font-bold').contains('Answer from Tool : multiply')
      cy.get(':nth-child(4) > .text-xs > p').contains('4')
    })
 
})

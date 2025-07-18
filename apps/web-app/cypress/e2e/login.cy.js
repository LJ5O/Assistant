const conversations = {
  "type": "AvailableConversations",
  "user_id": "admin",
  "threads": ["admin.123", "admin.456"]
}

describe('Login form', () => {
  it('Is able to login with valid credentials', () => {

    cy.intercept('POST', '/login', { // Interception of request to /login
      statusCode: 200,
      body: { token: 'aaa.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6NDA5OTY4MDAwMH0.ccc' }
    }).as('mockLogin');

    cy.intercept('GET', '/conversations', { // So this doesn't mess with our test
      statusCode: 200,
      body: conversations
    });

    cy.visit('/')
    cy.get('#input-login').type('admin')
    cy.get('#input-password').type('admin')
    cy.get('#input-submit').click()

    cy.wait('@mockLogin').then((interception) => { // Let's check what we entered is what was really sent
      expect(interception.request.body).to.deep.equal({
        username: 'admin',
        password: 'admin'
      });
    });
    // We should move to another page
    cy.location('pathname').should('eq', '/talk') // API docs : https://docs.cypress.io/api/commands/location
    cy.get("#login-error-div").should('not.exist')

  })

  it('Fails with invalid credentials', () => {

    cy.intercept('POST', '/login', { // Interception of request to /login
      statusCode: 401
    }).as('mockLogin');

    cy.visit('/')
    cy.get('#input-login').type('abc')
    cy.get('#input-password').type('123')
    cy.get('#input-submit').click()

    cy.location('pathname').should('eq', '/')
    cy.get("#login-error-div").should('exist')
    cy.get("#login-401-error").should('exist')
    cy.get("#login-other-error").should('not.exist')
  })

  it('Fails with network error', () => {

    cy.intercept('POST', '/login', { // Interception of request to /login
      forceNetworkError: true
    }).as('mockLogin');

    cy.visit('/')
    cy.get('#input-login').type('abc')
    cy.get('#input-password').type('123')
    cy.get('#input-submit').click()

    cy.location('pathname').should('eq', '/')
    cy.get("#login-error-div").should('exist')
    cy.get("#login-401-error").should('not.exist')
    cy.get("#login-other-error").should('exist')
  })
})

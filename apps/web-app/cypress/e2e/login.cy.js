describe('Login form', () => {
  it('Is able to login with valid credentials', () => {

    cy.intercept('POST', '/login', { // Interception of request to /login
      statusCode: 200,
      body: { token: 'abc.123.xyz' }
    }).as('mockLogin');

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

    const path = cy.location('hostname') // Should be /control
    cy.location('pathname').should('eq', '/control') // API docs : https://docs.cypress.io/api/commands/location

  })
})

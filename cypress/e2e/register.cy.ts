  describe('Inscription', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/register', {
        statusCode: 200,
        body: {}
      }).as('registerRequest');

      cy.visit('/register');
    });

    it('should display the registration form', () => {
      cy.contains('Registration Form').should('be.visible');
      cy.get('button').contains('Register').should('be.visible');
    });

    it('should show validation errors when submitting empty form', () => {
      cy.get('button').contains('Register').click();
      cy.contains('First Name is required').should('be.visible');
      cy.contains('Last Name is required').should('be.visible');
    });

    it('should successfully register a user', () => {
      cy.get('input[formControlName="firstName"]').type('John');
      cy.get('input[formControlName="lastName"]').type('Doe');
      cy.get('input[formControlName="login"]').type('jdoe');
      cy.get('input[formControlName="password"]').type('secret');

      cy.get('button').contains('Register').click();

      cy.wait('@registerRequest').its('request.body').should('deep.equal', {
        firstName: 'John',
        lastName: 'Doe',
        login: 'jdoe',
        password: 'secret'
      });
    });
  });
  describe('Connexion', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/login', {
        statusCode: 200,
        body: 'fake-jwt-token'
      }).as('loginRequest');

      // Mock de la liste des étudiants (appelée après connexion)
      cy.intercept('GET', '/api/etudiants', {
        statusCode: 200,
        body: [
          { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', telephone: '', createdAt: '2024-01-01' }
        ]
      }).as('etudiantsRequest');

      cy.visit('/login');
    });

    it('should display the login form', () => {
      cy.contains('Connexion').should('be.visible');
      cy.contains('Se Connecter').should('be.visible');
    });

    it('should show validation errors when submitting empty form', () => {
      cy.get('button').contains('Se Connecter').click();
      cy.contains('Login is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should successfully login and redirect to etudiants list', () => {
      cy.get('input[formControlName="login"]').type('admin');
      cy.get('input[formControlName="password"]').type('pass');

      cy.get('button').contains('Se Connecter').click();

      cy.wait('@loginRequest').its('request.body').should('deep.equal', {
        login: 'admin',
        password: 'pass'
      });

      // Vérifie que la page des étudiants s'affiche
      cy.contains('Liste des étudiants').should('be.visible');
    });
  });
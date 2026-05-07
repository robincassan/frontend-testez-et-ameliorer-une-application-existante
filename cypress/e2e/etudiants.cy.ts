  describe('Gestion des étudiants', () => {
    beforeEach(() => {
      // Mock de la liste des étudiants
      cy.intercept('GET', '/api/etudiants', {
        statusCode: 200,
        body: [
          { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', telephone: '', createdAt: '2024-01-01' },
          { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie@test.com', telephone: '0102030405', createdAt: '2024-01-02' }
        ]
      }).as('etudiantsList');

      // Mock de la création d'un étudiant
      cy.intercept('POST', '/api/etudiants', {
        statusCode: 200,
        body: { id: 3, nom: 'Test', prenom: 'User', email: 'test@test.com', telephone: '', createdAt: '2024-01-03' }
      }).as('createEtudiant');

      // Mock de la suppression
      cy.intercept('DELETE', '/api/etudiants/1', {
        statusCode: 200,
        body: {}
      }).as('deleteEtudiant');

      // Simuler un token dans localStorage pour accéder aux pages protégées
      localStorage.setItem('token', 'fake-jwt-token');
    });

    it('should display the list of students', () => {
      // Test : la page liste affiche les étudiants
      cy.visit('/etudiants');
      cy.wait('@etudiantsList');
      cy.contains('Liste des étudiants').should('be.visible');
      cy.contains('Dupont').should('be.visible');
      cy.contains('Martin').should('be.visible');
    });

    it('should navigate to create student form', () => {
      // Test : cliquer sur "Ajouter un étudiant" → page du formulaire
      cy.visit('/etudiants');
      cy.contains('Ajouter un étudiant').click();
      cy.url().should('include', '/etudiants/nouveau');
      cy.contains('Ajouter un étudiant').should('be.visible'); // titre du formulaire
    });

    it('should create a new student', () => {
      // Test : remplir le formulaire et créer un étudiant
      cy.visit('/etudiants/nouveau');

      cy.get('input[formControlName="nom"]').type('Test');
      cy.get('input[formControlName="prenom"]').type('User');
      cy.get('input[formControlName="email"]').type('test@test.com');

      cy.get('button').contains('Créer').click();

      cy.wait('@createEtudiant').its('request.body').should('deep.equal', {
        nom: 'Test',
        prenom: 'User',
        email: 'test@test.com',
        telephone: ''
      });
    });

    it('should delete a student', () => {
      // Test : supprimer un étudiant → la liste est mise à jour
      cy.visit('/etudiants');
      cy.wait('@etudiantsList');

      // Mock de la réponse après suppression (liste mise à jour)
      cy.intercept('GET', '/api/etudiants', {
        statusCode: 200,
        body: [
          { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie@test.com', telephone: '0102030405', createdAt: '2024-01-02' }
        ]
      }).as('etudiantsAfterDelete');

      cy.get('button').contains('Supprimer').first().click();

      cy.wait('@deleteEtudiant');
      // L'étudiant Dupont (id=1) a disparu de la liste
      cy.contains('Dupont').should('not.exist');
    });
  });
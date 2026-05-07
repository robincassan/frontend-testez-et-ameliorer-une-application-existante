  describe('Modification d\'un étudiant', () => {
    beforeEach(() => {
      // Mock de la récupération d'un étudiant par ID
      cy.intercept('GET', '/api/etudiants/1', {
        statusCode: 200,
        body: { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', telephone: '', createdAt: '2024-01-01' }
      }).as('getEtudiant');

      // Mock de la mise à jour
      cy.intercept('PUT', '/api/etudiants/1', {
        statusCode: 200,
        body: { id: 1, nom: 'Dupont', prenom: 'Jean-Pierre', email: 'jean@test.com', telephone: '', createdAt: '2024-01-01' }
      }).as('updateEtudiant');

      // Mock de la liste après modification
      cy.intercept('GET', '/api/etudiants', {
        statusCode: 200,
        body: [
          { id: 1, nom: 'Dupont', prenom: 'Jean-Pierre', email: 'jean@test.com', telephone: '', createdAt: '2024-01-01' }
        ]
      }).as('etudiantsList');

      localStorage.setItem('token', 'fake-jwt-token');
    });

    it('should display the edit form with student data', () => {
      // Test : la page d'édition affiche les données de l'étudiant
      cy.visit('/etudiants/1/modifier');
      cy.wait('@getEtudiant');
      cy.contains('Modifier un étudiant').should('be.visible');
      cy.get('input[formControlName="nom"]').should('have.value', 'Dupont');
      cy.get('input[formControlName="prenom"]').should('have.value', 'Jean');
    });

    it('should update student and redirect to list', () => {
      // Test : modifier le prénom → appel PUT + redirection liste
      cy.visit('/etudiants/1/modifier');
      cy.wait('@getEtudiant');

      cy.get('input[formControlName="prenom"]').clear().type('Jean-Pierre');

      cy.get('button').contains('Modifier').click();

      cy.wait('@updateEtudiant').its('request.body').should('include', { prenom: 'Jean-Pierre' });
      cy.wait('@etudiantsList');
      cy.contains('Liste des étudiants').should('be.visible');
    });
  });
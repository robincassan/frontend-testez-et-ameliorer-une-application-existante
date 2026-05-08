import { defineConfig } from 'cypress';

  export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:4200',
      supportFile: 'cypress/support/e2e.ts',
      specPattern: 'cypress/e2e/**/*.cy.ts',
      video: false,
      screenshotOnRunFailure: false,
      setupNodeEvents(on, config) {
        // @ts-expect-error - require disponible dans le contexte Node de Cypress
        require('@cypress/code-coverage/task')(on, config);
        return config;
      },
    },
  });
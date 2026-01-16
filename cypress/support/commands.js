// ============================================================================
// BDD commands (DADO, QUANDO, ENTÃO, E)
// ============================================================================
Cypress.Commands.add('Dado',  (texto) => {
  cy.log(`DADO: ${texto}`);
});

Cypress.Commands.add('Quando', (texto) => {
  cy.log(`QUANDO: ${texto}`);
});

Cypress.Commands.add('Entao', (texto) => {
  cy.log(`ENTÃO: ${texto}`);
});

Cypress.Commands.add('E', (texto) => {
  cy.log(`E: ${texto}`);
});


// --- SNAP GLOBAL: cy.snap('nome', largura?, altura?) -------------------------
// Evidência padronizada com zoom reduzido para evidências menores.
Cypress.Commands.add('snap', (name, width = 1024, height = 600) => {
  cy.viewport(width, height);

  // espera o body carregar
  cy.get('body', { timeout: 20000 }).should('be.visible');

  // Aplica zoom reduzido (melhor tamanho para evidência)
  cy.document().then((doc) => {
    doc.body.style.zoom = '0.60';          // reduz sem cortar
    doc.body.style.transformOrigin = 'top center';
  });

  // Espera animações e loaders saírem
  cy.get('body .spinner, body [data-testid="loading"], body .loading', {
    timeout: 15000,
  }).should('not.exist');
  cy.wait(250);

  // Screenshot final
  cy.screenshot(name, { capture: 'viewport' });

  // Restaura o zoom para não interferir nos próximos comandos
  cy.document().then((doc) => {
    doc.body.style.zoom = '1.0';
  });
});

// cypress/support/pages/AppBar.js
import BasePage from './BasePage.js';

const L = {
  // botão do header que abre/fecha o menu lateral
  toggleMenu: '[data-testid="btn-toggle-menu"]',

  // regiões do drawer que validam que o menu abriu
  regPlanejamento: '[data-testid="planejamento"]',
  regGeral: '[data-testid="geral"]',
};

class AppBar extends BasePage {
  /**
   * Garante que o menu lateral esteja aberto.
   * - Se já estiver visível (planejamento/geral presentes), não faz nada.
   * - Caso contrário, clica no botão [data-testid="btn-toggle-menu"] e valida.
   */
  expandirMenuLateral() {
    cy.get('body', { timeout: 15000 }).then(($body) => {
      const jaVisivel =
        $body.find(L.regPlanejamento).length > 0 || $body.find(L.regGeral).length > 0;

      if (!jaVisivel) {
        // clica no botão do header
        cy.get(L.toggleMenu, { timeout: 15000 })
          .should('be.visible')
          .click({ force: true });

        // valida que abriu: alguma das regiões do drawer ficou acessível
        cy.get('body', { timeout: 15000 }).should(($b) => {
          const abriu =
            $b.find(L.regPlanejamento).length > 0 || $b.find(L.regGeral).length > 0;
          expect(abriu, 'menu lateral aberto').to.be.true;
        });
      }
    });
  }
}

export const appBar = new AppBar();
export default AppBar;

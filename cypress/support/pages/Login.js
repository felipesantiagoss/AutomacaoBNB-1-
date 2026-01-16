// cypress/support/pages/Login.js
import BasePage from './BasePage.js';
import Locators from '../locators/locators.js';

class Login extends BasePage {
  /**
   * Realiza login com credenciais do cypress.json/env
   * Pré-condição: página de login carregada.
   */
  signIn() {
    const username   = Cypress.env('username');
    const password   = Cypress.env('password');
    const urlSistema = Cypress.env('URL_SISTEMA');

    cy.get(Locators.login.username, { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type(username, { log: false });

    cy.get(Locators.login.password, { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type(password, { log: false });

    this.clickStable(Locators.login.signIn);

    // validação pós-login: url ou presença da appbar
    cy.url({ timeout: 40000 }).should('include', urlSistema);
  }
}

export default new Login();

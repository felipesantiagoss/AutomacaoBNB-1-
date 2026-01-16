// cypress/support/pages/BasePage.js

/**
 * Classe base com utilitários "estáveis" para ações comuns.
 * Todos os métodos retornam o chain do Cypress quando faz sentido.
 */
export class BasePage {
  /**
   * Aguarda o seletor ficar visível.
   */
  waitVisible(sel, timeout = 15000) {
    return cy.get(sel, { timeout }).should('be.visible');
  }

  /**
   * Aguarda o seletor existir (não precisa estar visível).
   */
  waitExist(sel, timeout = 15000) {
    return cy.get(sel, { timeout }).should('exist');
  }

  /**
   * Aguarda o seletor NÃO existir (útil para loaders).
   */
  waitGone(sel, timeout = 15000) {
    return cy.get('body', { timeout }).then(() => {
      cy.get(sel, { timeout }).should('not.exist');
    });
  }

  /**
   * Garante que o elemento está clicável:
   * - visível
   * - não desabilitado
   * - não tem aria-disabled=true
   * Depois clica.
   */
  clickStable(sel, opts = { force: true }, timeout = 15000) {
    return cy
      .get(sel, { timeout })
      .should('be.visible')
      .and('not.be.disabled')
      .and(($el) => {
        const aria = $el.attr('aria-disabled');
        if (aria === 'true') {
          throw new Error(`Elemento ${sel} com aria-disabled=true`);
        }
      })
      .click(opts);
  }

  /**
   * Limpa e digita garantindo visibilidade e habilitação.
   */
  typeStable(sel, text, opts = { delay: 0, force: true }, timeout = 15000) {
    return cy
      .get(sel, { timeout })
      .should('be.visible')
      .and('not.be.disabled')
      .clear({ force: true })
      .type(text, opts);
  }

  /**
   * Click "simples" (mantido por compatibilidade).
   */
  click(sel, opts = { force: true }) {
    return this.waitVisible(sel).click(opts);
  }

  /**
   * Type "simples" (mantido por compatibilidade).
   */
  type(sel, text, opts = { delay: 0, force: true }) {
    return this.waitVisible(sel).clear({ force: true }).type(text, opts);
  }

  /**
   * Apenas garante existência no DOM.
   */
  exists(sel, timeout = 15000) {
    return cy.get(sel, { timeout }).should('exist');
  }
}

export default BasePage;

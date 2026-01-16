// cypress/support/pages/MenuLateral.js
import BasePage from './BasePage.js';

const L = {
  // =============================
  // MENUS PRINCIPAIS
  // =============================
  planejamentoBtn: '[data-testid="planejamento"] button',
  geralBtn: '[data-testid="geral"] button',

  // =============================
  // SUBMENUS
  // =============================
  objetoBtn: '[data-testid="objeto"] button',
  trabalhoBtn: '[data-testid="trabalho"] button',
  tcpBtn: '[data-testid="tcp"] button'

};

class MenuLateral extends BasePage {
  // =============================
  // MENU > PLANEJAMENTO
  // =============================
  abrirPlanejamento() {
    cy.get(L.planejamentoBtn, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

    if (this.aguardarCarregamento) {
      this.aguardarCarregamento();
    }
  }

  // =============================
  // SUBMENU > GERAL
  // =============================
  abrirGeral() {
    cy.get(L.geralBtn, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

    if (this.aguardarCarregamento) {
      this.aguardarCarregamento();
    }
  }

  // =============================
  // SUBMENU > OBJETO
  // =============================
  clicarMenuObjeto() {
    cy.get(L.objetoBtn, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

    if (this.aguardarCarregamento) {
      this.aguardarCarregamento();
    }
  }

  // =============================
  // SUBMENU > TRABALHO
  // =============================
  clicarMenuTrabalho() {
    cy.get(L.trabalhoBtn, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

    if (this.aguardarCarregamento) {
      this.aguardarCarregamento();
    }
  }

  // =============================
  // SUBMENU > TCP
  // =============================
  clicarMenuTrabalho() {
    cy.get(L.tcpBtn, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

    if (this.aguardarCarregamento) {
      this.aguardarCarregamento();
    }
  }
}

export const menuLateral = new MenuLateral();
export default MenuLateral;

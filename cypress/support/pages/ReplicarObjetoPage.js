// cypress/support/pages/ReplicarObjetoPage.js
import BasePage from './BasePage.js';

const L = {
  // URL da tela de replicar objetos
  urlReplicar: /\/objeto\/replicar$/,

  // Campo "Ciclo" (ícone de dropdown)
  cicloDropdownBotao:
    '[data-testid="field-ciclo"] [data-testid="text-field-trailing-icon"], ' +
    '[data-testid="text-field-trailing-icon"]',

  // Opções de ciclo na lista
  opcaoCiclo: 'button[role="option"] .list-item__content',

  // Grid de objetos
  linhasObjetos: 'tbody tr',

  // Checkboxes
  checkboxCabecalho: 'thead button[role="checkbox"]',
  checkboxLinhas: 'tbody button[role="checkbox"]',

  // Botão Cancelar na tela de replicar
  botaoCancelar: '[data-testid="btn-cancel"]',

  // Modal de confirmação
  dialogRoot: '[role="dialog"]',

  // Trilha "Objeto" (breadcrumb para voltar à consulta)
  trilhaObjeto: '[data-testid="link-breadcrumbs-objeto"]',
};

class ReplicarObjetoPage extends BasePage {
  // =============================
  // URL
  // =============================
  validarUrlReplicarObjeto() {
    cy.url({ timeout: 20000 }).should('match', L.urlReplicar);
  }

  // =============================
  // CICLO
  // =============================
  selecionarCiclo(ano) {
    cy.log(`Selecionando ciclo ${ano} na tela de Replicar Objeto`);

    cy.get(L.cicloDropdownBotao, { timeout: 20000 })
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get(L.opcaoCiclo, { timeout: 20000 })
      .filter((_, el) => (el.innerText || '').trim() === String(ano))
      .first()
      .should('be.visible')
      .click({ force: true });

    // Garante que as linhas do grid foram carregadas
    cy.get(L.linhasObjetos, { timeout: 20000 }).should(
      'have.length.greaterThan',
      0
    );
  }

  // =============================
  // SELEÇÃO DE OBJETOS
  // =============================
  selecionarPrimeiroObjeto() {
    cy.log('Selecionando o primeiro objeto do grid');

    cy.get(L.checkboxLinhas, { timeout: 20000 })
      .should('have.length.greaterThan', 0)
      .first()
      .should('be.visible')
      .click({ force: true });
  }

  selecionarTodosObjetos() {
    cy.log('Selecionando todos os objetos do grid (checkbox do cabeçalho)');

    cy.get(L.checkboxCabecalho, { timeout: 20000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    cy.get(L.checkboxLinhas).each(($chk) => {
      const state = $chk.attr('aria-checked') || $chk.attr('data-state');
      const isChecked = state === 'true' || state === 'checked';
      expect(isChecked, 'checkbox de linha marcado').to.be.true;
    });
  }

  desmarcarTodosObjetos() {
    cy.log(
      'Desmarcando todos os objetos do grid (usando o mesmo checkbox do cabeçalho)'
    );

    cy.get(L.checkboxCabecalho, { timeout: 20000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true })
      .click({ force: true });

    cy.get(L.checkboxLinhas).each(($chk) => {
      const state = $chk.attr('aria-checked') || $chk.attr('data-state');
      const isUnchecked =
        state === 'false' || state === 'unchecked' || !state;
      expect(isUnchecked, 'checkbox de linha desmarcado').to.be.true;
    });
  }

  // =============================
  // BOTÃO CANCELAR
  // =============================
  clicarCancelar() {
    cy.log('Clicando em Cancelar na tela de Replicar Objeto');

    cy.get(L.botaoCancelar, { timeout: 20000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  // =============================
  // MODAL DE CONFIRMAÇÃO
  // =============================
  validarJanelaConfirmacaoCancelarReplicacao() {
    cy.get(L.dialogRoot, { timeout: 10000 })
      .should('be.visible')
      .then(($dlg) => {
        const texto = ($dlg.text() || '').trim();
        expect(
          texto.includes(
            'Os objetos selecionados não foram replicados, deseja cancelar?'
          ),
          'mensagem de confirmação de cancelamento da replicação'
        ).to.be.true;
      });
  }

  clicarNaoNaJanelaConfirmacao() {
    cy.log('Clicando em "Não" na janela de confirmação de cancelamento');

    cy.get(L.dialogRoot, { timeout: 10000 })
      .should('be.visible')
      .find('button')
      .filter((_, el) => (el.textContent || '').trim() === 'Não')
      .first()
      .click({ force: true });
  }

  // =============================
  // TRILHA "Objeto"
  // =============================
  validarTrilhaObjetoVisivel() {
    cy.log('Validando trilha "Objeto" visível na tela de Replicar Objeto');

    cy.get(L.trilhaObjeto, { timeout: 20000 }).should('be.visible');
  }

  destacarTrilhaObjetoParaEvidencia() {
    cy.log('Destacando trilha "Objeto" para evidência');

    cy.get(L.trilhaObjeto, { timeout: 20000 })
      .should('be.visible')
      .realHover();
  }

  clicarTrilhaObjeto() {
    cy.log('Clicando na trilha "Objeto" para retornar à tela de consulta');

    cy.get(L.trilhaObjeto, { timeout: 20000 })
      .should('be.visible')
      .realHover()
      .click({ force: true });
  }
}

export const replicarObjetoPage = new ReplicarObjetoPage();
export default ReplicarObjetoPage;

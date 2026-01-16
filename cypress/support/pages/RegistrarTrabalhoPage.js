import BasePage from './BasePage.js';

const L = {
  urlRegistrarTrabalho: /\/trabalho$/,


  // (opcional) âncoras visuais sem contains: título existe
  titulo: 'h1',
  //Campos tela registrar trabalho
  campoObjeto:
    '[data-testid="field-objeto"] > .trigger > ' +
    '[style="display: flex; flex-direction: column; gap: 4px; width: 100%;"] > ' +
    '[data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > ' +
    '.dropdown-field__container > .dropdown-field__inside',
  tipoTrabalho:
    '[data-testid="field-tipo"] > ' +
    '[style="display: flex; flex-direction: column; gap: 4px; width: 100%;"] > ' +
    '[data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > ' +
    '.dropdown-field__container > .dropdown-field__inside > .dropdown-field__input',
  opcoesDropdown: '[role="option"]',
  campoObjetivo:
    '[data-testid="field-objetivo"] > [data-testid="textarea"] > ' +
    '[data-testid="textarea-container"] > .text-area__content > ' +
    '[data-testid="textarea-input"]',
  botaoSalvar: '[data-testid="btn-save"] > .button__animation',
  dialog: '[role="dialog"]',
  //Campos Registrar trabalho status A Iniciar
  unidadeResponsavel:
    '.MuiGrid-grid-md-4 > .trigger > [style="display: flex; flex-direction: column; gap: 4px; width: 100%;"] > [data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > .dropdown-field__container > .dropdown-field__inside > .dropdown-field__input',
  periodoDeContainer:
    ':nth-child(12) > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"]',
  periodoAteInput:
    ':nth-child(13) > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"] > .text-field__content > [data-testid="text-field-input"]',
  paaInput:
    ':nth-child(14) > .trigger > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"] > .text-field__content > [data-testid="text-field-input"]',
  dataAprovacaoInput:
    '.css-yr6tdr > .trigger > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"] > .text-field__content > [data-testid="text-field-input"]'

};

class RegistrarTrabalhoPage extends BasePage {
  validarNaTelaRegistroTrabalho() {
    cy.url({ timeout: 20000 }).should('match', L.urlRegistrarTrabalho);
    //cy.get(L.titulo, { timeout: 20000 }).should('be.visible');
  }

  registrarTrabalhoEmPlanejamento(objetoDescricao, objetivo) {
    // Objeto
    cy.get(L.campoObjeto, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .should('have.length.greaterThan', 0)
      .last()
      .click({ force: true });


    // TIPO DO TRABALHO 
    cy.get(L.tipoTrabalho, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .first()
      .click({ force: true });


    // OBJETIVO
    cy.get(L.campoObjetivo, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Teste Trabalho Em Planejamento 1', { force: true });


    // SALVAR
    this._salvarEConfirmar();
  }


  registrarTrabalhoAIniciar() {
    // OBJETO – último cadastrado 
    cy.get(L.campoObjeto, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .should('have.length.greaterThan', 0)
      .last()
      .click({ force: true });


    // TIPO DO TRABALHO – primeira opção
    cy.get(L.tipoTrabalho, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .first()
      .click({ force: true });

    // OBJETIVO
    cy.get(L.campoObjetivo, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Teste Trabalho A Iniciar', { force: true });

    // UNIDADE RESPONSÁVEL 
    cy.get(L.unidadeResponsavel, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .first()
      .click({ force: true });

    // PERÍODO DE 
    cy.get(L.periodoDeContainer, { timeout: 20000 })
      .should('be.visible')
      .find('input')
      .clear({ force: true })
      .type('012026', { force: true });

    // PERÍODO ATÉ 
    cy.get(L.periodoAteInput, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('122026', { force: true });

    // PAA 
    cy.get(L.paaInput, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('0000000000000', { force: true });

    // DATA DE APROVAÇÃO 
    cy.get(L.dataAprovacaoInput, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('12012026', { force: true });

    // SALVAR
    this._salvarEConfirmar();
  }
  //Botão salvar
  _salvarEConfirmar() {
    cy.get(L.botaoSalvar, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.dialog, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Sim')
          .should('be.visible')
          .click({ force: true });
      });
  }


  registrarTrabalhoObjetoAIniciar(objetoDescricao, objetivo) {
    // Objeto
    cy.get(L.campoObjeto, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .should('have.length.greaterThan', 0)
      .last()
      .click({ force: true });

    // TIPO DO TRABALHO 
    cy.get(L.tipoTrabalho, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .first()
      .click({ force: true });

    // OBJETIVO
    cy.get(L.campoObjetivo, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('Teste com Objeto A Iniciar', { force: true });

    // UNIDADE RESPONSÁVEL – primeira opção
    cy.get(L.unidadeResponsavel, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.opcoesDropdown, { timeout: 20000 })
      .first()
      .click({ force: true });

    // PERÍODO DE 
    cy.get(L.periodoDeContainer, { timeout: 20000 })
      .should('be.visible')
      .find('input')
      .clear({ force: true })
      .type('012026', { force: true });

    // PERÍODO ATÉ 
    cy.get(L.periodoAteInput, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('122026', { force: true });

    // PAA 
    cy.get(L.paaInput, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('0000000000000', { force: true });

    // DATA DE APROVAÇÃO 
    cy.get(L.dataAprovacaoInput, { timeout: 20000 })
      .should('be.visible')
      .clear({ force: true })
      .type('12012026', { force: true });

    // SALVAR
    this._salvarEConfirmar();
  }
  //Botão salvar
  _salvarEConfirmar() {
    cy.get(L.botaoSalvar, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.dialog, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Sim')
          .should('be.visible')
          .click({ force: true });
      });
  }
}




export const registrarTrabalhoPage = new RegistrarTrabalhoPage();
export default RegistrarTrabalhoPage;

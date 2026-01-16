// cypress/support/pages/ObjetoPage.js
import BasePage from './BasePage.js';

const L = {
  // URL da tela de consulta de objetos
  urlLista: /\/objeto(\/)?(\?.*)?$/,

  // Botões principais
  botaoAdicionar: '[data-testid="btn-add-objeto"]',
  botaoReplicar: '[data-testid="btn-replicar-objeto"]',

  // Containers de filtro (text-field)
  statusContainer: 'div[data-testid="text-field-container"]',

  // Opções genéricas (dropdown)
  opcaoRoleOption: 'button[role="option"]',
  opcaoTexto: 'h3',

  // Grid
  botoesEditarGrid: '[data-testid^="btn-edit-objeto"]',
  botoesVisualizarGrid: '[data-testid^="btn-detail-objeto"]',

  // Breadcrumbs
  breadcrumbs: '[data-testid="breadcrumbs"]',
  breadcrumbLinks: '[data-testid="breadcrumbs"] a',

  // Paginação
  paginacao: '.pagination__actions',
  btnPrimeira: '.pagination__actions > :nth-child(1)',
  btnAnterior: '.pagination__actions > :nth-child(2)',
  btnProxima: '.pagination__actions > :nth-child(5)',
  btnUltima: '.pagination__actions > :nth-child(6)',

  // Itens por página
  triggerItensPorPagina:
    '.pagination__rows-per-page > .pagination__dropdown__trigger > .lucide',
  popperWrapper: 'div[data-radix-popper-content-wrapper]',
};

class ObjetoPage extends BasePage {
  // =============================
  // HELPERS
  // =============================
  _selecionarOpcaoPorTexto(alvo) {
    cy.get(L.opcaoRoleOption, { timeout: 20000 })
      .filter((_, el) => (el.innerText || '').trim() === alvo)
      .first()
      .should('be.visible')
      .click({ force: true });
  }

  // =============================
  // VALIDAÇÃO DA LISTA
  // =============================
  validarNaLista() {
    cy.url({ timeout: 20000 }).should('match', L.urlLista);

    if (this.aguardarCarregamento) {
      this.aguardarCarregamento();
    }
  }

  // =============================
  // BOTÃO ADICIONAR (+)
  // =============================
  verBotaoAdicionarVisivel() {
    cy.get(L.botaoAdicionar, { timeout: 20000 }).should('be.visible');
  }

  clicarAdicionar() {
    cy.get(L.botaoAdicionar, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
  }

  // =============================
  // BOTÃO REPLICAR OBJETO
  // =============================
  verBotaoReplicarVisivel() {
    cy.get(L.botaoReplicar, { timeout: 20000 }).should('be.visible');
  }

  clicarReplicar() {
    cy.get(L.botaoReplicar, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
  }

  // =============================
  // FILTRO: STATUS DO OBJETO = "Em Planejamento"
  // =============================
  selecionarStatusEmPlanejamento() {
    const alvo = 'Em Planejamento';

    cy.contains('p', 'Status do Objeto')
        .closest('.MuiStack-root') 
        .within(() => {
          cy.get('[role="combobox"]').click()
          cy.contains('[role="option"]', alvo).click()
        });

    // valida valor selecionado
    cy.contains('p', 'Status do Objeto')
      .closest('.MuiStack-root')
      .within(() => {
        cy.get('[role="combobox"]')
          .invoke('val')
          .then((val) => {
            expect((val || '').toString().trim()).to.eq(alvo);
          });
      });
  }

  // =============================
  // GRID – DESTACAR PRIMEIRO OBJETO (por Editar)
  // =============================
  destacarPrimeiraLinha() {
    cy.get(L.botoesEditarGrid, { timeout: 20000 })
      .should('exist')
      .should('have.length.greaterThan', 0)
      .first()
      .scrollIntoView()
      .should('be.visible')
      .realHover();
  }

  // =============================
  // AÇÕES – EDITAR
  // =============================
  clicarEditarPrimeiraLinha() {
    cy.get(L.botoesEditarGrid, { timeout: 20000 })
      .should('exist')
      .should('have.length.greaterThan', 0)
      .first()
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
  }

  // =============================
  // AÇÕES – VISUALIZAR
  // =============================
  clicarVisualizarPrimeiraLinha() {
    cy.get(L.botoesVisualizarGrid, { timeout: 20000 })
      .should('exist')
      .should('have.length.greaterThan', 0)
      .first()
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
  }

  // ========================================================================
  // PAGINAÇÃO
  // ========================================================================
  clicarAvancarPagina() {
    cy.get(L.btnProxima, { timeout: 15000 }).scrollIntoView().click({ force: true });
  }

  clicarRetornarPagina() {
    cy.get(L.btnAnterior, { timeout: 15000 }).scrollIntoView().click({ force: true });
  }

  clicarAvancarFim() {
    cy.get(L.btnUltima, { timeout: 15000 }).scrollIntoView().click({ force: true });
  }

  clicarRetornarInicio() {
    cy.get(L.btnPrimeira, { timeout: 15000 }).scrollIntoView().click({ force: true });
  }

  // ----------- DROPDOWN DE ITENS POR PÁGINA ------------
  abrirDropdownItensPorPagina() {
    cy.get(L.triggerItensPorPagina, { timeout: 15000 })
      .scrollIntoView()
      .click({ force: true });

    cy.get(L.popperWrapper, { timeout: 15000 }).should('be.visible');
  }

  selecionarItensPorPagina(qtd) {
    const alvo = String(qtd);

    cy.get(L.popperWrapper, { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        // sem contains: busca qualquer elemento cujo innerText == alvo
        cy.get('*', { timeout: 15000 })
          .filter((_, el) => (el.innerText || '').trim() === alvo)
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
      });

    cy.get(L.popperWrapper, { timeout: 15000 }).should('not.exist');
  }

  // ========================================================================
  // TRILHA DE NAVEGAÇÃO – TELA CONSULTAR
  // ========================================================================
  destacarTrilhaParaEvidencia() {
    cy.get(L.breadcrumbs, { timeout: 20000 })
      .should('be.visible')
      .realHover();
  }

  clicarTrilhaObjeto() {
    // sem contains: filtra pelo texto do link
    cy.get(L.breadcrumbLinks, { timeout: 20000 })
      .filter((_, el) => (el.innerText || '').trim() === 'Objeto')
      .first()
      .should('be.visible')
      .click({ force: true });
  }

  // ========================================================================
  // FILTROS – deixar lista sem resultados (Critério 06)
  // ========================================================================
  abrirDropdownStatusObjeto() {
    cy.get(L.statusContainer, { timeout: 20000 })
      //.eq(2)
      .scrollIntoView()
      .click({ force: true });
  }

  selecionarStatusAIniciar() {
    const alvo = 'A Iniciar';
    this._selecionarOpcaoPorTexto(alvo);
  }

  preencherPesquisaObjeto(texto) {
    cy.get('input[data-testid="field-objeto"]', { timeout: 20000 })
      .scrollIntoView()
      .clear({ force: true })
      .type(texto, { delay: 0, force: true });
  }

  validarMensagemNenhumResultado() {
    // sem contains: filtra qualquer elemento com o texto exato
    const alvo = 'Nenhum resultado encontrado';

    cy.get('body', { timeout: 20000 })
      .find('*')
      .filter((_, el) => (el.innerText || '').trim() === alvo)
      .first()
      .should('be.visible');
  }

  validarFiltrosMantidos() {
    cy.get('[data-testid="field-objeto"]', { timeout: 20000 })
      .invoke('val')
      .should('not.be.empty');

  cy.get('[data-testid="field-objeto"]', { timeout: 20000 })
    .should('be.visible')
    .invoke('val')
    .then((text) => {
      expect((text || '').trim()).to.not.equal('');
    });
  }
}

export const objetoPage = new ObjetoPage();
export default ObjetoPage;

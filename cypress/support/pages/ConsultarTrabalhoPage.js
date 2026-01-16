// cypress/support/pages/ConsultarTrabalhoPage.js
import BasePage from './BasePage.js';

const L = {
  // =============================
  // URLS
  // =============================
  urlConsulta: /\/trabalho(\/)?(\?.*)?$/,
  urlNovo: /\/trabalho\/novo(\/)?(\?.*)?$/,
  urlVisualizar: /\/trabalho\/\d+(\/)?(\?.*)?$/,
  urlEditar: /\/trabalho\/\d+\/editar(\/)?(\?.*)?$/,

  // =============================
  // TELA / ESTRUTURA
  // =============================
  body: 'body',
  breadcrumb: '[data-testid="breadcrumbs"]',

  // loaders genéricos (quando existir)
  loader: 'svg.lucide-loader, [class*="loader"], [aria-busy="true"]',

  // =============================
  // GRID
  // =============================
  tabela: 'table',
  linhasTabela: 'table tbody tr',
  celulasLinha: 'td',

  // Coluna "Status" (texto dentro de alguma td)
  statusPlanejamentoTexto: 'Em Planejamento',
  statusIniciarTexto: 'A Iniciar',

  // =============================
  // BOTÃO: + (Adicionar novo trabalho)
  // =============================
  linkAdicionar: 'a[href="/trabalho/novo"]',
  iconeAdicionar: 'a[href="/trabalho/novo"] [data-testid="icon-button-icon"]',
  botaoIcon: 'button.icon-button',

  // =============================
  // AÇÕES (ícones na coluna Ações)
  // =============================
  btnVisualizarPrefix: '[data-testid^="btn-detail"]',
  btnEditarPrefix: '[data-testid^="btn-edit"]',

  //  CRITÉRIO 06 – EXCLUIR (GENÉRICO)
  // Pelo print: data-testid="btn-delete-objeto-14" (mantém genérico)
  btnExcluirPrefix: '[data-testid^="btn-delete-objeto"]',

  // =============================
  // TÍTULOS (anti snap branco/loader)
  // =============================
  tituloRegistrar: 'h1, h2',
  tituloVisualizar: 'h1, h2',
  tituloEditar: 'h1, h2',

  // =============================
  // (Critério 05) - Form / edição (para garantir render antes do snap)
  // =============================
  textFieldContainer: 'div[data-testid="text-field-container"]',
  textFieldInput:
    'input[data-testid="text-field-input"], [data-testid="text-field-input"]',
  textarea: 'textarea',
  textareaInput: '[data-testid="textarea-input"], textarea',

  // =============================
  // (HU 4191) - Edição de Trabalho
  // =============================
  labelDataAprovacao: /Data de aprova/i,
  labelUnidadeResponsavel: /Unidade Responsa/i,
  labelPeriodoDe: /Período de/i,
  labelPeriodoAte: /Período at/i,
  labelPaa: /PAA/i,
  opcoesDropdown: '[role="option"]',
  botaoSalvarEdicao: '[data-testid="btn-save"]',
  // Seletores para editar com status a iniciar
  origem:
    ':nth-child(5) > [style="display: flex; flex-direction: column; gap: 4px; width: 100%;"] > [data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > .dropdown-field__container > .dropdown-field__inside > .dropdown-field__input',
  unidadeResponsavel:
    '.MuiGrid-grid-md-4 > .trigger > [style="display: flex; flex-direction: column; gap: 4px; width: 100%;"] > [data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > .dropdown-field__container > .dropdown-field__inside > .dropdown-field__input',
    fonteGeradora:
    '.MuiGrid-grid-md-8 > .trigger > [style="display: flex; flex-direction: column; gap: 4px; width: 100%;"] > [data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > .dropdown-field__container > .dropdown-field__inside > .dropdown-field__input',
    periodoDeContainer:
    ':nth-child(12) > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"]',
  periodoAteInput:
    ':nth-child(13) > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"] > .text-field__content > [data-testid="text-field-input"]',
  paaInput:
    ':nth-child(14) > .trigger > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"] > .text-field__content > [data-testid="text-field-input"]',
  dataAprovacaoInput:
    '.css-yr6tdr > .trigger > [style="display: flex; flex-direction: column; gap: 4px;"] > [data-testid="text-field"] > [data-testid="text-field-container"] > .text-field__content > [data-testid="text-field-input"]',

  // =============================
  // (Critério 06) - Modal + Toast/Brinde
  // =============================
  modalDialog: 'div[role="dialog"]',
  btnModal: 'button[data-testid="button"]',
  toastMsgSucesso: 'Registro excluído com sucesso!',

  // =============================
  // (Critério 09) - Filtro “Nº ou Objetivo do Trabalho”
  // =============================
  filtroNumeroOuObjetivo: 'input[data-testid="field-objeto"]',

  // Mensagem sem resultados
  msgNenhumResultado: 'Nenhum resultado encontrado',

};

class ConsultarTrabalhoPage extends BasePage {
  // =============================
  // Helpers
  // =============================
  _aguardarTelaEstavel() {
    cy.get(L.body, { timeout: 30000 }).should('be.visible');

    cy.get(L.body).then(($b) => {
      const temSpinner =
        $b.find('svg.lucide-loader').length > 0 ||
        $b.find('[class*="loader"]').length > 0 ||
        $b.find('[aria-busy="true"]').length > 0;

      if (temSpinner) {
        cy.get(L.loader, { timeout: 30000 }).should('not.exist');
      }
    });

    cy.wait(300, { log: false });
  }

  _linhaTemTexto($tr, texto) {
    const t = ($tr.innerText || '').replace(/\s+/g, ' ').trim();
    return t.toLowerCase().includes(String(texto).toLowerCase());
  }

  _validarTituloContem(seletorTitulo, texto) {
    cy.get(seletorTitulo, { timeout: 30000 })
      .filter((_, el) => {
        const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
        return t.toLowerCase().includes(String(texto).toLowerCase());
      })
      .first()
      .should('be.visible');
  }

  _inputPorLabel(textoLabel) {
    return cy
      .contains('label, p, span', textoLabel, { timeout: 30000 })
      .filter(':visible')
      .first()
      .closest('div')
      .find('input[data-testid="text-field-input"], input')
      .filter(':visible')
      .first();
  }

  _aguardarFormularioEdicaoRenderizado() {
    cy.get(L.textFieldContainer, { timeout: 30000 })
      .should('exist')
      .should('have.length.greaterThan', 0);

    cy.get(L.textFieldContainer, { timeout: 30000 })
      .first()
      .find(L.textFieldInput, { timeout: 30000 })
      .first()
      .should('be.visible');

    cy.get(L.textarea, { timeout: 30000 }).first().should('be.visible');

    cy.wait(200, { log: false });
  }

  // =============================
  // VALIDAÇÕES DE TELA
  // =============================
  validarNaTelaConsulta() {
    cy.url({ timeout: 30000 }).should('match', L.urlConsulta);
    this._aguardarTelaEstavel();

    // garante que tem tabela (mesmo que vazia)
    cy.get(L.tabela, { timeout: 30000 }).should('exist');
  }

  validarListagemResultadosVisivel() {
    this._aguardarTelaEstavel();
    cy.get(L.body, { timeout: 30000 }).should('be.visible');
  }

  // =============================
  // CRITÉRIO 03 – ADICIONAR
  // =============================

  clicarAdicionarTrabalho() {
    this._aguardarTelaEstavel();
    cy.get(L.linkAdicionar, { timeout: 30000 })
      .should('exist')
      .within(() => {
        cy.get(L.botaoIcon, { timeout: 30000 })
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
  }

  
  registrarTrabalhoEmPlanejamento(dados) {
  this._aguardarTelaEstavel();
  // exemplo de preenchimento mínimo
  cy.get('[data-testid="textarea-input"]')
    .should('be.visible')
    .type(dados.objetivo, { force: true });
  // NÃO preencher Data de Aprovação 
  // regra: status ficará "Em Planejamento"
  cy.get('[data-testid="btn-save"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click({ force: true });
  // confirma modal
  cy.contains('button', 'Sim', { timeout: 30000 })
    .should('be.visible')
    .click({ force: true });
}    


  validarUrlTelaRegistroTrabalho() {
    cy.url({ timeout: 30000 }).should('match', L.urlNovo);
    this._aguardarTelaEstavel();
    this._validarTituloContem(L.tituloRegistrar, 'Registrar Trabalho');
  }

  // =============================
  // CRITÉRIO 04 – VISUALIZAR
  // =============================
  clicarVisualizarPrimeiroTrabalho() {
    this._aguardarTelaEstavel();

    cy.get(L.linhasTabela, { timeout: 30000 })
      .should('have.length.greaterThan', 0)
      .first()
      .within(() => {
        cy.get(L.btnVisualizarPrefix, { timeout: 30000 })
          .first()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
  }

  validarNaTelaVisualizacaoTrabalho() {
    cy.url({ timeout: 30000 }).should('match', L.urlVisualizar);
    this._aguardarTelaEstavel();
    this._validarTituloContem(L.tituloVisualizar, 'Visualizar');
  }

  // =============================
  // CRITÉRIO 05 – EDITAR (Em Planejamento)
  // =============================
  clicarEditarTrabalhoEmPlanejamento() {
    this._aguardarTelaEstavel();

    cy.get(L.linhasTabela, { timeout: 30000 })
      .should('have.length.greaterThan', 0)
      .filter((_, tr) => this._linhaTemTexto(tr, L.statusPlanejamentoTexto))
      .first()
      .should('exist')
      .within(() => {
        cy.get(L.btnEditarPrefix, { timeout: 30000 })
          .first()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
  }

  validarUrlTelaEditarTrabalho() {
    cy.url({ timeout: 30000 }).should('match', L.urlEditar);
  }

  validarNaTelaEdicaoTrabalho() {
    this.validarUrlTelaEditarTrabalho();
    this._aguardarTelaEstavel();
    this._validarTituloContem(L.tituloEditar, 'Editar Trabalho');
    this._aguardarFormularioEdicaoRenderizado();
  }
  // =============================
  // EDIÇÃO (HU 4191)
  // =============================
  editarObjetivoTrabalho(texto) {
    this._aguardarTelaEstavel();
    cy.get(L.textareaInput, { timeout: 30000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .clear({ force: true })
      .type(String(texto), { force: true });
  }

  preencherDataAprovacao(data) {
    this._aguardarTelaEstavel();
    this._inputPorLabel(L.labelDataAprovacao)
      .should('be.visible')
      .clear({ force: true })
      .type(String(data), { force: true });
  }

  preencherCamposObrigatoriosAIniciar(dados) {
    const valores = {
      periodoDe: '012026',
      periodoAte: '122026',
      paa: '0000000000000',
      dataAprovacao: '12012026',
      ...dados,
    };

    this._aguardarTelaEstavel();

    this._inputPorLabel(L.labelUnidadeResponsavel)
      .should('be.visible')
      .click({ force: true });
    cy.get(L.opcoesDropdown, { timeout: 30000 })
      .should('have.length.greaterThan', 0)
      .first()
      .click({ force: true });

    this._inputPorLabel(L.labelPeriodoDe)
      .should('be.visible')
      .clear({ force: true })
      .type(String(valores.periodoDe), { force: true });

    this._inputPorLabel(L.labelPeriodoAte)
      .should('be.visible')
      .clear({ force: true })
      .type(String(valores.periodoAte), { force: true });

    this._inputPorLabel(L.labelPaa)
      .should('be.visible')
      .clear({ force: true })
      .type(String(valores.paa), { force: true });

    this.preencherDataAprovacao(valores.dataAprovacao);
  }

  editarTrabalhoParaAIniciar(dados) {
    const valores = {
      periodoDe: '012026',
      periodoAte: '122026',
      paa: '0000000000000',
      dataAprovacao: '12012026',
       origem: 'Auditoria',
      fonteGeradora: 'Outros',
      unidadeResponsavel: '1673',
      ...dados,
    };

    this.clicarEditarTrabalhoEmPlanejamento();
    this.validarNaTelaEdicaoTrabalho();

      cy.get(L.origem, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });
    cy.contains(L.opcoesDropdown, valores.origem, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true }, { timeout: 30000 }); 

      cy.wait(1000);

    cy.get(L.fonteGeradora, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });
    cy.contains(L.opcoesDropdown, valores.fonteGeradora, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.unidadeResponsavel, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });
    cy.contains(L.opcoesDropdown, valores.unidadeResponsavel, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });

    cy.get(L.periodoDeContainer, { timeout: 30000 })
      .should('be.visible')
      .find('input')
      .clear({ force: true })
      .type(String(valores.periodoDe), { force: true });

    cy.get(L.periodoAteInput, { timeout: 30000 })
      .should('be.visible')
      .clear({ force: true })
      .type(String(valores.periodoAte), { force: true });

    cy.get(L.paaInput, { timeout: 30000 })
      .should('be.visible')
      .clear({ force: true })
      .type(String(valores.paa), { force: true });

    cy.get(L.dataAprovacaoInput, { timeout: 30000 })
      .should('be.visible')
      .clear({ force: true })
      .type(String(valores.dataAprovacao), { force: true });

    this.salvarEdicaoTrabalho();
  }

  salvarEdicaoTrabalho() {
    this._aguardarTelaEstavel();
    cy.get(L.botaoSalvarEdicao, { timeout: 30000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });

    cy.get(L.modalDialog, { timeout: 30000 })
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Sim', { timeout: 30000 })
          .should('be.visible')
          .click({ force: true });
      });
  }

  validarStatusDoTrabalhoPorTexto(textoLinha, statusEsperado) {
    this._aguardarTelaEstavel();
    cy.get(L.linhasTabela, { timeout: 30000 })
      .should('have.length.greaterThan', 0)
      .filter((_, tr) => this._linhaTemTexto(tr, textoLinha))
      .first()
      .should(($tr) => {
        const texto = ($tr.text() || '').replace(/\s+/g, ' ').trim();
        expect(texto).to.include(statusEsperado);
      });
  }
// =============================
// Status: A Iniciar
// =============================
clicarEditarTrabalhoAIniciar() {
    this._aguardarTelaEstavel();
    cy.get(L.linhasTabela, { timeout: 30000 })
      .should('have.length.greaterThan', 0)
      .filter((_, tr) => this._linhaTemTexto(tr, L.statusIniciarTexto))
      .first()
      .should('exist')
      .within(() => {
        cy.get(L.btnEditarPrefix, { timeout: 30000 })
          .first()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
  }

filtrarPorStatusAIniciar() {
  this._aguardarTelaEstavel();

  cy.get('.MuiGrid-grid-md-6 > .MuiStack-root > [data-testid="dropdown"] > .dropdown__trigger > .dropdown-field > .dropdown-field__container > .dropdown-field__icons > .lucide-chevron-down')
    .should('be.visible')
    .click({ force: true });
  cy.get(':nth-child(3) > .list-item__content')
    .should('be.visible')
    .click({ force: true });

  // aguarda a tabela recarregar
  this._aguardarTelaEstavel();

  // garante que existem resultados após o filtro
  cy.get(L.linhasTabela, { timeout: 30000 })
    .should('have.length.greaterThan', 0);
}

  // ====================================================================
  // CRITÉRIO 06 – EXCLUIR TRABALHO (Em Planejamento)
  // ====================================================================
  clicarExcluirTrabalhoEmPlanejamento(textoLinha) {
    this._aguardarTelaEstavel();

    if (textoLinha) {
      return this.buscarLinhaPorDescricao(textoLinha).within(() => {
        cy.get(L.btnExcluirPrefix, { timeout: 30000 })
          .first()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
    }

    cy.get(L.linhasTabela, { timeout: 30000 })
      .should('have.length.greaterThan', 0)
      .filter((_, tr) => {
        if (textoLinha) {
          return (
            this._linhaTemTexto(tr, textoLinha) &&
            this._linhaTemTexto(tr, L.statusPlanejamentoTexto)
          );
        }
        return this._linhaTemTexto(tr, L.statusPlanejamentoTexto);
      })
      .first()
      .should('exist')
      .within(() => {
        cy.get(L.btnExcluirPrefix, { timeout: 30000 })
          .first()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
  }

  buscarLinhaPorDescricao(descricao) {
    this._aguardarTelaEstavel();

    return cy.get(L.linhasTabela, { timeout: 30000 }).then(($trs) => {
      const linhas = Array.from($trs);
      const textos = linhas.map((tr) =>
        (tr.innerText || '').replace(/\s+/g, ' ').trim()
      );

      cy.log(`textoLinha: ${descricao}`);
      textos.forEach((texto, idx) => {
        cy.log(`linha[${idx}]: ${texto}`);
      });

      const linha = linhas.find((tr) => this._linhaTemTexto(tr, descricao));
      expect(linha, `linha contendo "${descricao}"`).to.exist;
      return cy.wrap(linha);
    });
  }

  validarModalConfirmacaoExclusao() {
    cy.get(L.modalDialog, { timeout: 30000 }).should('be.visible');
  }

  //  alias para o spec
  validarModalConfirmacaoExclusaoVisivel() {
    this.validarModalConfirmacaoExclusao();
  }

  confirmarExclusaoNoModal() {
    cy.get(L.modalDialog, { timeout: 30000 })
      .should('be.visible')
      .within(() => {
        cy.get(L.btnModal, { timeout: 30000 })
          .filter(
            (_, el) =>
              (el.innerText || '').replace(/\s+/g, ' ').trim() === 'Confirmar'
          )
          .first()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
  }

  validarBrindeExclusaoSucesso() {
    cy.get(L.body, { timeout: 30000 })
      .find('*')
      .filter(
        (_, el) =>
          (el.innerText || '').replace(/\s+/g, ' ').trim() === L.toastMsgSucesso
      )
      .first()
      .should('be.visible');
  }

  //  alias para o spec
  validarToastExclusaoSucesso() {
    this.validarBrindeExclusaoSucesso();
  }

  // ====================================================================
  // CRITÉRIO 09 – SEM RESULTADOS (Nº ou Objetivo do Trabalho)
  // ====================================================================
  preencherFiltroNumeroOuObjetivoDoTrabalho(texto) {
    this._aguardarTelaEstavel();

    cy.get(L.filtroNumeroOuObjetivo, { timeout: 30000 })
      .should('be.visible')
      .scrollIntoView()
      .clear({ force: true })
      .type(String(texto), { delay: 0, force: true });

    cy.wait(300, { log: false });
  }

  validarMensagemNenhumResultadoEncontrado() {
    this._aguardarTelaEstavel();

    cy.get(L.body, { timeout: 30000 })
      .find('*')
      .filter(
        (_, el) =>
          (el.innerText || '').replace(/\s+/g, ' ').trim() === L.msgNenhumResultado
      )
      .first()
      .should('be.visible');
  }

  validarNaoExibirListaDeDados() {
    this._aguardarTelaEstavel();

    cy.get(L.body, { timeout: 30000 }).then(($b) => {
      const temTabela = $b.find('table').length > 0;

      if (temTabela) {
        cy.get(L.linhasTabela, { timeout: 30000 }).should('have.length', 0);
      } else {
        expect($b.find('table').length).to.eq(0);
      }
    });
  }

  validarFiltroNumeroOuObjetivoMantido(valorEsperado) {
    this._aguardarTelaEstavel();

    cy.get(L.filtroNumeroOuObjetivo, { timeout: 30000 })
      .should('be.visible')
      .should(($el) => {
        const val =
          (typeof $el.val === 'function' ? $el.val() : undefined) ||
          $el.attr('value') ||
          $el.text();
        expect((val || '').toString().trim()).to.eq(String(valorEsperado));
      });
  }


}

export const consultarTrabalhoPage = new ConsultarTrabalhoPage();
export default ConsultarTrabalhoPage;

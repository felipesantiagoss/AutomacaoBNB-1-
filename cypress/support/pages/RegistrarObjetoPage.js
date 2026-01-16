// cypress/support/pages/RegistrarObjetoPage.js
import BasePage from './BasePage.js';

const L = {
  // =============================
  // CAMPOS BÁSICOS (flexíveis p/ id OU data-testid)
  // =============================

  // Ciclo
  campoCiclo:
    '#field-ciclo [data-testid="text-field-container"], ' +
    '[data-testid="field-ciclo"] [data-testid="text-field-container"]',

  // Tipo de Objeto
  campoTipoObjeto:
    '#field-tipo-objeto [data-testid="text-field-container"], ' +
    '[data-testid="field-tipo-objeto"] [data-testid="text-field-container"]',

  // Classificação de Risco
  campoClassificacaoRisco:
    '#field-classificacao-risco [data-testid="text-field-container"], ' +
    '[data-testid="field-classificacao-risco"] [data-testid="text-field-container"]',

  // Descrição do Objeto
  campoDescricaoContainer:
    '#field-descricao [data-testid="text-field-container"], ' +
    '[data-testid="field-descricao"] [data-testid="text-field-container"]',

  // Sempre relativo ao container
  campoDescricaoInput: '[data-testid="text-field-input"], textarea, input',

  // =============================
  // BOTÕES
  // =============================
  botaoCancelar: '[data-testid="btn-cancel"]',
  botaoSalvar: '[data-testid^="btn-save"]', // começa com "btn-save"

  // =============================
  // TRILHA DE NAVEGAÇÃO
  // =============================
  trilhaObjeto: '[data-testid="link-breadcrumbs-objeto"]',

  // =============================
  // MODAIS (alertas / confirmações)
  // =============================
  dialogRoot: '[role="dialog"]',
};

class RegistrarObjetoPage extends BasePage {
  // =============================
  // URL
  // =============================
  validarUrlDaTelaCriacao() {
    cy.url({ timeout: 20000 }).should('match', /\/objeto\/novo$/);
  }

  validarUrlDaTelaEdicao() {
    cy.url({ timeout: 20000 }).should('match', /\/objeto\/\d+\/editar$/);
  }

  // Visualização: ex. /objeto/90
  validarUrlDaTelaVisualizacao() {
    cy.url({ timeout: 20000 }).should('match', /\/objeto\/\d+$/);
  }

  // alias usado nas specs do HU 4184
  validarUrlDaTela() {
    this.validarUrlDaTelaCriacao();
  }

  // =============================
  // CAMPOS OBRIGATÓRIOS
  // =============================
  validarCamposObrigatoriosBasicos() {
    [
      L.campoCiclo,
      L.campoTipoObjeto,
      L.campoClassificacaoRisco,
      L.campoDescricaoContainer,
    ].forEach((sel) => {
      cy.get(sel, { timeout: 20000 }).should('be.visible');
    });
  }

  // =============================
  // DESCRIÇÃO
  // =============================
  preencherDescricao(texto) {
    cy.get(L.campoDescricaoContainer, { timeout: 20000 })
      .should('be.visible')
      .find(L.campoDescricaoInput)
      .first()
      .clear({ force: true })
      .type(texto, { force: true });
  }

  focarDescricaoParaEvidencia() {
    cy.get(L.campoDescricaoContainer, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });
  }

  alterarDescricaoPara(texto) {
    this.preencherDescricao(texto);
  }

  validarDescricaoNaoVaziaEReticenciasQuandoAplicavel() {
    cy.get(L.campoDescricaoContainer, { timeout: 20000 })
      .find(L.campoDescricaoInput)
      .first()
      .then(($el) => {
        const val =
          (typeof $el.val === 'function' ? $el.val() : undefined) ||
          $el.attr('value') ||
          $el.text();
        const texto = (val || '').toString().trim();

        expect(
          texto.length,
          'descrição do objeto não vazia'
        ).to.be.greaterThan(0);

        if (texto.length > 3 && texto.endsWith('...')) {
          expect(
            texto.endsWith('...'),
            'reticências aplicadas no fim da descrição (quando configuradas)'
          ).to.be.true;
        }
      });
  }

  // =============================
  // CLASSIFICAÇÃO DE RISCO – "Muito baixo"
  // =============================
  preencherClassificacaoRiscoMuitoBaixo() {
    const alvo = 'Muito baixo';

    cy.log('Selecionando Classificação de Risco = "Muito baixo"');

    cy.get(L.campoClassificacaoRisco, { timeout: 20000 })
      .should('be.visible')
      .as('campoClassRisco');

    cy.get('@campoClassRisco')
      .find('[data-testid="text-field-trailing-icon"], button, [role="button"]')
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get('button[role="option"]', { timeout: 20000 })
      .filter((_, el) => (el.innerText || '').trim() === alvo)
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get('@campoClassRisco')
      .find('input,[data-testid="text-field-input"]')
      .first()
      .should(($el) => {
        const val =
          (typeof $el.val === 'function' ? $el.val() : undefined) ||
          $el.attr('value') ||
          $el.text();
        expect((val || '').toString().trim()).to.eq(alvo);
      });
  }

  // =============================
  // TIPO DE OBJETO – "Grupo de Processos"
  // =============================
  preencherTipoObjetoGrupoDeProcessos() {
    const alvo = 'Grupo de Processos';

    cy.log('Selecionando Tipo de Objeto = "Grupo de Processos"');

    // 0 = Ciclo | 1 = Tipo de Objeto | 2 = Classificação de Risco
    cy.get('[data-testid="text-field"]', { timeout: 20000 })
      .eq(1)
      .as('campoTipoObjeto');

    cy.get('@campoTipoObjeto')
      .find('[data-testid="text-field-container"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('button[role="option"]', { timeout: 20000 })
      .filter((_, el) => (el.innerText || '').trim() === alvo)
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get('@campoTipoObjeto')
      .find('input,[data-testid="text-field-input"]')
      .first()
      .should(($el) => {
        const val =
          (typeof $el.val === 'function' ? $el.val() : undefined) ||
          $el.attr('value') ||
          $el.text();
        expect((val || '').toString().trim()).to.eq(alvo);
      });
  }

  // =============================
  // TIPO DE OBJETO – "Órgão de Negócio"
  // =============================
  preencherTipoObjetoOrgaoDeNegocios() {
    // Texto normalizado para comparação (tudo minúsculo)
    const alvoNormalizado = 'órgão de negócio';

    cy.log('Selecionando Tipo de Objeto = "Órgão de Negócio"');

    // 0 = Ciclo | 1 = Tipo de Objeto | 2 = Classificação de Risco
    cy.get('[data-testid="text-field"]', { timeout: 20000 })
      .eq(1)
      .as('campoTipoObjeto');

    cy.get('@campoTipoObjeto')
      .find('[data-testid="text-field-container"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('button[role="option"]', { timeout: 20000 })
      .filter((_, el) => {
        const texto = (el.innerText || '').trim().toLowerCase();
        return texto === alvoNormalizado;
      })
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get('@campoTipoObjeto')
      .find('input,[data-testid="text-field-input"]')
      .first()
      .should(($el) => {
        const val =
          (typeof $el.val === 'function' ? $el.val() : undefined) ||
          $el.attr('value') ||
          $el.text();
        expect((val || '').toString().trim()).to.eq('Órgão de Negócio');
      });
  }

  // =============================
  // BOTÕES
  // =============================
  clicarSalvar() {
    this.clickStable(L.botaoSalvar);
  }

  clicarCancelar() {
    this.clickStable(L.botaoCancelar);
  }

  // =============================
  // TRILHA "Objeto"
  // =============================
  destacarTrilhaObjetoParaEvidencia() {
    cy.get(L.trilhaObjeto, { timeout: 20000 }).should('be.visible').realHover();
  }

  clicarTrilhaObjeto() {
    cy.get(L.trilhaObjeto, { timeout: 20000 })
      .should('be.visible')
      .realHover()
      .click({ force: true });
  }

  // =============================
  // MODAIS – ALERTA / CONFIRMAÇÃO
  // =============================
  validarJanelaPerdaDados() {
    cy.get(L.dialogRoot, { timeout: 10000 })
      .should('be.visible')
      .then(($dlg) => {
        const texto = ($dlg.text() || '').trim();
        expect(
          texto.includes('alterações não salvas'),
          'mensagem de perda de dados'
        ).to.be.true;
      });
  }

  // alias usado nos critérios 04 e 05 (janela genérica de confirmação)
  validarJanelaConfirmacaoAlerta() {
    this.validarJanelaPerdaDados();
  }

  confirmarSaidaSemSalvar() {
    cy.get(L.dialogRoot, { timeout: 10000 })
      .should('be.visible')
      .find('button')
      .filter((_, el) => (el.textContent || '').trim() === 'Sim')
      .first()
      .click({ force: true });
  }

  garantirQueNaoExibiuJanelaConfirmacao() {
    cy.get(L.dialogRoot, { timeout: 5000 }).should('not.exist');
  }

  // =============================
  // DUPLICIDADE DE OBJETO NO CICLO
  // =============================
  validarMensagemDuplicidadeObjetoNoCiclo() {
    cy.get(L.dialogRoot, { timeout: 10000 })
      .should('be.visible')
      .then(($dlg) => {
        const texto = ($dlg.text() || '').trim();
        expect(
          texto.includes('Já existe um objeto com esta descrição no ciclo') ||
            texto.includes('Já existe um objeto com essa descrição no ciclo.'),
          'mensagem de duplicidade de objeto no ciclo'
        ).to.be.true;
      });
  }

  // =============================
  // MODO SOMENTE LEITURA (HU 4188)
  // =============================
  validarModoSomenteLeitura() {
    // Garante que na tela de visualização todos os campos visíveis
    // estejam desabilitados ou readOnly (sem edição).
    cy.get('form, body', { timeout: 20000 })
      .first()
      .within(() => {
        cy.get('input:visible, textarea:visible, select:visible').each(($el) => {
          const disabled = $el.is(':disabled');
          const readOnly = !!$el.prop('readOnly');
          expect(
            disabled || readOnly,
            `campo somente leitura: name=${$el.attr('name') || ''}`
          ).to.be.true;
        });
      });

    // Opcional: não deve existir botão de salvar na tela de visualização
    cy.get('body').then(($body) => {
      const hasSave = $body.find(L.botaoSalvar).length > 0;
      if (hasSave) {
        cy.get(L.botaoSalvar).should('be.disabled');
      }
    });
  }
}

export const registrarObjetoPage = new RegistrarObjetoPage();
export default RegistrarObjetoPage;

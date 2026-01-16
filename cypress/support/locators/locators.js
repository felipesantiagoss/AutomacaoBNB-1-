// cypress/support/locators/locators.js
const Locators = {
  appbar: {
    topo: ".header__lightness__brand",
    logo: '.header__lightness__brand [data-testid="logo"]',
    titulo: "h2.header__leading-section__logo-and-title__title",
    btnSair: ".header__lightness__brand #btn-sair",
    btnTema: ".header__lightness__brand #btn-tema",
    btnMenuLateral: ".header__leading-section button:first-of-type",
  },

  menuLateral: {
    inicio: ".navigation-drawer #home",
    recomendacao: ".navigation-drawer #recomendacao",
    planejamento: '.navigation-drawer button.AccordionTrigger[id^="radix-"]',
    ciclo: ".navigation-drawer #ciclo",
  },

  pages: {
    recomendacao: {
      index: {
        btnAddTrabalho: "btn-add-trabalho-list",
      },
      create: {
        btnAddOcorrencia: "#btn-add-ocorrencia",
        btnAddRecomendacao: "#btn-add-recomendacao",
        btnSaveRecomendacao: "#btn-save-recomendacao",
        btnAccordionOcorrencia:
          "#accordion-ocorrencia-{index} button.MuiAccordionSummary-root",
        btnRemoveOcorrencia: "#btn-remove-ocorrencia-{index}",
        btnComfirRemoveOcor: "#btn-dialog-confirm",
        btnExpandirTextField: "button.trailing-icon",
        itemListRecomendacao: "#item-list-rec-{indexRec}-oc-{index}",
        campoDescricaoRecomendacao: "#textarea-descricao-recomendacao",
        campoDataVigRecomendacao: "#textfield-data-vigencia-recomendacao",
        campoDataCadastro: "#field-data-cadastro",
        campoUnidadeResponsavel: "#field-unidade-responsavel input",
        campoUnidadeDestino: "#field-unidade-destino input",
        campoProcesso: "#field-processo input",
        campoVersao: "#field-versao input",
        campoObjeto: "#field-objeto input",
        campoGed: "#field-dossie input",
        campoAbrangencia: "#abrangencia-{index}",
        campoImpacto: "#impacto-{index}",
        campoProbabilidade: "#probabilidade-{index}",
        campoClassificacaoRisco: "#classificacao-risco-{index}",
        campoTextFieldOcorrencia: "#textfield-ocorrencia-{index}",
        campoTextFieldCausa: "#textfield-causa-{index}",
        campoTextFieldConsequencia: "#textfield-consequencia-{index}",
        campoTextFieldEvidencia: "#textfield-evidencia-{index}",
        campoTextFieldCriteiro: "#textfield-criterio-{index}",
        campoTextAreadCausa: "#textarea-causa-{index}",
        campoTextAreadConsequencia: "#textarea-consequencia-{index}",
        campoTextAreaOcorrencia: "#textarea-ocorrencia-{index}",
        campoTextAreaEvidencia: "#textarea-evidencia-{index}",
        campoTextAreaCriteiro: "#textarea-criterio-{index}",
        autocompleteOpcoes: ".MuiAutocomplete-popper",
        btnExpandirOpcoesProcesso: "#field-processo button",
        btnExpandirOpcoesObjeto: "#field-objeto button",
        btnExpandirOpcoesUnidadeDestino: "#field-unidade-destino button",
        btnExpandirOpcoesResponsavel: "#field-unidade-responsavel button",
        btnExpandirOpcoesAbrangencia: "#abrangencia-{index} button",
        btnExpandirOpcoesImpacto: "#impacto-{index} button",
        btnExpandirOpcoesProbabilidade: "#probabilidade-{index} button",
        btnExpandirOpcoesClassificacaoRisco:
          "#classificacao-risco-{index} button",
        erros: {
          msgErroDataCadastro:
            "#wrapper-field-data-cadastro .text-field__support-text",
        },
      },
    },

    // CICLO
    ciclo: {
      index: {
        btnAddCiclo: "#btn-add-ciclo", // "+ Adicionar Ciclo"
        titulo: "#page-title",
      },
      //  ADICIONADO: usado pela Page de EDIÇÃO
      edicao: {
        titulo: "#page-title",
        // se preferir validar por texto, pode alternar para:
        // titulo: 'h1, #page-title'
      },
    },
  },

  login: {
    username: "#username",
    password: "#password",
    signIn: ".button-login",
  },

  shared: {
    btnDialogConfirm: "#btn-dialog-confirm",
    btnDialogCancel: "#btn-dialog-cancel",
    pageTitle: "#page-title",
  },
};

export default Locators;

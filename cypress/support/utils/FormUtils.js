import Locators from "../locators/locators";

/**
 * Utilitários para manipulação de formulários
 */
class FormUtils {
  /**
   * Seleciona opção em dropdown por label
   * @param {RegExp|string} labelRegex - Regex ou texto do label
   * @param {string} optionText - Texto da opção a selecionar
   */
  static selecionarPorLabel(labelRegex, optionText) {
    cy.contains("label", labelRegex, { timeout: 16000 })
      .parents('[data-testid="text-field-container"]')
      .as("campo");

    cy.get("@campo")
      .find('[data-testid="text-field-trailing-icon"]')
      .click({ force: true });

    cy.get("body", { timeout: 20000 })
      .contains(new RegExp(`^${optionText}$`, "i"))
      .should("be.visible")
      .click({ force: true });

    cy.get("@campo")
      .find("input")
      .should(($i) => {
        const val = ($i.val() || "").toString().trim().toUpperCase();
        expect(val).to.eq(optionText.toUpperCase());
      });
  }

  /**
   * Preenche campo de data usando setter nativo
   * @param {string} selector - Seletor do campo
   * @param {string} data - Data no formato YYYY-MM-DD
   */
  static preencherDataNativa(selector, data) {
    cy.get(selector).should("be.visible").invoke("val", "").type(data);
  }

  /**
   * Preenche campo de texto com validação
   * @param {string} selector - Seletor do campo
   * @param {string} texto - Texto a ser digitado
   * @param {Object} options - Opções adicionais
   */
  static preencherCampoTexto(selector, texto, options = {}) {
    const { force = true, clear = true } = options;

    if (clear) {
      cy.get(selector).clear({ force });
    }

    cy.get(selector).type(texto, { force });
  }

  static selecionarDropDownList(btnExpandirOpcoes, opcao) {
    // Clica no botão do dropdown
    cy.get(btnExpandirOpcoes).should("be.visible").click();

    // Aguarda a lista abrir
    cy.get(".list-content")
      .should("be.visible")
      .within(() => {
        // Se passar o nome da opção, clica nela
        if (opcao) {
          cy.contains(".list-item__content__title", opcao)
            .should("be.visible")
            .click({ force: true });
        } else {
          // Se não passar nada, pega a primeira
          cy.get("[data-testid='list-item']").first().click({ force: true });
        }
      });
  }

  static selecionarOpcaoAutoComplete(btnExpandirOpcoes) {
    cy.get(btnExpandirOpcoes).and("be.visible").click();

    cy.get(Locators.pages.recomendacao.create.autocompleteOpcoes).should(
      "be.visible"
    );

    cy.get(
      `${Locators.pages.recomendacao.create.autocompleteOpcoes} [role="option"]`
    )
      .first()
      .click({ force: true });
  }

  static getMatrizRiscoClassificacao() {
    return [
      {
        probabilidade: "QUASE CERTA",
        impacto: "MUITO BAIXO",
        classificacao: "MODERADO",
      },
    ];
  }
}

export default FormUtils;

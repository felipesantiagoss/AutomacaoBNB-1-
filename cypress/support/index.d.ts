/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Seleciona um dropdown pelo label e valida o valor.
     */
    selectDropdown(labelRegex: RegExp, optionText: string): Chainable<void>;

    /**
     * Screenshot da página inteira usando zoom dinâmico (sem costura).
     */
    screenshotFullPage(
      name?: string,
      margin?: number,
      minZoom?: number,
      maxZoom?: number
    ): Chainable<void>;

    /**
     * Seleciona Abrangência/Impacto/Probabilidade e tira o print final.
     */
    fillAIPAndShot(options?: {
      abrangencia?: string;
      impacto?: string;
      probabilidade?: string;
      name?: string;
      margin?: number;
      minZoom?: number;
      maxZoom?: number;
    }): Chainable<void>;
  }
}
declare namespace Cypress {
  interface Chainable {
    selecionarAnoCiclo(ano: number | string): Chainable<void>;
  }
}

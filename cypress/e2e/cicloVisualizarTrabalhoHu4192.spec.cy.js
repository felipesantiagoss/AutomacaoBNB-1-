/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { consultarTrabalhoPage } from '../support/pages/ConsultarTrabalhoPage.js';

describe('Planejamento > Trabalho - HU 4192', { tags: '@entrega' }, () => {
  beforeEach(() => {
    cy.visit(Cypress.env('URL_SISTEMA'));
    Login.signIn();
    appBar.expandirMenuLateral();
  });

  context('HU 4192 - Visualizar Trabalho', () => {

    // ==========================================================
    // CRITÉRIO 01 – VISUALIZAR TRABALHO
    // ==========================================================
    it('[Critério 01] - Visualizar um trabalho cadastrado', () => {
      // DADO ---------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');

      cy.E('que o usuário acionou a opção do menu Planejamento');
      menuLateral.abrirPlanejamento();
      cy.snap('c01-01-menu-planejamento');

      cy.E('que o usuário acionou o submenu Geral');
      menuLateral.abrirGeral();
      cy.snap('c01-02-menu-geral');

      cy.E('que o usuário clicou no submenu Trabalho');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c01-03-tela-consultar-trabalho');

      // QUANDO -----------------------------------------------
      cy.Quando('o usuário aciona a opção Visualizar em um trabalho');
      consultarTrabalhoPage.clicarVisualizarPrimeiroTrabalho();
      cy.snap('c01-04-click-visualizar-trabalho');

      // ENTÃO -----------------------------------------------
      cy.Entao(
        'o sistema deve redirecionar para a tela "Visualizar Trabalho"'
      );
      consultarTrabalhoPage.validarNaTelaVisualizacaoTrabalho();
      cy.snap('c01-05-tela-visualizar-trabalho');
    });

    // ==========================================================
    // CRITÉRIO 02 – EXIBIR A TRILHA DE NAVEGAÇÃO
    // ==========================================================
    /*it('[Critério 02] - Exibir a trilha de navegação', () => {
      // DADO ---------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');

      cy.E('que o usuário acionou a opção do menu Planejamento');
      menuLateral.abrirPlanejamento();
      cy.snap('c02-01-menu-planejamento');

      cy.E('que o usuário acionou o submenu Geral');
      menuLateral.abrirGeral();
      cy.snap('c02-02-menu-geral');

      cy.E('que o usuário clicou no submenu Trabalho');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c02-03-tela-consultar-trabalho');

      cy.E('que o usuário acessou a tela de Visualizar Trabalho');
      consultarTrabalhoPage.clicarVisualizarPrimeiroTrabalho();
      consultarTrabalhoPage.validarNaTelaVisualizacaoTrabalho();
      cy.snap('c02-04-tela-visualizar-trabalho');

      // ENTÃO -----------------------------------------------
      cy.Entao('o sistema deve exibir a trilha de navegação');
      consultarTrabalhoPage.validarTrilhaVisivel();
      consultarTrabalhoPage.destacarTrilhaParaEvidencia();
      cy.snap('c02-05-trilha-navegacao-visivel');

      cy.E('quando o usuário clicar em um item anterior da trilha');
      consultarTrabalhoPage.clicarTrilhaConsultarTrabalho();

      cy.Entao(
        'o sistema deve retornar para a tela de consulta de trabalhos'
      );
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c02-06-retorno-consultar-trabalho');
    }); */
  }); 
});

/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { objetoPage } from '../support/pages/ObjetoPage.js';
import { registrarObjetoPage } from '../support/pages/RegistrarObjetoPage.js';

describe(
  'Planejamento > Objeto - Critérios 01 e 02 (HU 4188)',
  { tags: '@entrega' },
  () => {
    beforeEach(() => {
      cy.visit(Cypress.env('URL_SISTEMA'));
      Login.signIn();
      appBar.expandirMenuLateral();
    });

    context('271224 - Fluxos da tela Visualizar Objeto', () => {
      it('[Critério 01] - Visualizar objeto', () => {
        // DADO --------------------------------------------------------------
        cy.Dado(
          'que o usuário acessou a opção de menu Planejamento > Geral > Objeto'
        );

        menuLateral.abrirPlanejamento();
        cy.snap('c01-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c01-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('c01-03-lista-objetos-ciclo-atual');

        cy.E('que o sistema selecionou o ciclo atual');
        // A seleção do ciclo atual é evidenciada pelo print da tela

        // QUANDO ------------------------------------------------------------
        cy.Quando(
          'o usuário acionar a opção de "Visualizar objeto" em um objeto'
        );

        objetoPage.clicarVisualizarPrimeiraLinha();
        registrarObjetoPage.validarUrlDaTelaVisualizacao();
        cy.snap('c01-04-tela-visualizar-objeto');

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve redirecionar o usuário para a tela com o título "Visualizar Objeto"'
        );

        cy.E(
          'o sistema deve exibir todos os campos registrados do objeto sem permitir a edição de nenhum campo'
        );
        registrarObjetoPage.validarModoSomenteLeitura();
        cy.snap ('c01-05-evidencia-final-cenario01');
      });

      it('[Critério 02] - Exibir trilha de navegação', () => {
        // DADO --------------------------------------------------------------
        cy.Dado(
          'que o usuário acessou a tela "Visualizar Objeto" que possui uma trilha de navegação'
        );

        menuLateral.abrirPlanejamento();
        cy.snap('c02-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c02-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('c02-03-lista-objetos-ciclo-atual');

        objetoPage.clicarVisualizarPrimeiraLinha();
        registrarObjetoPage.validarUrlDaTelaVisualizacao();
        cy.snap('c02-04-tela-visualizar-objeto');

        // QUANDO ------------------------------------------------------------
        cy.Quando('o sistema exibir a tela "Visualizar Objeto"');

        registrarObjetoPage.destacarTrilhaObjetoParaEvidencia();
        cy.snap('c02-05-trilha-objeto-destacada');

        cy.E(
          'que o usuário clicar no item "Objeto" na trilha de navegação'
        );

        registrarObjetoPage.clicarTrilhaObjeto();
        cy.snap('c02-06-click-trilha-objeto');

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve direcionar o usuário para a tela de consulta de objetos'
        );

        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('c02-07-tela-consultar-objetos-final');
      });
    });
  }
);

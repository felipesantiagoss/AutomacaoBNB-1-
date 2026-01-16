/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { objetoPage } from '../support/pages/ObjetoPage.js';
import { replicarObjetoPage } from '../support/pages/ReplicarObjetoPage.js';

describe(
  'Planejamento > Objeto - Critérios 01, 03, 04 e 07 (HU 4186)',
  { tags: '@entrega' },
  () => {
    beforeEach(() => {
      cy.visit(Cypress.env('URL_SISTEMA'));
      Login.signIn();
      appBar.expandirMenuLateral();
    });

    context('1340054 - Fluxos da tela Replicar Objetos', () => {
       it('[Critério 01] - Recuperar objetos registrados', () => {
        const anoCiclo = 2024;

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

        cy.E('que o usuário acionou a opção de replicar objetos');

        objetoPage.verBotaoReplicarVisivel();
        cy.snap('c01-04-botao-replicar-objeto-na-lista');

        objetoPage.clicarReplicar();
        replicarObjetoPage.validarUrlReplicarObjeto();
        cy.snap('c01-05-tela-replicar-objeto-sem-ciclo-selecionado');

        // QUANDO ------------------------------------------------------------
        cy.Quando(
          `o usuário selecionar o ciclo ${anoCiclo} na tela "Replicar Objeto"`
        );

        replicarObjetoPage.selecionarCiclo(anoCiclo);
        cy.snap('c01-06-lista-objetos-do-ciclo-2024');

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve recuperar os objetos, independentemente do status, ligados ao ciclo selecionado'
        );

        cy.E('o sistema deve permitir a seleção de um objeto');
        replicarObjetoPage.selecionarPrimeiroObjeto();
        cy.snap('c01-07-um-objeto-selecionado');

        cy.E('o sistema deve permitir a seleção de mais de um objeto');
        replicarObjetoPage.selecionarTodosObjetos();
        cy.snap('c01-08-varios-objetos-selecionados');

       });

       it('[Critério 03] - Cancelar a ação de replicar objetos registrados', () => {
        const anoCiclo = 2024;

        // DADO --------------------------------------------------------------
        cy.Dado('que o usuário acionou a opção de replicar objeto');

        menuLateral.abrirPlanejamento();
        cy.snap('c03-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c03-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        cy.snap('c03-03-lista-objetos-ciclo-atual');

        objetoPage.clicarReplicar();
        replicarObjetoPage.validarUrlReplicarObjeto();
        cy.snap('c03-04-tela-replicar-objeto');

        cy.E('o usuário selecionou um ciclo');
        replicarObjetoPage.selecionarCiclo(anoCiclo);
        cy.snap('c03-05-objetos-carregados-para-o-ciclo');

        cy.E('o usuário selecionou um ou mais objetos');
        replicarObjetoPage.selecionarPrimeiroObjeto();
        cy.snap('c03-06-um-objeto-selecionado');

        // QUANDO ------------------------------------------------------------
        cy.Quando(
          'o usuário acionar a opção "Cancelar" na tela de replicar objetos (com objetos selecionados)'
        );

        replicarObjetoPage.clicarCancelar();
        cy.snap('c03-07-modal-confirmacao-cancelar-replicacao');

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve exibir uma janela de confirmação: "Os objetos selecionados não foram replicados, deseja cancelar?"'
        );

        replicarObjetoPage.validarJanelaConfirmacaoCancelarReplicacao();

        cy.E('o usuário clicar em "Não" no modal de confirmação');
        replicarObjetoPage.clicarNaoNaJanelaConfirmacao();
        cy.snap('c03-08-retorno-tela-replicar-objeto-apos-nao');

        cy.E(
          'o usuário desmarcar todos os objetos e acionar novamente a opção "Cancelar"'
        );
        replicarObjetoPage.desmarcarTodosObjetos();
        cy.snap('c03-09-objetos-desmarcados');

        replicarObjetoPage.clicarCancelar();

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve cancelar a ação de replicar objetos registrados, e encaminhar o usuário para a tela de consulta'
        );

        objetoPage.validarNaLista();
        cy.snap('c03-10-tela-consulta-objeto-apos-cancelar-replicacao');

       });

       it('[Critério 04] - Exibir a trilha de navegação com alerta de perda de dados', () => {
        // DADO --------------------------------------------------------------
        cy.Dado(
          'que o usuário acessou a tela "Replicar Objeto" que possui uma trilha de navegação'
        );

        menuLateral.abrirPlanejamento();
        cy.snap('c04-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c04-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        cy.snap('c04-03-lista-objetos-ciclo-atual');

        objetoPage.clicarReplicar();
        replicarObjetoPage.validarUrlReplicarObjeto();
        cy.snap('c04-04-tela-replicar-objeto');

        // QUANDO ------------------------------------------------------------
        cy.Quando('o sistema exibir a tela "Replicar Objeto"');

        // ENTÃO -------------------------------------------------------------
        cy.Entao('o sistema deve exibir no topo a trilha de navegação');
        replicarObjetoPage.validarTrilhaObjetoVisivel();
        replicarObjetoPage.destacarTrilhaObjetoParaEvidencia();
        cy.snap('c04-05-trilha-navegacao-visivel');

        cy.E('quando o usuário clicar em um item da trilha');
        replicarObjetoPage.clicarTrilhaObjeto();

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve direcionar o usuário para a tela de consulta de objetos'
        );

        objetoPage.validarNaLista();
        cy.snap('c04-06-tela-consulta-apos-clicar-trilha');


       });


       it('[Critério 07] - Alertar perda de dados preenchidos', () => {
       const anoCiclo = 2024;

       // DADO --------------------------------------------------------------
       cy.Dado('que o usuário acionou a opção de replicar objeto');

       menuLateral.abrirPlanejamento();
       cy.snap('c07-01-menu-planejamento');

       menuLateral.abrirGeral();
       cy.snap('c07-02-menu-geral');

       menuLateral.clicarMenuObjeto();
       objetoPage.validarNaLista();
       objetoPage.verBotaoAdicionarVisivel();
       cy.snap('c07-03-lista-objetos');

       objetoPage.verBotaoReplicarVisivel();
       objetoPage.clicarReplicar();
       replicarObjetoPage.validarUrlReplicarObjeto();
       cy.snap('c07-04-tela-replicar-sem-ciclo');

       cy.E('o sistema exibiu a tela Replicar Objeto');

       // Selecionar ciclo
       replicarObjetoPage.selecionarCiclo(anoCiclo);
       cy.snap('c07-05-ciclo-selecionado');

       // Seleciona 1 objeto
       cy.E('que o usuário selecionou um objeto');
       replicarObjetoPage.selecionarPrimeiroObjeto();
       cy.snap('c07-06-um-objeto-selecionado');

       // QUANDO ------------------------------------------------------------
       cy.Quando(
       'o usuário realizar uma ação que o tire da tela através da trilha de navegação'
       );

       replicarObjetoPage.destacarTrilhaObjetoParaEvidencia();
       replicarObjetoPage.clicarTrilhaObjeto();
       cy.snap('c07-07-trilha-clicada');

       // ENTÃO -------------------------------------------------------------
       cy.Entao(
       'o sistema deve exibir uma janela de confirmação de perda de dados'
       );

       replicarObjetoPage.validarJanelaConfirmacaoCancelarReplicacao();
       cy.snap('c07-08-modal-alerta-perda-de-dados');

       cy.E('não interagir com o modal (não clicar em Sim ou Não)');
     });
   });
});

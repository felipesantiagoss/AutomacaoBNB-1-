/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { objetoPage } from '../support/pages/ObjetoPage.js';
import { registrarObjetoPage } from '../support/pages/RegistrarObjetoPage.js';

describe(
  'Planejamento > Objeto - Critérios 03, 05 e 06 (HU 4187)',
  { tags: '@entrega' },
  () => {
    beforeEach(() => {
      // Acessa o sistema e faz login
      cy.visit(Cypress.env('URL_SISTEMA'));
      Login.signIn();

      // Sempre garante o menu lateral aberto
      appBar.expandirMenuLateral();
    });

    context('271220 - Fluxos da tela Editar Objeto', () => {
      it('[Critério 03] - Impedir editar um Objeto já existente no ciclo', () => {
  // DADO ----------------------------------------------------
  cy.Dado(
    'que o usuário acessou a consulta de Objetos com status "Em planejamento"'
  );

  menuLateral.abrirPlanejamento();
  cy.snap('c03-01-menu-planejamento');

  menuLateral.abrirGeral();
  cy.snap('c03-02-menu-geral');

  menuLateral.clicarMenuObjeto();
  objetoPage.validarNaLista();
  objetoPage.verBotaoAdicionarVisivel();
  cy.snap('c03-03-lista-objetos-inicial');

  cy.E(
    'que o usuário aplica o filtro "Status do Objeto = Em planejamento"'
  );
  objetoPage.selecionarStatusEmPlanejamento();
  cy.snap('c03-04-lista-filtrada-status-em-planejamento');

  cy.E(
    'que existe pelo menos 1 objeto em planejamento retornado pelo filtro'
  );
  objetoPage.destacarPrimeiraLinha();
  cy.snap('c03-05-primeira-linha-filtrada-destacada');

  cy.E('que o usuário aciona a opção de Editar o primeiro objeto da lista');
  objetoPage.clicarEditarPrimeiraLinha();
  registrarObjetoPage.validarUrlDaTelaEdicao();
  cy.snap('c03-06-tela-editar-objeto');

  // QUANDO --------------------------------------------------
  cy.Quando(
    'o usuário edita o campo "Tipo de Objeto" selecionando "ÓRGÃO DE NEGÓCIOS" e aciona a opção "Salvar"'
  );

  registrarObjetoPage.preencherTipoObjetoOrgaoDeNegocios();
  cy.snap('c03-07-tipo-objeto-orgao-de-negocios');

  registrarObjetoPage.clicarSalvar();
  cy.snap('c03-08-apos-click-salvar-edicao-duplicada');

  // ENTÃO ---------------------------------------------------
  cy.Entao(
    'o sistema não deve salvar o objeto editado na base de dados e deve exibir mensagem de duplicidade'
  );

  // A mensagem visual é registrada via screenshot;
  cy.snap('c03-09-mensagem-duplicidade-objeto');
});



      it('[Critério 05] - Trilha de navegação com alerta de perda de dados', () => {
        // DADO --------------------------------------------------------------
        cy.Dado(
          'que o usuário acessou a tela "Editar Objeto" que possui uma trilha de navegação'
        );

        menuLateral.abrirPlanejamento();
        cy.snap('c05-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c05-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('c05-03-lista-objetos-inicial');

        cy.E(
          'que o usuário aplica o filtro "Status do Objeto = Em planejamento"'
        );
        objetoPage.selecionarStatusEmPlanejamento();
        cy.snap('c05-04-lista-filtrada-status-em-planejamento');

        cy.E(
          'que o usuário seleciona o primeiro objeto em planejamento para edição'
        );
        objetoPage.destacarPrimeiraLinha();
        cy.snap('c05-05-primeira-linha-filtrada-destacada');

        objetoPage.clicarEditarPrimeiraLinha();
        registrarObjetoPage.validarUrlDaTelaEdicao();
        cy.snap('c05-06-tela-editar-objeto-inicial');

        // usuário altera descrição sem salvar
        cy.E('que o usuário realiza uma alteração na descrição sem salvar');
        registrarObjetoPage.alterarDescricaoPara('Teste de perda de dados');
        cy.snap('c05-07-descricao-alterada');

        // QUANDO --------------------------------------------------------------
        cy.Quando(
          'o usuário tenta sair da tela pela trilha de navegação clicando no item "Objeto"'
        );

        registrarObjetoPage.destacarTrilhaObjetoParaEvidencia();
        cy.snap('c05-08-trilha-objeto-destacada');

        registrarObjetoPage.clicarTrilhaObjeto();
        cy.snap('c05-09-click-trilha');

        // ENTÃO ---------------------------------------------------------------
        cy.Entao(
          'o sistema deve exibir uma janela de confirmação de perda de dados'
        );
        registrarObjetoPage.validarJanelaPerdaDados();
        cy.snap('c05-10-modal-confirmacao');

        cy.E('que o usuário confirma que deseja sair sem salvar');
        registrarObjetoPage.confirmarSaidaSemSalvar();

        // Chegou na tela de consulta — fim do critério
        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('c05-11-tela-consultar-final');
      });

      it(
        '[Critério 06] - Alertar perda de dados preenchidos ao sair da edição sem salvar',
        () => {
          // DADO ----------------------------------------------------
          cy.Dado(
            'que o usuário acionou a opção de Editar objeto em um objeto com status "Em planejamento"'
          );

          menuLateral.abrirPlanejamento();
          cy.snap('c06-01-menu-planejamento');

          menuLateral.abrirGeral();
          cy.snap('c06-02-menu-geral');

          menuLateral.clicarMenuObjeto();
          objetoPage.validarNaLista();
          objetoPage.verBotaoAdicionarVisivel();
          cy.snap('c06-03-lista-objetos-inicial');

          cy.E(
            'que o usuário aplica o filtro "Status do Objeto = Em planejamento"'
          );
          objetoPage.selecionarStatusEmPlanejamento();
          cy.snap('c06-04-lista-filtrada-status-em-planejamento');

          cy.E(
            'que existe pelo menos 1 objeto em planejamento retornado pelo filtro'
          );
          objetoPage.destacarPrimeiraLinha();
          cy.snap('c06-05-primeira-linha-filtrada-destacada');

          cy.E(
            'que o usuário acionou a opção de Editar o primeiro objeto da lista'
          );
          objetoPage.clicarEditarPrimeiraLinha();
          registrarObjetoPage.validarUrlDaTelaEdicao();
          cy.snap('c06-06-tela-editar-objeto');

          cy.E(
            'que o usuário realizou a edição do campo "descrição do objeto" para "TESTE" e não salvou'
          );
          registrarObjetoPage.alterarDescricaoPara('TESTE');
          cy.snap('c06-07-descricao-objeto-editada');

          // QUANDO --------------------------------------------------
          cy.Quando(
            'o usuário realizar uma ação que o tire da tela de edição, através da trilha de navegação'
          );

          registrarObjetoPage.clicarTrilhaObjeto();
          cy.snap('c06-08-click-breadcrumb-objeto');

          // ENTÃO ---------------------------------------------------
          cy.Entao(
            'o sistema deve exibir uma janela de confirmação: ALERTA - Você possui alterações não salvas. Deseja sair sem salvar? SIM - NÃO'
          );

          // A mensagem visual do alerta é registrada via screenshot;
          registrarObjetoPage.validarJanelaPerdaDados();
          cy.snap('c06-09-modal-alerta-perda-dados');
        }
      );
    });
  }
);

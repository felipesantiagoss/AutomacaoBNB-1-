/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { objetoPage } from '../support/pages/ObjetoPage.js';
import { registrarObjetoPage } from '../support/pages/RegistrarObjetoPage.js';

   describe(
   'Planejamento > Objeto - Critério 01: Acessar a Tela de Registro de Objeto',
   { tags: '@entrega' }, // tag aplicada no describe
   () => {
   beforeEach(() => {
   cy.visit(Cypress.env('URL_SISTEMA'));
   Login.signIn();
   // usa o btn-toggle-menu internamente (na Page).
   appBar.expandirMenuLateral();
    });

        context('271197 - Fluxos da tela Registrar Objeto', () => {
       
        it('[Critério 01] - Acessar a Tela de Registro de Objeto', () => {
        cy.Dado('que o usuário acessa o menu Planejamento');
        menuLateral.abrirPlanejamento();
        cy.snap('01-menu-planejamento-reduzido');

        cy.E('que o usuário acionou o submenu Geral');
        menuLateral.abrirGeral();
        cy.snap('02-menu-geral-reduzido');

        cy.E('que o usuário clicou no submenu Objeto');
        menuLateral.clicarMenuObjeto();

        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('03-lista-objeto-com-botao-mais');

        cy.Quando('o usuário aciona a opção de Registrar um Objeto (+)');
        objetoPage.clicarAdicionar();

        registrarObjetoPage.validarUrlDaTela();
        cy.snap('04-tela-registrar-objeto');

        cy.Entao('o sistema exibe campos obrigatórios e ações de cadastro');
        registrarObjetoPage.validarCamposObrigatoriosBasicos();
       });

        it('[Critério 03] - Exibir trilha de navegação', () => {
        cy.Dado(
        'que o usuário acessou a tela "Registrar Objeto" que possui uma trilha de navegação'
       );

        menuLateral.abrirPlanejamento();
        cy.snap('01-c03-menu-planejamento-reduzido');

        menuLateral.abrirGeral();
        cy.snap('02-c03-menu-geral-reduzido');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('03-c03-lista-objeto-com-botao-mais');

        objetoPage.clicarAdicionar();
        registrarObjetoPage.validarUrlDaTela();
        cy.snap('04-c03-tela-registrar-objeto');

        cy.Quando('o sistema exibir a tela "Registrar Objeto"');

        // Destaca a trilha "Objeto" e tira evidência
        registrarObjetoPage.destacarTrilhaObjetoParaEvidencia();
        cy.snap('05-c03-trilha-navegacao-registrar-objeto');

        cy.Entao(
          'o sistema deve exibir no topo da tela a trilha de navegação com o link "Objeto" como navegável'
         );
        });

         it('[Critério 04] - Cancelar criação do objeto (com descrição preenchida)',
         () => {
        
          // PRIMEIRA PARTE: COM DESCRIÇÃO "TESTE PARA AUTOMAÇÃO"
          
          cy.Dado(
          'o usuário aciona a opção Registrar um objeto "+" em um ciclo válido'
          );

          menuLateral.abrirPlanejamento();
          cy.snap('01-c04-menu-planejamento-reduzido');

          menuLateral.abrirGeral();
          cy.snap('02-c04-menu-geral-reduzido');

          menuLateral.clicarMenuObjeto();
          objetoPage.validarNaLista();
          objetoPage.verBotaoAdicionarVisivel();
          cy.snap('03-c04-lista-objeto-com-botao-mais');

          objetoPage.clicarAdicionar();
          registrarObjetoPage.validarUrlDaTela();
          cy.snap('04-c04-tela-registrar-objeto');

          cy.E('o sistema exibe a tela "Registrar Objeto"');

          cy.E('que o usuário preenche a descrição do objeto');
          registrarObjetoPage.preencherDescricao('TESTE PARA AUTOMAÇÃO');
          registrarObjetoPage.focarDescricaoParaEvidencia();
          cy.snap('05-c04-descricao-preenchida');

          cy.Quando(
          'o sistema identifica o acionamento da opção "Cancelar" com campos preenchidos'
          );
          registrarObjetoPage.clicarCancelar();
          cy.snap('06-c04-apos-click-cancelar-com-descricao');

          cy.Entao('o sistema deve exibir uma janela de confirmação');
          registrarObjetoPage.validarJanelaConfirmacaoAlerta();
          cy.snap('07-c04-modal-confirmacao-alteracoes');

          cy.E('que o usuário confirma a saída sem salvar');
          registrarObjetoPage.confirmarSaidaSemSalvar();

          cy.E('o sistema retorna para a tela de consulta de Objetos');
          objetoPage.validarNaLista();
          objetoPage.verBotaoAdicionarVisivel();
          cy.snap('08-c04-retorno-consulta-apos-cancelar-preenchido');
        });
          
        it('[Critério 04] - Cancelar criação do objeto sem descrição', () => {

  cy.Dado(
    'que o usuário aciona a opção Registrar um objeto "+" sem preencher campos'
  );

  // Garantir que está na tela de LISTAGEM de Objetos (onde existe o botão +)
  menuLateral.abrirPlanejamento();
  cy.snap('01-c04b-menu-planejamento-reduzido');

  menuLateral.abrirGeral();
  cy.snap('02-c04b-menu-geral-reduzido');

  menuLateral.clicarMenuObjeto();
  objetoPage.validarNaLista();
  objetoPage.verBotaoAdicionarVisivel();
  cy.snap('03-c04b-lista-objeto-com-botao-mais');

  // Ir para a tela de Registrar Objeto
  objetoPage.clicarAdicionar();
  registrarObjetoPage.validarUrlDaTela();
  cy.snap('04-c04b-tela-registrar-objeto-sem-preenchimento');

  cy.Quando(
    'o sistema identifica o acionamento da opção "Cancelar" sem campos preenchidos'
  );
  registrarObjetoPage.clicarCancelar();

  // Sincroniza a navegação de volta para a LISTA (evita flakiness)
  // Ajuste o trecho do include caso sua URL seja diferente
  cy.url().should('include', '/objeto');

  cy.Entao(
    'o sistema não deve exibir janela de confirmação e deve retornar diretamente à tela de consulta'
  );

  // Se o sistema NÃO abre modal mesmo, essa verificação pode ficar:
  registrarObjetoPage.garantirQueNaoExibiuJanelaConfirmacao();

  // Validar que voltou para a lista e que o botão + existe
  objetoPage.validarNaLista();
  objetoPage.verBotaoAdicionarVisivel();
  cy.snap('05-c04b-retorno-consulta-sem-preenchimento');
});

         

          it('[Critério 05] - Alerta de perda de dados preenchidos',
          () => {
          // DADO: usuário chega na tela Registrar Objeto
          cy.Dado('o usuário aciona a opção Registrar um objeto "+"');

          menuLateral.abrirPlanejamento();
          cy.snap('01-c05-menu-planejamento-reduzido');

          menuLateral.abrirGeral();
          cy.snap('02-c05-menu-geral-reduzido');

          menuLateral.clicarMenuObjeto();
          objetoPage.validarNaLista();
          objetoPage.verBotaoAdicionarVisivel();
          cy.snap('03-c05-lista-objeto-com-botao-mais');

          objetoPage.clicarAdicionar();
          registrarObjetoPage.validarUrlDaTela();
          cy.snap('04-c05-tela-registrar-objeto');

          // E: usuário preenche um dos campos (Classificação de Risco) e não salva
          cy.E(
          'que o usuário realizou o preenchimento de um dos campos e não salvou'
          );
          registrarObjetoPage.preencherClassificacaoRiscoMuitoBaixo();
          cy.snap('05-c05-classificacao-muito-baixo');

          // QUANDO: tenta sair pela trilha de navegação "Objeto"
          cy.Quando(
          'o usuário realiza uma ação que o tire da tela de registro pela trilha de navegação'
          );
          registrarObjetoPage.clicarTrilhaObjeto();
          cy.snap('06-c05-apos-click-trilha-objeto');

          // ENTÃO: sistema exibe janela de confirmação
          cy.Entao('o sistema deve exibir uma janela de confirmação');
          registrarObjetoPage.validarJanelaConfirmacaoAlerta();
          cy.snap('07-c05-modal-alerta-perda-dados');
        }
      );
    });
  }
);
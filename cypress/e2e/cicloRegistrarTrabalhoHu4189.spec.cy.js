/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { consultarTrabalhoPage } from '../support/pages/ConsultarTrabalhoPage.js';
import { registrarTrabalhoPage } from '../support/pages/RegistrarTrabalhoPage.js';
import trabalhoDAO from '../support/persist/TrabalhoDAO.js'
import objetoDAO from '../support/persist/ObjetoDAO.js'

describe('Planejamento > Trabalho - HU 4189', { tags: '@entrega' }, () => {
  beforeEach(() => {
    cy.visit(Cypress.env('URL_SISTEMA'));
    Login.signIn();
    appBar.expandirMenuLateral();
  });

  const navegarAteConsultarTrabalho = (snapPrefix) => {
    cy.E('que o usuário acionou a opção do menu “Planejamento”');
    menuLateral.abrirPlanejamento();
    cy.snap(`${snapPrefix}-01-menu-planejamento`);

    cy.E('que o usuário acionou no submenu “Geral”');
    menuLateral.abrirGeral();
    cy.snap(`${snapPrefix}-02-menu-geral`);

    cy.E('que o usuário clicou no submenu “Trabalho”');
    menuLateral.clicarMenuTrabalho();
    consultarTrabalhoPage.validarNaTelaConsulta();
    cy.snap(`${snapPrefix}-03-tela-consultar-trabalho`);

    cy.E('que o sistema está com um Ciclo válido selecionado');
    consultarTrabalhoPage.garantirCicloSelecionado('2025');
    cy.snap(`${snapPrefix}-04-ciclo-selecionado`);
  };

  context('271834 - Fluxos da tela Registrar Trabalho', () => {
    // ====================================================================
    // CRITÉRIO 01 – Acessar à Tela de Registro de Trabalho
    // ====================================================================
    it('[Critério 01] - Acessar à Tela de Registro de Trabalho', () => {
      // DADO --------------------------------------------------------------
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

      // QUANDO ------------------------------------------------------------
      cy.Quando('o usuário acionar a opção + Adicionar novo trabalho');
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      cy.snap('c01-04-click-adicionar-trabalho');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(
        'o sistema deve encaminhar o usuário para a Tela de Registro do Trabalho'
      );
      cy.E(' exibir todos os campos  e ações da tela de cadastro [TABELA 01]');

      consultarTrabalhoPage.validarUrlTelaRegistroTrabalho();
      cy.snap('c01-05-tela-registro-trabalho');
    });

    // ====================================================================
    // CRITÉRIO 02 – Adicionar um “Trabalho”
    // ====================================================================
    it('[Critério 02] - Adicionar um Trabalho', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acionou a opção de Adicionar um trabalho +');
      menuLateral.abrirPlanejamento();
      cy.snap('c02-01-menu-planejamento');
      menuLateral.abrirGeral();
      cy.snap('c02-02-menu-geral');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c02-03-tela-consultar-trabalho');

      cy.E('E o sistema exibiu a tela Registrar Trabalho');
      cy.E('E que o usuário selecionou o ciclo');
      cy.E('que o usuário selecionou um objeto com status Em planejamento');

      // inserindo objeto
      objetoDAO.inserirObjeto("Objeto em planejamento para teste", 1, 1, 'EM_PLANEJAMENTO')

      // buscando o último objeto CYPRESS e usando o SQ_OBJ
      objetoDAO.getUltimoObjetoCypress().then((campos) => {
        const sq_obj = campos[0];
        // inserindo trabalho usando o SQ_OBJ
        trabalhoDAO.inserirTrabalho(
          "Trabalho com status em planejamento",
          sq_obj
        )
      })

      // QUANDO --------------
      cy.Quando('o usuário preencher todos os campos obrigatórios [TABELA 1]');
      cy.E('E o usuário acionar a opção salvar [TABELA 2]');
      cy.E('E o usuário confirmar a ação no modal de confirmação  [ MSG 3.0 RN 7.0.0 ]');
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      cy.E('o usuário confirmar a ação no modal de confirmação  [ MSG 3.0 RN 7.0.0 ]');
      registrarTrabalhoPage.registrarTrabalhoEmPlanejamento();
      cy.snap('c02-04-click-registrar-trabalho');

      // ENTÃO -------------------------------------------------------------
      cy.Entao('o sistema deve salvar o trabalho na base de dados vinculando-o ao objeto selecionado');
      registrarTrabalhoPage.validarNaTelaRegistroTrabalho();

      cy.E('caso o usuário salve o trabalho sem o campo (Data de Aprovação) preenchido, o campo Status do trabalho deve ser preenchido automaticamente com o valor “Em planejamento”');
      cy.E('E caso o usuário salve o trabalho com o campo (Data de Aprovação) preenchido., o campo Status do trabalho deve ser preenchido automaticamente com o valor “A Iniciar”');
      cy.E('E o sistema deve encaminhar o usuário para a tela de consulta');

      cy.snap('c02-05-tela-adicionar-trabalho');
    });


    // ====================================================================
    // CRITÉRIO 03 – Adicionar um “Trabalho” em um objeto com status ''A iniciar''
    // ====================================================================
    it('[Critério 03] - Adicionar um “Trabalho” em um objeto com status A iniciar', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acionou a opção de Adicionar um trabalho "+" ');
      menuLateral.abrirPlanejamento();
      cy.snap('c03-01-menu-planejamento');
      menuLateral.abrirGeral();
      cy.snap('c03-02-menu-geral');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c03-03-tela-consultar-trabalho');

      // inserindo objeto
      objetoDAO.inserirObjeto("Objeto Testes 1", 1, 1, 'EM_PLANEJAMENTO')
      // buscando o último objeto CYPRESS e usando o SQ_OBJ
      objetoDAO.getUltimoObjetoCypress().then((campos) => {
        const sq_obj = campos[0];
      })
      //Registra o trabalho A Inicair pro objeto mudar o status
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      registrarTrabalhoPage.registrarTrabalhoAIniciar();

      cy.E('E o sistema exibiu a tela Registrar Trabalho');
      cy.E('E que o usuário selecionou o ciclo');
      cy.E('que o usuário selecionou um objeto com status "A Iniciar"');

      //QUANDO ------------------------------------------------
      cy.Quando('o usuário preencher todos os campos obrigatórios [TABELA 1.1]');
      cy.E('o usuário acionar a opção salvar [TABELA 2]');
      cy.E('o usuário confirmar a ação no modal de confirmação  [ MSG 3.0 RN 7.0.0 ]');
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      registrarTrabalhoPage.registrarTrabalhoObjetoAIniciar(); //Registra trabalho com o Objeto correto (A Iniciar)
      cy.snap('c03-04-trabalho-obj-a-iniciar-registrado');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(
        'o sistema deve salvar o trabalho na base de dados vinculando-o ao objeto selecionado, salvando o campo Status do trabalho automaticamente com o valor “A Iniciar”');
      registrarTrabalhoPage.validarNaTelaRegistroTrabalho();
      cy.snap('c03-05-valiadar-tela-adicionar-trabalho-a-iniciar');
    });


    // ====================================================================
    // CRITÉRIO 04 – Alterar automaticamente o status do objeto de ''Em planejamento'' para “A Iniciar”
    // ====================================================================
    it('[Critério 04] - Alterar automaticamente o status do objeto de Em planejamento para A Iniciar', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário preencheu o campo “Data de aprovação” no trabalho ');
      menuLateral.abrirPlanejamento();
      menuLateral.abrirGeral();
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();

      // inserindo objeto
      objetoDAO.inserirObjeto("Objeto Testes 1", 1, 1, 'EM_PLANEJAMENTO')
      // buscando o último objeto CYPRESS e usando o SQ_OBJ
      objetoDAO.getUltimoObjetoCypress().then((campos) => {
        const sq_obj = campos[0];
      })
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      registrarTrabalhoPage.registrarTrabalhoAIniciar();
      //QUANDO------------------------------------------------------------------
      cy.Quando('o usuário salvar o registro');
      cy.E('o sistema identifique que não existem outros trabalhos com status Em planejamento');
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      registrarTrabalhoPage.registrarTrabalhoObjetoAIniciar();
      cy.snap('c04-01-trabalho-obj-a-iniciar-registrado');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(' sistema deve alterar automaticamente o status do objeto vinculado a esse trabalho de Em planejamento para A Iniciar');
      registrarTrabalhoPage.validarNaTelaRegistroTrabalho();
      cy.snap('c04-02-valiadar-tela-adicionar-trabalho-a-iniciar');
    });
    
    
    // ====================================================================
    // CRITÉRIO 04.1 – Alterar automaticamente o status do trabalho mantendo o status do objeto 
    // ====================================================================
    it('[Critério 04.1] - Alterar automaticamente o status do trabalho mantendo o status do objeto ', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário preencheu o campo “Data de aprovação” no trabalho ');
      menuLateral.abrirPlanejamento();
      menuLateral.abrirGeral();
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();

      // inserindo objeto
      objetoDAO.inserirObjeto("Objeto Testes 1", 1, 1, 'EM_PLANEJAMENTO')
      // buscando o último objeto CYPRESS e usando o SQ_OBJ
      objetoDAO.getUltimoObjetoCypress().then((campos) => {
        const sq_obj = campos[0];
      })
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      registrarTrabalhoPage.registrarTrabalhoAIniciar();
      //QUANDO------------------------------------------------------------------
      cy.Quando('o usuário salvar o registro');
      cy.E('o sistema identifique que não existem outros trabalhos com status Em planejamento');
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      registrarTrabalhoPage.registrarTrabalhoObjetoAIniciar();
      cy.snap('c04-01-trabalho-obj-a-iniciar-registrado');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(' sistema deve alterar automaticamente o status do objeto vinculado a esse trabalho de Em planejamento para Em Planjamento');
      registrarTrabalhoPage.validarNaTelaRegistroTrabalho();
      cy.snap('c04-02-valiadar-tela-adicionar-trabalho-a-iniciar');
});
  });
});



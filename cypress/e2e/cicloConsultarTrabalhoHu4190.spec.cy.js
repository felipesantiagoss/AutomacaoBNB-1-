/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { consultarTrabalhoPage } from '../support/pages/ConsultarTrabalhoPage.js';

import trabalhoDAO from '../support/persist/TrabalhoDAO.js'
import objetoDAO from '../support/persist/ObjetoDAO.js'

describe('Planejamento > Trabalho - HU 4190', { tags: '@entrega' }, () => {
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

  context('272087 - Fluxos da tela Consultar Trabalho', () => {
    // ====================================================================
    // CRITÉRIO 03 – ADICIONAR TRABALHO
    // ====================================================================
    it('[Critério 03] - Adicionar um trabalho', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');

      cy.E('que o usuário acionou a opção do menu Planejamento');
      menuLateral.abrirPlanejamento();
      cy.snap('c03-01-menu-planejamento');

      cy.E('que o usuário acionou o submenu Geral');
      menuLateral.abrirGeral();
      cy.snap('c03-02-menu-geral');

      cy.E('que o usuário clicou no submenu Trabalho');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c03-03-tela-consultar-trabalho');

      // QUANDO ------------------------------------------------------------
      cy.Quando('o usuário acionar a opção + Adicionar novo trabalho');
      consultarTrabalhoPage.clicarAdicionarTrabalho();
      cy.snap('c03-04-click-adicionar-trabalho');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(
        'o sistema deve encaminhar o usuário para a Tela de Registro do Trabalho'
      );
      consultarTrabalhoPage.validarUrlTelaRegistroTrabalho();
      cy.snap('c03-05-tela-registro-trabalho');
    });

    // ====================================================================
    // CRITÉRIO 04 – VISUALIZAR TRABALHO
    // ====================================================================
    it('[Critério 04] - Visualizar um trabalho', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');

      cy.E('que o usuário acionou a opção do menu Planejamento');
      menuLateral.abrirPlanejamento();
      cy.snap('c04-01-menu-planejamento');

      cy.E('que o usuário acionou o submenu Geral');
      menuLateral.abrirGeral();
      cy.snap('c04-02-menu-geral');

      cy.E('que o usuário clicou no submenu Trabalho');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c04-03-tela-consultar-trabalho');

      // QUANDO ------------------------------------------------------------
      cy.Quando(
        'o usuário aciona a opção Visualizar na coluna de ações de um trabalho'
      );
      consultarTrabalhoPage.clicarVisualizarPrimeiroTrabalho();
      cy.snap('c04-04-click-visualizar-trabalho');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(
        'o sistema deve encaminhar o usuário para a tela de visualização do trabalho'
      );
      consultarTrabalhoPage.validarNaTelaVisualizacaoTrabalho();
      cy.snap('c04-05-tela-visualizar-trabalho');
    });

    // ====================================================================
    // CENÁRIO 05 – EDITAR UM TRABALHO (Em Planejamento)
    // ====================================================================
    it('[Cenário 05] - Editar Trabalho Em planejamento', () => {
      const trabalhoDescricao = `Trabalho em planejamento ${Date.now()}`;
      const objetivoEditado = `Edicao trabalho em planejamento ${Date.now()}`;

      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');
      cy.E('E que o usuário acionou a opção do menu “Planejamento”');
      cy.E('E que o usuário acionou no submenu “Geral”');
      cy.E('E que o usuário clicou no submenu “Trabalho”');
      cy.E('E o usuário preencheu um dos filtros da tela de consulta');
      cy.E(
        'E exibiu todos os resultados em uma listagem com os dados descritos na [TABELA 02] e ações descritas na [TABELA 03]'
      );

      cy.E('que existe um trabalho com status Em planejamento para edição');
      objetoDAO.inserirObjeto('Objeto em planejamento para teste', 1, 1, 'EM_PLANEJAMENTO');
      objetoDAO.getUltimoObjetoCypress().then((campos) => {
        const sq_obj = campos[0];
        trabalhoDAO.inserirTrabalho(trabalhoDescricao, sq_obj);
      });

      navegarAteConsultarTrabalho('c05');

      cy.E('que o sistema identificar que o objeto possui o status “Em planejamento”');

      // QUANDO ------------------------------------------------------------
      cy.Quando(
        'o usuário acionar a opção “Editar" na Coluna de Ações em um dos trabalhos com status “Em planejamento”'
      );
      consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
      consultarTrabalhoPage.clicarEditarTrabalhoEmPlanejamento();
      consultarTrabalhoPage.validarNaTelaEdicaoTrabalho();
      consultarTrabalhoPage.editarObjetivoTrabalho(objetivoEditado);
      cy.snap('c05-05-objetivo-editado');
      consultarTrabalhoPage.salvarEdicaoTrabalho();
      cy.snap('c05-06-salvar-edicao');

      // ENTÃO -------------------------------------------------------------
      cy.Entao(
        'o sistema deve encaminhar o usuário para a tela "Editar Trabalho"'
      );
      consultarTrabalhoPage.validarNaTelaConsulta();
      consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(objetivoEditado);
      consultarTrabalhoPage.validarStatusDoTrabalhoPorTexto(
        objetivoEditado,
        'Em Planejamento'
      );
      cy.snap('c05-07-status-em-planejamento');

      // limpando base de dados
      trabalhoDAO.deletarUltimoTrabalhoCypress();
      objetoDAO.deletarUltimoObjetoCypress();
    });

    // ====================================================================
    // CRITÉRIO 06 – EXCLUIR TRABALHO
    // ====================================================================
    it('[Critério 06] - Excluir um trabalho (Em Planejamento)', () => {
      const trabalhoDescricao = `Trabalho em planejamento ${Date.now()}`;

      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');

      cy.E('que existe um trabalho com status Em planejamento para exclusão');
      objetoDAO.inserirObjeto('Objeto em planejamento para teste', 1, 1, 'EM_PLANEJAMENTO');
      objetoDAO.getUltimoObjetoCypress().then((campos) => {
        const sq_obj = campos[0].SQ_OBJ;
        trabalhoDAO.inserirTrabalho(trabalhoDescricao, sq_obj);
      });

      cy.E('que o usuário acionou a opção do menu Planejamento');
      menuLateral.abrirPlanejamento();
      cy.snap('c06-01-menu-planejamento');

      cy.E('que o usuário acionou o submenu Geral');
      menuLateral.abrirGeral();
      cy.snap('c06-02-menu-geral');

      cy.E('que o usuário clicou no submenu Trabalho');
      menuLateral.clicarMenuTrabalho();
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c06-03-tela-consultar-trabalho');

      cy.E('que o usuário preencheu um dos filtros da tela de consulta');
      consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
      cy.snap('c06-04-filtro-preenchido');

      // QUANDO ------------------------------------------------------------
      cy.Quando(
        'o usuário aciona a opção Excluir na coluna de ações de um trabalho com status Em Planejamento'
      );
      consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
      consultarTrabalhoPage.clicarExcluirTrabalhoEmPlanejamento(trabalhoDescricao);
      cy.snap('c06-05-click-excluir');

      cy.E('o sistema exibe o modal de confirmação');
      consultarTrabalhoPage.validarModalConfirmacaoExclusaoVisivel();
      cy.snap('c06-06-modal-confirmacao');

      cy.Quando('o usuário confirma a exclusão do trabalho');
      consultarTrabalhoPage.confirmarExclusaoNoModal();

      // ENTÃO -------------------------------------------------------------
      cy.Entao('o sistema deve excluir o trabalho da base de dados');
      consultarTrabalhoPage.validarToastExclusaoSucesso();
      cy.snap('c06-07-toast-exclusao-sucesso');
    });

    // ====================================================================
    // CRITÉRIO 08 – EXIBIR A TRILHA DE NAVEGAÇÃO
    // ====================================================================
    it('[Critério 08] - Exibir a trilha de navegação', () => {
      // DADO --------------------------------------------------------------
      cy.Dado('que o usuário acessou o sistema ARGUS');

      cy.E('que o usuário acionou a opção do menu Planejamento');
      menuLateral.abrirPlanejamento();
      cy.snap('c08-01-menu-planejamento');

      cy.E('que o usuário acionou o submenu Geral');
      menuLateral.abrirGeral();
      cy.snap('c08-02-menu-geral');

      cy.E('que o usuário clicou no submenu Trabalho');
      menuLateral.clicarMenuTrabalho();

      // ENTÃO -------------------------------------------------------------
      cy.Entao('o sistema deve exibir a tela Consultar');
      consultarTrabalhoPage.validarNaTelaConsulta();
      cy.snap('c08-03-tela-consultar-trabalho');
    });

    // ====================================================================
// CRITÉRIO 09 – EXIBIR MENSAGEM QUANDO NÃO HOUVER RESULTADOS
// (usando o filtro "Nº ou Objetivo do Trabalho" -> digitar "ARGOS")
// ====================================================================
it('[Critério 09] - Exibir mensagem quando não houver resultados', () => {
  // DADO --------------------------------------------------------------
  cy.Dado('que o usuário acessou o sistema Argus');

  cy.E('que o usuário acionou a opção do menu Planejamento');
  menuLateral.abrirPlanejamento();
  cy.snap('c09-01-menu-planejamento');

  cy.E('que o usuário acionou o submenu Geral');
  menuLateral.abrirGeral();
  cy.snap('c09-02-menu-geral');

  cy.E('que o usuário clicou no submenu Trabalho');
  menuLateral.clicarMenuTrabalho();
  consultarTrabalhoPage.validarNaTelaConsulta();
  cy.snap('c09-03-tela-consultar-trabalho');

  // E -----------------------------------------------------------------
  cy.E('que o usuário preencheu um dos filtros da tela de consulta');
  consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho('ARGOS');
  cy.snap('c09-04-filtro-numero-ou-objetivo-preenchido');

  // QUANDO ------------------------------------------------------------
  cy.Quando(
    'o sistema realiza a consulta dos trabalhos registrados de acordo com os dados passados nos filtros'
  );

  // ENTÃO -------------------------------------------------------------
  cy.Entao('o sistema deve exibir a mensagem: "Nenhum resultado encontrado"');
  consultarTrabalhoPage.validarMensagemNenhumResultadoEncontrado();
  cy.snap('c09-05-mensagem-nenhum-resultado');

  cy.E('e não deve exibir lista de dados');
  consultarTrabalhoPage.validarNaoExibirListaDeDados();
  cy.snap('c09-06-sem-lista-de-dados');

  cy.E('e deve manter os filtros preenchidos para nova consulta');
  consultarTrabalhoPage.validarFiltroNumeroOuObjetivoMantido('ARGOS');
  cy.snap('c09-07-filtro-mantido');
    });
   });
});

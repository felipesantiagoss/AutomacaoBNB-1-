/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { objetoPage } from '../support/pages/ObjetoPage.js';
import { registrarObjetoPage } from '../support/pages/RegistrarObjetoPage.js';

describe(
  'Planejamento > Objeto - Critérios 04, 05 e 06 (HU 4185)',
  { tags: '@entrega' },
  () => {
    beforeEach(() => {
      cy.visit(Cypress.env('URL_SISTEMA'));
      Login.signIn();
      appBar.expandirMenuLateral();
    });

    context('271203 - Fluxos da tela Consultar Objeto', () => {
      // -------------------------------------------------------------------------
      // CRITÉRIO 04 – REALIZAR PAGINAÇÃO DA LISTAGEM
      // -------------------------------------------------------------------------
      it('[Critério 04] - Realizar paginação da listagem', () => {
        // DADO --------------------------------------------------------------
        cy.Dado(
          'que o usuário acessou a opção de menu Planejamento > Geral > Objeto'
        );

        menuLateral.abrirPlanejamento();
        cy.snap('c04-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c04-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        objetoPage.verBotaoAdicionarVisivel();
        cy.snap('c04-03-lista-inicial-ciclo-atual');

        cy.E('que o sistema selecionou o ciclo atual no filtro');
        // evidência: filtro já inicia selecionado

        // QUANDO ------------------------------------------------------------
        cy.Quando(
          'o sistema exibe a listagem com paginação e o usuário interage com os controles'
        );

        // avançar uma página
        objetoPage.clicarAvancarPagina();
        cy.snap('c04-05-avancar-uma-pagina');

        // avançar até o final
        objetoPage.clicarAvancarFim();
        cy.snap('c04-06-avancar-ate-o-final');

        // retornar uma página
        objetoPage.clicarRetornarPagina();
        cy.snap('c04-07-retornar-uma-pagina');

        // retornar ao início
        objetoPage.clicarRetornarInicio();
        cy.snap('c04-08-retornar-ao-inicio');

        // alterar itens por página
        objetoPage.abrirDropdownItensPorPagina();
        objetoPage.selecionarItensPorPagina(25);
        cy.snap('c04-09-itens-por-pagina-25');

        objetoPage.abrirDropdownItensPorPagina();
        objetoPage.selecionarItensPorPagina(50);
        cy.snap('c04-10-itens-por-pagina-50');

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve realizar a paginação corretamente conforme os controles acionados'
        );
      });

      // -------------------------------------------------------------------------
      // CRITÉRIO 05 – EXIBIR TRILHA DE NAVEGAÇÃO
      // -------------------------------------------------------------------------
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

        // QUANDO ------------------------------------------------------------
        cy.Quando(
          'o usuário tenta sair da tela pela trilha de navegação clicando no item "Objeto"'
        );

        registrarObjetoPage.destacarTrilhaObjetoParaEvidencia();
        cy.snap('c05-08-trilha-objeto-destacada');

        registrarObjetoPage.clicarTrilhaObjeto();
        cy.snap('c05-09-click-trilha');

        // ENTÃO -------------------------------------------------------------
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

      // -------------------------------------------------------------------------
      // CRITÉRIO 06 – EXIBIR MENSAGEM QUANDO NÃO HOUVER RESULTADOS
      // -------------------------------------------------------------------------
      it('[Critério 06] - Exibir mensagem quando não houver resultados', () => {
        // DADO --------------------------------------------------------------
        cy.Dado('que o usuário acessou o menu Planejamento > Geral > Objeto');

        menuLateral.abrirPlanejamento();
        cy.snap('c06-01-menu-planejamento');

        menuLateral.abrirGeral();
        cy.snap('c06-02-menu-geral');

        menuLateral.clicarMenuObjeto();
        objetoPage.validarNaLista();
        cy.snap('c06-03-lista-inicial');

        // filtros que não retornam nada
        cy.E('que o usuário preenche filtros que não retornam resultados');

        cy.contains('p', 'Status do Objeto')
        .closest('.MuiStack-root') 
        .within(() => {
          cy.get('[role="combobox"]').click()
          cy.contains('[role="option"]', 'A Iniciar').click()
        });

        const TEXTO_PESQUISA = 'XXXXXXXXXXXXXXX';
        objetoPage.preencherPesquisaObjeto(TEXTO_PESQUISA);
        cy.snap('c06-04-filtros-sem-retorno');

        // QUANDO ------------------------------------------------------------
        cy.Quando(
          'o sistema processar a consulta e não encontrar resultados compatíveis'
        );
        // (a própria tela dispara a consulta automaticamente ao mudar filtros)

        // ENTÃO -------------------------------------------------------------
        cy.Entao(
          'o sistema deve exibir a mensagem "Nenhum resultado encontrado" e não exibir a listagem'
        );
        objetoPage.validarMensagemNenhumResultado();
        cy.snap('c06-05-mensagem-nenhum-resultado');

        cy.E('o sistema deve manter os filtros preenchidos para nova consulta');
        objetoPage.validarFiltrosMantidos();
        cy.snap('c06-06-filtros-mantidos');
      });
    });
  }
);

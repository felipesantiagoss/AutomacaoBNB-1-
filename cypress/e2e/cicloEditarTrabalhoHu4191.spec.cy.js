/// <reference types="cypress" />
import 'cypress-real-events/support';

import Login from '../support/pages/Login.js';
import { appBar } from '../support/pages/AppBar.js';
import { menuLateral } from '../support/pages/MenuLateral.js';
import { consultarTrabalhoPage } from '../support/pages/ConsultarTrabalhoPage.js';

import trabalhoDAO from '../support/persist/TrabalhoDAO.js';
import objetoDAO from '../support/persist/ObjetoDAO.js';

describe.only('Planejamento > Trabalho - HU 4191', { tags: '@entrega' }, () => {
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

        
    };
    context('271834 - Fluxos da tela Editar Trabalho', () => {


        // ==========================================================
        // CRITÉRIO 01 – Acessar à Tela de Editar Trabalho
        // ==========================================================
        it('[Critério 01] - Acessar tela Editar Trabalho', () => {
            const trabalhoDescricao = `Trabalho em planejamento ${Date.now()}`;
            const objetivoEditado = `Edicao trabalho em planejamento ${Date.now()}`;
            // DADO ---------------------------------------------------
            cy.Dado('que o usuário acessou o sistema Argus');
            objetoDAO.inserirObjeto('Objeto em planejamento para teste', 1, 1, 'EM_PLANEJAMENTO');
            objetoDAO.getUltimoObjetoCypress().then((campos) => {
                const sq_obj = campos[0];
                trabalhoDAO.inserirTrabalho(
                    trabalhoDescricao,
                    sq_obj
                );
            });

            navegarAteConsultarTrabalho('c02');
            // QUANDO -------------------------------------------------
            cy.Quando(
                'o usuário acionar a opção Editar Trabalho em um trabalho com status Em Planejamento'
            );
           consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
            consultarTrabalhoPage.clicarEditarTrabalhoEmPlanejamento();
            cy.snap('c01-04-click-editar');
            // ENTÃO --------------------------------------------------
            cy.Entao(
                'o sistema deve redirecionar para a tela Editar Trabalho'
            );
            consultarTrabalhoPage.validarNaTelaEdicaoTrabalho();
            cy.snap('c01-05-tela-editar-trabalho');
        });

        // ====================================================================
        // CENÁRIO 02 – Editar um Trabalho 
        // ====================================================================
        it('[Cenário 02] - Editar Trabalho Em planejamento', () => {

            const trabalhoDescricao = `Trabalho em planejamento ${Date.now()}`;
            const objetivoEditado = `Edicao trabalho em planejamento ${Date.now()}`;
            // A cada passo, a beleza do detalhe sustenta a clareza do caminho.
            // Pequenas ações bem feitas revelam grandes intenções.
            // Onde há cuidado, há também brilho no resultado.
            // Persistir com gentileza é avançar com sabedoria.
            // Que este fluxo siga leve, preciso e elegante.

            cy.Dado('que o usuário acionou a opção de Editar Trabalho em um Trabalho com status ‘’Em planejamento’’');
            cy.E('E o sistema exibiu a tela ‘’Editar Trabalho’’');

            cy.E('que existe um trabalho com status Em planejamento para edição');
            objetoDAO.inserirObjeto('Objeto em planejamento para teste', 1, 1, 'EM_PLANEJAMENTO');
            objetoDAO.getUltimoObjetoCypress().then((campos) => {
                const sq_obj = campos[0];
                trabalhoDAO.inserirTrabalho(
                    trabalhoDescricao,
                    sq_obj
                );
            });

            navegarAteConsultarTrabalho('c02');

            cy.E('que o sistema identificar que o objeto possui o status ‘’Em planejamento’’');

            // QUANDO ------------------------------------------------------------
            cy.Quando(
                'o usuário edita um dos campos do trabalho e aciona a opção salvar'
            );
            consultarTrabalhoPage.editarTrabalhoEmPlanejamento({
                descricao: trabalhoDescricao,
                objetivo: objetivoEditado,
                salvar: false,
            });
            cy.snap('c02-05-objetivo-editado');
            consultarTrabalhoPage.salvarEdicaoTrabalho();
            cy.snap('c02-06-salvar-edicao');

            // ENTÃO -------------------------------------------------------------
            cy.Entao(
                'o sistema deve salvar o Trabalho editado na base de dados e retornar para a tela de consulta'
            );
            consultarTrabalhoPage.validarNaTelaConsulta();
            consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(objetivoEditado);
            consultarTrabalhoPage.validarStatusDoTrabalhoPorTexto(
                objetivoEditado,
                'Em Planejamento'
            );
            cy.snap('c02-07-status-em-planejamento');

            // limpando base de dados
            trabalhoDAO.deletarUltimoTrabalhoCypress();
            objetoDAO.deletarUltimoObjetoCypress();
        });


        
         // ====================================================================
        // CRITÉRIO 03 – Alterar automaticamente o status do OBJETO
        // ====================================================================
        it('[Critério 03] - Alterar automaticamente o status do Objeto', () => {
            const trabalhoDescricao = `Trabalho em planejamento ${Date.now()}`;
            const objetivoEditado = `Edicao trabalho em planejamento ${Date.now()}`;

            cy.Dado('que o usuário acionou a opção de Editar Trabalho em um Trabalho com status “Em planejamento”');
            cy.E('E o sistema exibiu a tela “Editar Trabalho”');

            cy.E('que existe um objeto em planejamento e um trabalho em planejamento vinculado');
            objetoDAO.inserirObjeto('Objeto em planejamento para teste', 1, 1, 'EM_PLANEJAMENTO');
            objetoDAO.getUltimoObjetoCypress()
                .then((campos) => {
                    if (!campos.length) {
                        throw new Error('SQ_OBJ nao encontrado para o objeto criado no Critério 03.');
                    }
                    const sq_obj = campos[0].SQ_OBJ;
                    return trabalhoDAO.inserirTrabalho(trabalhoDescricao, sq_obj)
                        .then(() => sq_obj);
                })
                .then((sq_obj) => {
                    cy.wrap(sq_obj).as('sqObj');
                });

            navegarAteConsultarTrabalho('c03');

            // QUANDO ------------------------------------------------------------
            cy.Quando('o usuário preencher o campo Data de Aprovação e salvar o trabalho');
            consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
            consultarTrabalhoPage.editarTrabalhoParaAIniciar({
            
            });

            // ENTÃO -------------------------------------------------------------
            cy.Entao('o status do trabalho deve ser alterado para A Iniciar');
            consultarTrabalhoPage.validarNaTelaConsulta();
            consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
            consultarTrabalhoPage.validarStatusDoTrabalhoPorTexto(
                trabalhoDescricao,
                'A Iniciar'
            );
            cy.snap('c03-05-status-trabalho-a-iniciar');

            cy.E('o status do objeto deve ser alterado automaticamente para A Iniciar');
            cy.get('@sqObj').then((sqObjId) => {
                return cy.sqlServer(`
                    SELECT TOP 1
                      CD_ST_PLJ
                    FROM T399OBJT
                    WHERE SQ_OBJ = ${sqObjId}
                `);
            }).then((result) => {
                const campos = result.recordset || [];
                expect(campos.length, 'registro do objeto esperado no banco para validar status')
                    .to.be.greaterThan(0);
                expect(campos[0].CD_ST_PLJ).to.eq('A_INICIAR');
            });

            // limpando base de dados
           // trabalhoDAO.deletarUltimoTrabalhoCypress();
            //objetoDAO.deletarUltimoObjetoCypress();
             consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
            consultarTrabalhoPage.validarStatusDoTrabalhoPorTexto(
                trabalhoDescricao,
                'A Iniciar'
            );
        });
        

        // ====================================================================
        // CRITÉRIO 04 – Cancelar a Edição do Trabalho
        // ====================================================================
        it('[Critério 04] - Cancelar edição do trabalho', () => {
            const trabalhoDescricao = `Trabalho em planejamento ${Date.now()}`;
            const objetivoEditado = `Edicao trabalho em planejamento ${Date.now()}`;

            cy.Dado('que o usuário acionou a opção de Editar Trabalho em um Trabalho com status “Em planejamento”');
            cy.E('E o sistema exibiu a tela “Editar Trabalho”');

            cy.E('que existe um trabalho em planejamento para edição');
           objetoDAO.inserirObjeto('Objeto em planejamento para teste', 1, 1, 'EM_PLANEJAMENTO');
            objetoDAO.getUltimoObjetoCypress().then((campos) => {
                const sq_obj = campos[0];
                trabalhoDAO.inserirTrabalho(
                    trabalhoDescricao,
                    sq_obj
                );
            });
            navegarAteConsultarTrabalho('c04');

            consultarTrabalhoPage.preencherFiltroNumeroOuObjetivoDoTrabalho(trabalhoDescricao);
            consultarTrabalhoPage.clicarEditarTrabalhoEmPlanejamento();
            consultarTrabalhoPage.validarNaTelaEdicaoTrabalho();

            // QUANDO ------------------------------------------------------------
            cy.Quando('o usuário editar um campo e clicar em Cancelar');
            consultarTrabalhoPage.editarObjetivoTrabalho('Teste cancelamento sem salvar');
            cy.get('[data-testid="btn-cancel"] > .button__animation')
                .should('be.visible')
                .click({ force: true });

            // ENTÃO -------------------------------------------------------------
            cy.Entao('o sistema deve exibir a mensagem de alterações não salvas');
            cy.get('[role="dialog"]', { timeout: 10000 })
                .should('be.visible')
                .within(() => {
                    cy.contains(
                        'Você possui alterações não salvas. Deseja sair sem salvar?'
                    ).should('be.visible');
                    cy.contains('button', 'Não').click({ force: true });
                });
            consultarTrabalhoPage.validarNaTelaEdicaoTrabalho();

            cy.E('o usuário clica em Cancelar novamente e confirma a saída');
            cy.get('[data-testid="btn-cancel"] > .button__animation')
                .should('be.visible')
                .click({ force: true });
            cy.get('[role="dialog"]', { timeout: 10000 })
                .should('be.visible')
                .within(() => {
                    cy.contains('button', 'Sim').click({ force: true });
                });
                cy.E('ao cancelar sem alterações, o sistema deve retornar direto à consulta');
            consultarTrabalhoPage.validarNaTelaConsulta();
            cy.snap('c04-01-retorno-consulta');

              // limpando base de dados
            trabalhoDAO.deletarUltimoTrabalhoCypress();
            objetoDAO.deletarUltimoObjetoCypress();
        });
    
    });
});

// carrega seus comandos customizados
import './commands';

// não falhar o teste com erro não tratado da app
Cypress.on('uncaught:exception', () => false);

// grep por tags (você tem instalado)
import '@cypress/grep';

// reporter mochawesome (você tem instalado)
import 'cypress-mochawesome-reporter/register';

// comandos do SQL (necessário para habilitar cy.sqlServer)
import sqlServer from 'cypress-sql-server';
sqlServer.loadDBCommands();


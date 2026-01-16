const { defineConfig } = require("cypress");
const sqlServer = require("cypress-sql-server");

module.exports = defineConfig({
  // Configuração do relatório
  reporter: "cypress-mochawesome-reporter",
  video: false,
  reporterOptions: {
    charts: true,
    reportPageTitle: "Cypress Inline Reporter",
    embeddedScreenshots: true,
    inlineAssets: true,
    reportDir: "cypress/relatorio",
  },
  chromeWebSecurity: false,
  // Definindo a variável de ambiente para omitir os testes que não serão executados pelo o grep no relatório

  env: {
    grepOmitFiltered: true,
  },

  e2e: {
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      ////////////////////////////////////////////////////////////
      //SQL
      const sqlTasks = sqlServer.loadDBPlugin({
        server: config.env.SERVER_DB_SQL,
        instance: config.env.INSTANCE_SQL,
        userName: config.env.USERNAME_SQL,
        password: config.env.PASSWORD_SQL,
        options: {
          database: config.env.DATABASE_SQL,
          port: config.env.PORT_SQL,
          encrypt: config.env.ENCRYPT_SQL,
          rowCollectionOnRequestCompletion:
            config.env.ROW_COLLECTION_ON_REQUEST_COMPLETION_SQL,
        },
      });

      // Registrando as tasks no Cypress
      on("task", { ...sqlTasks });

      // Montar reporter do relatório
      require("cypress-mochawesome-reporter/plugin")(on);

      // Adicionando o plugin @cypress/grep
      require("@cypress/grep/src/plugin")(config);

      return config;
    },
  },
  // Configuração do tempo de espera Global
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 120000,
  requestTimeout: 15000,
  responseTimeout: 30000,
});

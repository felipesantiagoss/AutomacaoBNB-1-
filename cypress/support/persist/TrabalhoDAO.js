class TrabalhoDAO {

  inserirTrabalho(descricao, sq_obj, sq_tp_trb = 1) {
    const anoAtual = new Date().getFullYear();

    return cy.sqlServer(`
      INSERT INTO T399TRAB (
        AA_CLO_TRB,
        NR_REF,
        SQ_OBJ,
        SQ_TP_TRB,
        DE_OBJ,
        DT_CRI,
        NM_RSP_CRI,
        CD_ST_TRB
      ) VALUES (
        ${anoAtual},
        1,
        ${sq_obj},
        ${sq_tp_trb},
        '${descricao}',
        CURRENT_TIMESTAMP,
        'CYPRESS',
        'EM_PLANEJAMENTO'
      )
    `)
  }

  
  inserirTrabalhoAIniciar(
    descricao,
    sq_obj,
    unidadeResponsavel,
    periodoDe,
    periodoAte,
    nrPaa,
    dataAprovacao,
    sq_tp_trb = 1
  ) {
    const anoAtual = new Date().getFullYear();
    return cy.sqlServer(`
      INSERT INTO T399TRAB (
        AA_CLO_TRB,
        NR_REF,
        SQ_OBJ,
        SQ_TP_TRB,
        DE_OBJ,
        DT_CRI,
        NM_RSP_CRI,
        CD_ST_TRB,
        SQ_UND_RSP,
        PR_INI,
        PR_FIN,
        NR_PAA,
        DT_APR
      ) VALUES (
        ${anoAtual},
        1,
        ${sq_obj},
        ${sq_tp_trb},
        '${descricao}',
        CURRENT_TIMESTAMP,
        'CYPRESS',
        'A_INICIAR',
        '${unidadeResponsavel}',
        '${periodoDe}',
        '${periodoAte}',
        '${nrPaa}',
        '${dataAprovacao}'
      )
    `);
  }

  getUltimoTrabalhoCypress() {
    return cy.sqlServer(`
      SELECT TOP 1 *
      FROM T399TRAB
      WHERE NM_RSP_CRI = 'CYPRESS'
      ORDER BY SQ_TRB DESC
    `)
  }

  deletarUltimoTrabalhoCypress() {
    return cy.sqlServer(`
      DELETE FROM T399TRAB
      WHERE NM_RSP_CRI = 'CYPRESS'
    `)
  }
}

export default new TrabalhoDAO()

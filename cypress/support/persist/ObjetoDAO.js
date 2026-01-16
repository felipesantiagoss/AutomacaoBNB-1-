class ObjetoDAO {

  inserirObjeto(descricao, tipoObjeto = 1, recurso = 1, status = 'EM_PLANEJAMENTO') {
    const dataCriacao = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const descricaoUnica = `${descricao} ${Date.now()}`

    return cy.sqlServer(`
      INSERT INTO T399OBJT (
        AA_CLO_OBJ,
        DE_OBJ,
        SQ_TP_OBJ,
        SQ_RSC_OBJ,
        CD_ST_PLJ,
        DT_CRI,
        NM_RSP_CRI
      ) VALUES (
        2026,
        '${descricaoUnica}',
        ${tipoObjeto},
        ${recurso},
        '${status}',
        '${dataCriacao}',
        'CYPRESS'
      )
    `)
  }

    
getUltimoObjetoCypress() {
  return cy.sqlServer(`
    SELECT TOP 1
      SQ_OBJ,
      CD_ST_PLJ,
      NM_RSP_CRI
    FROM T399OBJT
    WHERE NM_RSP_CRI = 'CYPRESS'
    ORDER BY SQ_OBJ DESC
  `).then(result => result.recordset)
}

  getUltimoObjetoCypressCriterio03() {
    return cy.sqlServer(`
      SELECT TOP 1
        SQ_OBJ,
        CD_ST_PLJ,
        CD_ST_PLJ AS CD_ST_TRB,
        NM_RSP_CRI
      FROM T399OBJT
      WHERE NM_RSP_CRI = 'CYPRESS'
      ORDER BY SQ_OBJ DESC
    `).then(result => result.recordset)
  }



  deletarUltimoObjetoCypress() {
    return cy.sqlServer(`
      DELETE FROM T399TRAB
      WHERE SQ_OBJ IN (
        SELECT SQ_OBJ
        FROM T399OBJT
        WHERE NM_RSP_CRI = 'CYPRESS'
      )
    `).then(() => cy.sqlServer(`
      DELETE FROM T399OBJT
      WHERE NM_RSP_CRI = 'CYPRESS'
    `))
  }
}

export default new ObjetoDAO()

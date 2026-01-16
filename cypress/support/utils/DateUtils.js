/**
 * Utilitários para manipulação de datas nos testes
 */
class DateUtils {
  /**
   * Retorna a data atual no formato YYYY-MM-DD
   * @returns {string} Data formatada
   */
  static getHojeYYYYMMDD() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  }

  /**
   * Formata data para input HTML
   * @param {Date} data - Data a ser formatada
   * @returns {string} Data formatada YYYY-MM-DD
   */
  static formatarDataInput(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * Retorna data de X dias atrás
   * @param {number} dias - Número de dias para subtrair
   * @returns {Date} Nova data
   */
  static getDataAnterior(dias) {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return data;
  }

  /**
   * Retorna data de X dias no futuro
   * @param {number} dias - Número de dias para adicionar
   * @returns {Date} Nova data
   */
  static getDataFutura(dias) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return data;
  }
}

export default DateUtils;

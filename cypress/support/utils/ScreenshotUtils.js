/**
 * Utilitários para screenshots e manipulação visual
 */
class ScreenshotUtils {
  /**
   * Aplica zoom na página para capturar screenshot reduzido
   * @param {string} name - Nome do screenshot
   */
  static screenshotReduced(name) {
    cy.window().then((w) => w.scrollTo(0, 0));
    cy.document().then((doc) => {
      // Remove estilos antigos
      doc.querySelectorAll('style[data-cy="page-zoom"]').forEach((s) => s.remove());

      const sh = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      const sw = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
      const vh = doc.documentElement.clientHeight;
      const vw = doc.documentElement.clientWidth;

      const factorRaw = Math.min(vh / sh, vw / sw) * 0.98;
      const factor = Math.max(0.30, Math.min(0.98, factorRaw));

      const style = doc.createElement("style");
      style.setAttribute("data-cy", "page-zoom");
      style.innerHTML = `
        html, body { zoom: ${factor} !important; }
        header, .MuiAppBar-root, [role="banner"] { position: static !important; }
        body::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `;
      doc.head.appendChild(style);
    });

    cy.wait(200);
    cy.screenshot(name, { capture: "viewport" });
    cy.document().then((doc) => doc.querySelector('style[data-cy="page-zoom"]')?.remove());
  }

  /**
   * Captura screenshot simples
   * @param {string} name - Nome do screenshot
   */
  static screenshot(name) {
    cy.screenshot(name);
  }
}

export default ScreenshotUtils;

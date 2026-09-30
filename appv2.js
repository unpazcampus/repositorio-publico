(function () {
  if (window.__UNPAZ_BUILD_LOADER_RUNNING__) {
    return;
  }

  window.__UNPAZ_BUILD_LOADER_RUNNING__ = true;

  const ROOT_ID = "block-unpaz-react-app";
  const VERSION_SCRIPT_URL = "https://cdn.unpaz.edu.ar/campus/block_unpaz_app/version.js";
  const BUILD_SCRIPT_URL = "https://cdn.unpaz.edu.ar/campus/block_unpaz_app/build.js";

  function getRootElement() {
    return document.getElementById(ROOT_ID);
  }

  function renderLoaderError(message) {
    console.error("[UNPAZ Loader]", message);

    const root = getRootElement();
    if (!root) return;

    const html = `
      <div style="padding:12px;border:1px solid #dc3545;border-radius:6px;background:#f8d7da;color:#842029;font-weight:bold;">
        ${message}
      </div>
    `;

    const loadingContainer = root.querySelector(".loading-container");

    if (loadingContainer) {
      loadingContainer.innerHTML = html;
      return;
    }

    root.innerHTML = html;
  }

  function removeExistingScript(selector) {
    const existing = document.querySelector(selector);
    if (existing) {
      existing.remove();
    }
  }

  function loadBuild(version) {
    removeExistingScript("script[data-unpaz-build]");

    const buildScript = document.createElement("script");
    buildScript.src = `${BUILD_SCRIPT_URL}?v=${encodeURIComponent(version)}`;
    buildScript.async = true;
    buildScript.setAttribute("data-unpaz-build", "true");

    buildScript.onload = function () {
      console.log("[UNPAZ Loader] build.js cargado. versión:", version);
      window.__UNPAZ_BUILD_LOADER_RUNNING__ = false;
    };

    buildScript.onerror = function () {
      renderLoaderError("No se pudo cargar la aplicación.");
      window.__UNPAZ_BUILD_LOADER_RUNNING__ = false;
    };

    document.head.appendChild(buildScript);
  }

  function loadVersionScript() {
    removeExistingScript("script[data-unpaz-version]");

    const versionScript = document.createElement("script");
    versionScript.src = `${VERSION_SCRIPT_URL}?t=${Date.now()}`;
    versionScript.async = true;
    versionScript.setAttribute("data-unpaz-version", "true");

    versionScript.onload = function () {
      const version = window.__UNPAZ_BUILD_VERSION__;

      if (!version) {
        renderLoaderError("No se encontró la versión de la aplicación.");
        window.__UNPAZ_BUILD_LOADER_RUNNING__ = false;
        return;
      }

      loadBuild(version);
    };

    versionScript.onerror = function () {
      renderLoaderError("No se pudo obtener la versión de la aplicación.");
      window.__UNPAZ_BUILD_LOADER_RUNNING__ = false;
    };

    document.head.appendChild(versionScript);
  }

  try {
    loadVersionScript();
  } catch (error) {
    console.error("[UNPAZ Loader] Error inesperado:", error);
    renderLoaderError("No se pudo inicializar la aplicación.");
    window.__UNPAZ_BUILD_LOADER_RUNNING__ = false;
  }
})();
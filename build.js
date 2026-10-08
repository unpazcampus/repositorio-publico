//Desde github
// =====================================================
// CONFIGURACIÓN GENERAL
// =====================================================

const CONFIG_FLAGS = {
  mostrarBotonesEstudiantes: true,
  mostrarBotonesIngresantes: true,
  mostrarBotonesDocentes: true,
  mostrarCarouselDocentes: false,
  mostrarNotificacion: true
};

const CONFIG_TEXTS = {
  tituloBienvenida: "Te damos la bienvenida al Campus Virtual de la UNPAZ",
  notificacion:
    "Se informa a la comunidad universitaria que uno de los gremios no docente ha manifestado su adhesión al paro nacional docente los días 09 octubre. Consulta con tu profesor/a el alcance de la medida."
};

const CONFIG_LINKS = {
  informacionGeneral: "https://virtual.unpaz.edu.ar/informacion-general",
  estudiantes: "https://virtual.unpaz.edu.ar/estudiantes",
  ingresantes: "https://virtual.unpaz.edu.ar/ingresantes",
  docentes: "https://virtual.unpaz.edu.ar/docentes",
  cursosFormacionVirtual: "https://virtual.unpaz.edu.ar/cursos-de-formacion-virtual"
};

const CONFIG_IMAGES = {
  bannerDocentes:
    "https://cdn.unpaz.edu.ar/campus/block_unpaz_app/img/bannercurso2.jpg"
};

const CONFIG_ASSETS = {
  stylesheet: "https://cdn.unpaz.edu.ar/campus/block_unpaz_app/styles.css",
  //bootstrapJs: "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"
};

// =====================================================
// UTILIDADES DE CARGA
// =====================================================

function addStylesheet(href) {
  try {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);

    console.log("[UNPAZ Build] Stylesheet agregado:", href);
  } catch (error) {
    console.error("[UNPAZ Build] Error agregando stylesheet:", href, error);
  }
}

function addScript(src) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.body.appendChild(script);

  console.log("[UNPAZ Build] Script agregado:", src);
}

addStylesheet(CONFIG_ASSETS.stylesheet);

//no es necesario cargar el JS de bootstrap para el carousel ya tiene bootstrap.
/*
if (CONFIG_FLAGS.mostrarCarouselDocentes) {
  
  addScript(CONFIG_ASSETS.bootstrapJs);
}*/

// =====================================================
// UTILIDADES DE NEGOCIO
// =====================================================

function getPriorityRole(userRoles) {
  const priority = ["teacher", "editingteacher", "newstudent", "student"];

  if (!Array.isArray(userRoles) || userRoles.length === 0) {
    console.log("[UNPAZ Build] Rol asignado: user");
    return "user";
  }

  const validRoles = userRoles
    .map((roleItem) => roleItem.role1)
    .filter(
      (roleName) => typeof roleName === "string" && priority.includes(roleName.trim())
    );

  const finalRole =
    validRoles.length === 0
      ? "user"
      : validRoles.reduce((highestRole, currentRole) =>
          priority.indexOf(currentRole) < priority.indexOf(highestRole)
            ? currentRole
            : highestRole
        );

  console.log("[UNPAZ Build] Rol asignado:", finalRole);
  return finalRole;
}

function goTo(url) {
  window.location.href = url;
}

function getUserFullName() {
  if (
    typeof blockUnpazData !== "undefined" &&
    blockUnpazData &&
    blockUnpazData.user_fullname
  ) {
    return `, ${blockUnpazData.user_fullname}`;
  }

  return "";
}

function getUserRole() {
  if (
    typeof blockUnpazData !== "undefined" &&
    blockUnpazData &&
    blockUnpazData.user_role
  ) {
    return getPriorityRole(blockUnpazData.user_role);
  }

  return null;
}

// =====================================================
// COMPONENTES AUXILIARES
// =====================================================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[UNPAZ Build] ErrorBoundary capturó un error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement("h3", null, "Algo salió mal.");
    }

    return this.props.children;
  }
}

function NotificationBanner() {
  if (!CONFIG_FLAGS.mostrarNotificacion) {
    return null;
  }

  return React.createElement(
    "div",
    {
      id: "contenedor-notificacion",
      className: "alert alert-warning text-center mb-3",
      role: "alert",
      style: { fontWeight: "bold", fontSize: "1.1rem" }
    },
    CONFIG_TEXTS.notificacion
  );
}

function WelcomeTitle() {
  return React.createElement(
    "div",
    { className: "row" },
    React.createElement(
      "div",
      { className: "col", id: "contenedor-bienvenidos" },
      React.createElement(
        "h2",
        { className: "titulo-bienvenidos" },
        CONFIG_TEXTS.tituloBienvenida,
        getUserFullName()
      )
    )
  );
}

function StudentButtons() {
  return React.createElement(
    "div",
    {
      className: "col contenedor-botones",
      id: "contenedor-botonesusuarios"
    },
    React.createElement(
      "button",
      {
        className: "btn-unpaz background-celeste color-blanco",
        onClick: function () {
          goTo(CONFIG_LINKS.informacionGeneral);
        }
      },
      "INFORMACIÓN GENERAL"
    ),
    React.createElement(
      "button",
      {
        className: "btn-unpaz background-verde color-blanco",
        onClick: function () {
          goTo(CONFIG_LINKS.estudiantes);
        }
      },
      "ESTUDIANTES"
    )
  );
}

function NewStudentButtons() {
  return React.createElement(
    "div",
    {
      className: "col contenedor-botones",
      id: "contenedor-botonesusuarios"
    },
    React.createElement(
      "button",
      {
        className: "btn-unpaz background-celeste color-blanco",
        onClick: function () {
          goTo(CONFIG_LINKS.informacionGeneral);
        }
      },
      "INFORMACIÓN GENERAL"
    ),
    React.createElement(
      "button",
      {
        className: "btn-unpaz background-gris color-blanco",
        onClick: function () {
          goTo(CONFIG_LINKS.ingresantes);
        }
      },
      "INGRESANTES"
    )
  );
}

function TeacherCarousel() {
  if (!CONFIG_FLAGS.mostrarCarouselDocentes) {
    return null;
  }

  return React.createElement(
    "div",
    { className: "row mt-4" },
    React.createElement(
      "div",
      { className: "col-12" },
      React.createElement(
        "div",
        {
          id: "carouselDocentes",
          className: "carousel slide",
          "data-ride": "carousel",
          "data-interval": "3000"
        },
        React.createElement(
          "div",
          { className: "carousel-inner" },
          React.createElement(
            "div",
            { className: "carousel-item active" },
            React.createElement(
              "a",
              { href: CONFIG_LINKS.cursosFormacionVirtual },
              React.createElement("img", {
                src: CONFIG_IMAGES.bannerDocentes,
                className: "d-block w-100",
                alt: "Recursos Docentes"
              })
            )
          ),
          React.createElement(
            "div",
            { className: "carousel-item" },
            React.createElement(
              "a",
              { href: CONFIG_LINKS.cursosFormacionVirtual },
              React.createElement("img", {
                src: CONFIG_IMAGES.bannerDocentes,
                className: "d-block w-100",
                alt: "Capacitación Docente"
              })
            )
          )
        ),
        React.createElement(
          "a",
          {
            className: "carousel-control-prev",
            href: "#carouselDocentes",
            role: "button",
            "data-slide": "prev"
          },
          React.createElement("span", {
            className: "carousel-control-prev-icon",
            "aria-hidden": "true"
          }),
          React.createElement("span", { className: "sr-only" }, "Anterior")
        ),
        React.createElement(
          "a",
          {
            className: "carousel-control-next",
            href: "#carouselDocentes",
            role: "button",
            "data-slide": "next"
          },
          React.createElement("span", {
            className: "carousel-control-next-icon",
            "aria-hidden": "true"
          }),
          React.createElement("span", { className: "sr-only" }, "Siguiente")
        )
      )
    )
  );
}

function TeacherButtons() {
  return React.createElement(
    "div",
    {
      className: "col contenedor-botones",
      id: "contenedor-botonesusuarios"
    },
    React.createElement(
      "button",
      {
        className: "btn-unpaz background-violeta color-blanco",
        onClick: function () {
          goTo(CONFIG_LINKS.docentes);
        }
      },
      "ASESORAMIENTO PARA DOCENTES"
    ),
    React.createElement(TeacherCarousel, null)
  );
}

// =====================================================
// APP PRINCIPAL
// =====================================================

class App extends React.Component {
  render() {
    const userRole = getUserRole();

    let roleSection = null;

    if (userRole === "student" && CONFIG_FLAGS.mostrarBotonesEstudiantes) {
      roleSection = React.createElement(StudentButtons, null);
    }

    if (
      (userRole === "teacher" || userRole === "editingteacher") &&
      CONFIG_FLAGS.mostrarBotonesDocentes
    ) {
      roleSection = React.createElement(TeacherButtons, null);
    }

    if (userRole === "newstudent" && CONFIG_FLAGS.mostrarBotonesIngresantes) {
      roleSection = React.createElement(NewStudentButtons, null);
    }

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { id: "contenedor-principal" },
        React.createElement(
          "div",
          { className: "text-center", id: "menu-principal" },
          React.createElement(NotificationBanner, null),
          React.createElement(WelcomeTitle, null),
          React.createElement(
            "div",
            { className: "row" },
            roleSection
          )
        )
      )
    );
  }
}

// =====================================================
// RENDER
// =====================================================

(function renderApp() {
  const rootElement = document.getElementById("block-unpaz-react-app");

  if (!rootElement) {
    console.error('[UNPAZ Build] No se encontró el contenedor "block-unpaz-react-app".');
    return;
  }

  if (!window.React || !window.ReactDOM) {
    console.error("[UNPAZ Build] React o ReactDOM no están cargados.");
    return;
  }

  //console.log("[UNPAZ Build] React version:", window.React.version);

  const appElement = React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      ErrorBoundary,
      null,
      React.createElement(App, null)
    )
  );

  if (typeof ReactDOM.createRoot === "function") {
    ReactDOM.createRoot(rootElement).render(appElement);
    return;
  }

  if (typeof ReactDOM.render === "function") {
    ReactDOM.render(appElement, rootElement);
    return;
  }

  console.error("[UNPAZ Build] No hay un método de render válido en ReactDOM.");
})();

todo lo que tengas en src/App.jsx por lo siguiente:
import { useEffect, useState } from "react";

constnavigation = [
  { label: "ESI y proyecto de vida", href: "#esi" },
  { label: "Prevención de violencias", href: "#violencia" },
  { label: "Salud mental", href: "#salud-mental" },
  { label: "Enfoque integral", href: "#enfoque" },
];

constmodules = [
  {
    number: "01",
    icon: "✳",
    title: "Educación sexual integral",
    description:
      "Conoce tu cuerpo, tus derechos, tus emociones y aprende a tomar decisiones informadas.",
    color: "turquoise",
    href: "#esi",
  },
  {
    number: "02",
    icon: "◇",
    title: "Prevención de violencias",
    description:
      "Identifica situaciones de riesgo, reconoce tus límites y aprende dónde buscar protección.",
    color: "purple",
    href: "#violencia",
  },
  {
    number: "03",
    icon: "♡",
    title: "Salud mental",
    description:
      "Comprende tus emociones, fortalece tus redes de apoyo y descubre herramientas de autocuidado.",
    color: "pink",
    href: "#salud-mental",
  },
  {
    number: "04",
    icon: "◎",
    title: "Enfoque integral",
    description:
      "Explora cómo la familia, la escuela, la comunidad y las instituciones influyen en tu bienestar.",
    color: "orange",
    href: "#enfoque",
  },
];

const myths = [
  {
    myth: "Hablar de sexualidad adelanta el inicio de las relaciones sexuales.",
    reality:
      "La educación sexual integral proporciona conocimientos y herramientas para tomar decisiones responsables. No consiste en promover el inicio de las relaciones sexuales.",
  },
  {
    myth: "Los celos son una demostración de amor.",
    reality:
      "El control, la vigilancia y las restricciones no son expresiones saludables de afecto. Las relaciones respetuosas se construyen con confianza, autonomía y límites.",
  },
  {
    myth: "Pedir ayuda psicológica es una señal de debilidad.",
    reality:
      "Buscar acompañamiento demuestra que reconoces tus necesidades y estás dispuesto a cuidar de tu bienestar.",
  },
  {
    myth: "La violencia solamente ocurre cuando existe agresión física.",
    reality:
      "También puede manifestarse mediante amenazas, manipulación, intimidación, control económico, violencia sexual y agresiones digitales.",
  },
];

const preventionSteps = [
  {
    title: "Reconocer",
    icon: "01",
    description:
      "Identifica comportamientos que vulneran la autonomía, la integridad y la dignidad de una persona.",
    action: "Aprende a distinguir el respeto del control y la intimidación.",
  },
  {
    title: "Escuchar",
    icon: "02",
    description:
      "Escucha sin juzgar, evita culpabilizar y respeta los tiempos de quien comparte una experiencia difícil.",
    action: "Creer, acompañar y no revictimizar también son formas de proteger.",
  },
  {
    title: "Proteger",
    icon: "03",
    description:
      "Prioriza la seguridad de la persona y busca acompañamiento de adultos responsables y profesionales.",
    action: "No confrontes a una persona agresora cuando hacerlo pueda aumentar el peligro.",
  },
  {
    title: "Actuar",
    icon: "04",
    description:
      "Conoce los canales institucionales y activa las rutas de atención y protección correspondientes.",
    action: "Ante una emergencia inmediata en Ecuador, comunícate con el ECU 911.",
  },
];

const accordionContent = [
  {
    title: "Educación y autonomía",
    text:
      "La ESI permite comprender el cuerpo, las relaciones, el consentimiento, la diversidad y los derechos humanos. Debe adaptarse a la edad y al desarrollo de cada persona.",
  },
  {
    title: "Relaciones saludables",
    text:
      "Una relación saludable se fundamenta en el respeto, la comunicación, la confianza, la libertad individual y la construcción de acuerdos.",
  },
  {
    title: "Ciudadanía digital",
    text:
      "La protección de datos, la privacidad, la seguridad de las cuentas y el consentimiento también deben formar parte de la educación adolescente.",
  },
];

functionSectionHeading({ number, eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <div className="section-number">{number}</div>

      <div>
        <span className="eyebrow">{eyebrow}</span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

functionApp() {
  const[menuOpen, setMenuOpen] = useState(false);

  const[progress, setProgress] = useState(0);

  const[activeMyth, setActiveMyth] = useState(null);

  const[activeStep, setActiveStep] = useState(0);

  const[activeAccordion, setActiveAccordion] = useState(0);

  const[feedback, setFeedback] = useState({
    name: "",
    topic: "Experiencia general",
    rating: "5",
    message: "",
    consent: false,
  });

  const [feedbackStatus, setFeedbackStatus] = useState({
    type: "",
    message: "",
  });

  // Barra de progreso de lectura
  useEffect(() => {
    constupdateProgress = () => {
      constavailableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      constpercentage =
        availableHeight > 0
          ? (window.scrollY / availableHeight) * 100
          : 0;

      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  // Actualizar campos del formulario
  function handleFeedbackChange(event) {
    const { name, value, checked, type } = event.target;

    setFeedback((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Enviar opiniones a la API
  async function handleFeedbackSubmit(event) {
    event.preventDefault();

    setFeedbackStatus({
      type: "",
      message: "",
    });

    if (!feedback.consent) {
      setFeedbackStatus({
        type: "error",
        message: "Necesitas aceptar el aviso de privacidad para continuar.",
      });

      return;
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(feedback),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "No fue posible enviar tu opinión."
        );
      }

      setFeedbackStatus({
        type: "success",
        message: "¡Gracias! Tu opinión se ha registrado correctamente.",
      });

      setFeedback({
        name: "",
        topic: "Experiencia general",
        rating: "5",
        message: "",
        consent: false,
      });
    } catch (error) {
      setFeedbackStatus({
        type: "error",
        message:
          error.message ||
          "No pudimos conectar con el servidor. Inténtalo nuevamente.",
      });
    }
  }

  return (
    <>
      {/* PROGRESO DE LECTURA */}

      <div
        className="scroll-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* NAVEGACIÓN */}

      <header className="site-header">
        <div className="container header-content">
          <a className="brand" href="#inicio" aria-label="FuturoLab, inicio">
            <span className="brand-symbol">F</span>

            <span>
              Futuro<span className="brand-highlight">Lab</span>
              <small>ECUADOR</small>
            </span>
          </a>

          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`main-nav ${menuOpen ? "nav-open" : ""}`}
            aria-label="Navegación principal"
          >
            {navigation.map((item) => (
              <a
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <a
              className="nav-help"
              href="#recursos"
              onClick={() => setMenuOpen(false)}
            >
              Necesito ayuda
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* PORTADA */}

        <section className="hero" id="inicio">
          <div className="hero-decoration decoration-one" />
          <div className="hero-decoration decoration-two" />

          <div className="container hero-grid">
            <div className="hero-content">
              <span className="hero-label">
                <span className="status-dot" />
                LABORATORIO DE FUTURO ADOLESCENTE
              </span>

              <h1>
                Tu presente
                <br />
                construye tu
                <br />
                <span>futuro.</span>
              </h1>

              <p className="hero-description">
                Un espacio para explorar, cuestionar y aprender sobre
                sexualidad, emociones, relaciones y derechos. Sin prejuicios,
                sin juicios y con información para tomar decisiones
                conscientes.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#laboratorio">
                  Explorar el laboratorio <span>↗</span>
                </a>

                <a className="button button-secondary" href="#recursos">
                  Buscar orientación
                </a>
              </div>

              <div className="hero-note">
                <span>✳</span>
                Aprender también es una forma de cuidarte.
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="visual-orbit orbit-outer" />
              <div className="visual-orbit orbit-middle" />
              <div className="visual-orbit orbit-inner" />

              <div className="visual-center">
                <span>FL</span>
                <small>FUTURO<br />LAB</small>
              </div>

              <div className="floating-symbol symbol-one">♡</div>
              <div className="floating-symbol symbol-two">✳</div>
              <div className="floating-symbol symbol-three">◎</div>
              <div className="floating-symbol symbol-four">✦</div>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="container hero-bottom-inner">
              <span>CONOCER</span>
              <span>REFLEXIONAR</span>
              <span>DECIDIR</span>
              <span>TRANSFORMAR</span>
            </div>
          </div>
        </section>

        {/* INTRODUCCIÓN */}

        <section className="intro-section" id="laboratorio">
          <div className="container">
            <div className="intro-heading">
              <span className="eyebrow">BIENVENIDA AL LABORATORIO</span>

              <h2>
                Hay preguntas que
                <br />
                <span>merecen respuestas.</span>
              </h2>

              <p>
                La adolescencia es una etapa de descubrimiento, cambios y
                decisiones. Contar con información confiable y espacios
                seguros permite vivirla con mayor autonomía y bienestar.
              </p>
            </div>

            <div className="module-grid">
              {modules.map((module) => (
                <a
                  href={module.href}
                  className={`module-card ${module.color}`}
                  key={module.number}
                >
                  <div className="module-top">
                    <span>{module.number}</span>
                    <span className="module-icon">{module.icon}</span>
                  </div>

                  <h3>{module.title}</h3>

                  <p>{module.description}</p>

                  <span className="module-link">
                    Explorar módulo <span>↗</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* MÓDULO 1: ESI */}

        <section className="content-section" id="esi">
          <div className="container">
            <SectionHeading
              number="01"
              eyebrow="CONOCIMIENTO Y AUTONOMÍA"
              title="Educación sexual integral y proyecto de vida"
              description="Conocer tu cuerpo, comprender tus emociones y tomar decisiones informadas son parte de construir tu futuro."
            />

            <div className="content-grid">
              <article className="feature-card feature-dark">
                <span className="card-kicker">01 / APRENDER</span>

                <h3>
                  La sexualidad
                  <br />
                  es integral.
                </h3>

                <p>
                  La Educación Sexual Integral (ESI) es un proceso educativo
                  que aborda las dimensiones físicas, emocionales, cognitivas
                  y sociales de la sexualidad.
                </p>

                <p>
                  Incluye el conocimiento del cuerpo, la afectividad, el
                  consentimiento, la igualdad de género, la diversidad y los
                  derechos humanos.
                </p>

                <div className="feature-symbol">✳</div>
              </article>

              <div className="concept-grid">
                <article className="concept-card">
                  <span className="concept-number">A</span>
                  <h3>Autoconocimiento</h3>
                  <p>
                    Comprender tu identidad, tus necesidades, tus emociones y
                    los cambios de tu cuerpo.
                  </p>
                </article>

                <article className="concept-card">
                  <span className="concept-number">B</span>
                  <h3>Consentimiento</h3>
                  <p>
                    Reconocer que toda interacción debe respetar la voluntad,
                    la autonomía y los límites de las personas.
                  </p>
                </article>

                <article className="concept-card">
                  <span className="concept-number">C</span>
                  <h3>Corresponsabilidad</h3>
                  <p>
                    Construir relaciones desde el respeto mutuo, la igualdad
                    y la toma de decisiones compartidas.
                  </p>
                </article>

                <article className="concept-card">
                  <span className="concept-number">D</span>
                  <h3>Derechos</h3>
                  <p>
                    Conocer los derechos sexuales y reproductivos y los
                    mecanismos para ejercerlos y protegerlos.
                  </p>
                </article>
              </div>
            </div>

            {/* MITOS Y REALIDADES */}

            <div className="interactive-section">
              <div className="interactive-heading">
                <div>
                  <span className="eyebrow">PON A PRUEBA LO QUE SABES</span>
                  <h3>Mitos y realidades</h3>
                </div>

                <p>
                  Selecciona una tarjeta para descubrir la explicación.
                </p>
              </div>

              <div className="myth-grid">
                {myths.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`myth-card ${
                      activeMyth === index ? "myth-active" : ""
                    }`}
                    aria-expanded={activeMyth === index}
                    onClick={() =>
                      setActiveMyth(activeMyth === index ? null : index)
                    }
                  >
                    <span className="myth-label">
                      {activeMyth === index ? "REALIDAD" : "¿MITO O REALIDAD?"}
                    </span>

                    <strong>{item.myth}</strong>

                    {activeMyth === index ? (
                      <p className="myth-reality">{item.reality}</p>
                    ) : (
                      <span className="myth-action">
                        Descubrir respuesta +
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* PROYECTO DE VIDA */}

            <div className="life-project">
              <div className="life-project-text">
                <span className="eyebrow">TU HISTORIA, TUS DECISIONES</span>

                <h3>¿Qué significa construir un proyecto de vida?</h3>

                <p>
                  Es un proceso personal y dinámico mediante el cual
                  identificas quién eres, qué valoras, qué deseas alcanzar y
                  qué acciones pueden acercarte a tus objetivos.
                </p>

                <p>
                  No existe una única ruta ni un calendario obligatorio.
                  Tus metas pueden cambiar mientras aprendes, experimentas
                  y descubres nuevas posibilidades.
                </p>

                <a href="#feedback" className="text-link">
                  Comparte tu experiencia <span>↗</span>
                </a>
              </div>

              <div className="reflection-card">
                <span className="reflection-icon">✦</span>
                <span className="eyebrow">UN MOMENTO PARA REFLEXIONAR</span>

                <h3>¿Qué futuro quieres construir?</h3>

                <ul>
                  <li>¿Qué valores orientan mis decisiones?</li>
                  <li>¿Qué habilidades quiero desarrollar?</li>
                  <li>¿Qué personas forman mi red de apoyo?</li>
                  <li>¿Qué puedo hacer hoy por mi bienestar?</li>
                </ul>
              </div>
            </div>

            {/* ACORDEÓN */}

            <div className="accordion-section">
              <h3>Explora otros componentes de la ESI</h3>

              {accordionContent.map((item, index) => (
                <div className="accordion-item" key={item.title}>
                  <button
                    type="button"
                    className="accordion-trigger"
                    aria-expanded={activeAccordion === index}
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === index ? null : index
                      )
                    }
                  >
                    <span>{item.title}</span>

                    <span className="accordion-icon">
                      {activeAccordion === index ? "−" : "+"}
                    </span>
                  </button>

                  {activeAccordion === index && (
                    <div className="accordion-content">
                      <p>{item.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MÓDULO 2: VIOLENCIA */}

        <section className="content-section section-alternate" id="violencia">
          <div className="container">
            <SectionHeading
              number="02"
              eyebrow="PROTECCIÓN Y DERECHOS"
              title="Prevención de violencias"
              description="Reconocer la violencia es un primer paso para cuestionarla, prevenirla y construir espacios seguros."
            />

            <div className="violence-intro">
              <div className="violence-icon">!</div>

              <div>
                <h3>La violencia no siempre deja marcas visibles.</h3>

                <p>
                  Puede manifestarse mediante conductas físicas,
                  psicológicas, sexuales, económicas o digitales. Ninguna
                  persona merece vivir situaciones de intimidación,
                  manipulación o control.
                </p>
              </div>
            </div>

            <div className="violence-grid">
              <article className="violence-card">
                <span>01</span>
                <h3>Violencia física</h3>
                <p>
                  Acciones que causan daño o afectan la integridad corporal
                  de una persona.
                </p>
              </article>

              <article className="violence-card">
                <span>02</span>
                <h3>Violencia psicológica</h3>
                <p>
                  Amenazas, humillaciones, intimidación, aislamiento y
                  manipulación emocional.
                </p>
              </article>

              <article className="violence-card">
                <span>03</span>
                <h3>Violencia sexual</h3>
                <p>
                  Actos o interacciones sexuales impuestos o realizados sin
                  consentimiento.
                </p>
              </article>

              <article className="violence-card">
                <span>04</span>
                <h3>Violencia digital</h3>
                <p>
                  Ciberacoso, vigilancia, sextorsión y difusión no consentida
                  de contenido íntimo.
                </p>
              </article>
            </div>

            {/* PASOS INTERACTIVOS */}

            <div className="stepper-section">
              <div className="stepper-heading">
                <span className="eyebrow">DE LA REFLEXIÓN A LA ACCIÓN</span>
                <h3>¿Cómo podemos actuar?</h3>
                <p>
                  Explora los cuatro pasos para acompañar una situación de
                  violencia de forma responsable.
                </p>
              </div>

              <div className="stepper-layout">
                <div className="stepper-navigation">
                  {preventionSteps.map((step, index) => (
                    <button
                      type="button"
                      key={step.icon}
                      onClick={() => setActiveStep(index)}
                      className={`step-button ${
                        activeStep === index ? "step-active" : ""
                      }`}
                      aria-pressed={activeStep === index}
                    >
                      <span>{step.icon}</span>
                      {step.title}
                      <span className="step-arrow">↗</span>
                    </button>
                  ))}
                </div>

                <div className="stepper-content" aria-live="polite">
                  <span className="step-content-number">
                    {preventionSteps[activeStep].icon}
                  </span>

                  <h3>{preventionSteps[activeStep].title}</h3>

                  <p>{preventionSteps[activeStep].description}</p>

                  <div className="step-tip">
                    <strong>Recuerda:</strong>
                    <p>{preventionSteps[activeStep].action}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="digital-safety">
              <div>
                <span className="eyebrow">TU VIDA TAMBIÉN ESTÁ EN INTERNET</span>

                <h3>Ciudadanía digital y protección de datos</h3>

                <p>
                  La privacidad y la seguridad digital son parte de tus
                  derechos. Compartir contraseñas, exigir fotografías,
                  revisar dispositivos sin permiso o amenazar con divulgar
                  imágenes son conductas que deben tomarse en serio.
                </p>
              </div>

              <div className="digital-checklist">
                <p>Buenas prácticas digitales</p>

                <ul>
                  <li>Utiliza contraseñas seguras y distintas.</li>
                  <li>Configura la privacidad de tus cuentas.</li>
                  <li>No compartas información personal con desconocidos.</li>
                  <li>Guarda evidencias cuando sea seguro hacerlo.</li>
                  <li>Busca apoyo ante amenazas o extorsión.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MÓDULO 3: SALUD MENTAL */}

        <section className="content-section" id="salud-mental">
          <div className="container">
            <SectionHeading
              number="03"
              eyebrow="BIENESTAR Y AUTOCUIDADO"
              title="Tu salud mental también importa"
              description="Comprender lo que sientes y reconocer cuándo necesitas apoyo es parte de construir una vida saludable."
            />

            <div className="mental-banner">
              <div className="mental-banner-symbol">♡</div>

              <div>
                <h3>No tienes que poder con todo, todo el tiempo.</h3>

                <p>
                  Las emociones forman parte de la experiencia humana.
                  Sentir tristeza, miedo, frustración o incertidumbre no te
                  hace menos capaz ni menos valioso.
                </p>
              </div>
            </div>

            <div className="mental-grid">
              <article className="mental-card">
                <div className="mental-card-icon">01</div>
                <h3>Reconocer</h3>
                <p>
                  Identifica tus emociones, observa qué situaciones influyen
                  en ellas y aprende a expresar lo que necesitas.
                </p>
              </article>

              <article className="mental-card">
                <div className="mental-card-icon">02</div>
                <h3>Comprender</h3>
                <p>
                  Reconoce que tu bienestar también está relacionado con
                  tus condiciones familiares, sociales, educativas y
                  económicas.
                </p>
              </article>

              <article className="mental-card">
                <div className="mental-card-icon">03</div>
                <h3>Actuar</h3>
                <p>
                  Fortalece tus redes de apoyo y busca acompañamiento
                  profesional cuando lo necesites.
                </p>
              </article>
            </div>

            <div className="mental-support">
              <div>
                <span className="eyebrow">HERRAMIENTAS DE AUTOCUIDADO</span>
                <h3>Pequeñas acciones, grandes posibilidades.</h3>
              </div>

              <div className="support-list">
                <p><span>✦</span> Mantener una rutina de descanso.</p>
                <p><span>✦</span> Expresar tus emociones sin juzgarte.</p>
                <p><span>✦</span> Mantener vínculos de confianza.</p>
                <p><span>✦</span> Establecer límites saludables.</p>
                <p><span>✦</span> Acudir a profesionales cuando lo requieras.</p>
              </div>
            </div>

            <p className="medical-disclaimer">
              Este contenido es educativo. No constituye una evaluación
              psicológica, un diagnóstico ni un tratamiento. Las escalas de
              evaluación clínica deben ser aplicadas e interpretadas por
              profesionales capacitados.
            </p>
          </div>
        </section>

        {/* MÓDULO 4: ENFOQUE INTEGRAL */}

        <section className="content-section section-alternate" id="enfoque">
          <div className="container">
            <SectionHeading
              number="04"
              eyebrow="UNA MIRADA MÁS AMPLIA"
              title="El bienestar se construye en comunidad"
              description="Las decisiones individuales están influenciadas por las relaciones, las oportunidades y las condiciones sociales."
            />

            <div className="socioecological">
              <div className="socio-circle">
                <div className="socio-level socio-four">
                  <span>ESTRUCTURA SOCIAL</span>
                </div>

                <div className="socio-level socio-three">
                  <span>COMUNIDAD</span>
                </div>

                <div className="socio-level socio-two">
                  <span>FAMILIA Y PARES</span>
                </div>

                <div className="socio-level socio-one">
                  <span>YO</span>
                </div>
              </div>

              <div className="socio-description">
                <span className="eyebrow">ENFOQUE SOCIOECOLÓGICO</span>

                <h3>El entorno también construye oportunidades.</h3>

                <p>
                  El desarrollo adolescente no depende exclusivamente de
                  las decisiones individuales. Las condiciones del hogar,
                  la escuela, los servicios públicos y las estructuras
                  sociales también influyen en el bienestar.
                </p>

                <p>
                  Por eso, la prevención y la promoción de derechos necesitan
                  acciones coordinadas entre personas, familias,
                  instituciones y comunidades.
                </p>
              </div>
            </div>

            <div className="inclusion-grid">
              <article>
                <span>01</span>
                <h3>Igualdad</h3>
                <p>
                  Eliminar barreras y garantizar oportunidades sin
                  discriminación.
                </p>
              </article>

              <article>
                <span>02</span>
                <h3>Diversidad</h3>
                <p>
                  Respetar las diferentes identidades, culturas y formas de
                  vivir.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>Accesibilidad</h3>
                <p>
                  Diseñar espacios y recursos comprensibles y accesibles para
                  todas las personas.
                </p>
              </article>

              <article>
                <span>04</span>
                <h3>Participación</h3>
                <p>
                  Reconocer a adolescentes y jóvenes como agentes de cambio
                  y sujetos de derechos.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* RECURSOS DE APOYO */}

        <section className="resources-section" id="recursos">
          <div className="container">
            <div className="resources-content">
              <span className="eyebrow">NO ESTÁS EN SOLEDAD</span>

              <h2>
                Pedir ayuda
                <br />
                <span>también es avanzar.</span>
              </h2>

              <p>
                Si estás atravesando una situación difícil, puedes buscar
                orientación y acompañamiento. No tienes que resolverlo todo
                sin apoyo.
              </p>
            </div>

            <div className="resources-grid">
              <article className="resource-card resource-emergency">
                <span className="resource-label">EMERGENCIAS · ECUADOR</span>

                <strong>9-1-1</strong>

                <p>
                  Comunícate con el ECU 911 ante una emergencia inmediata
                  o un riesgo para la vida o la seguridad.
                </p>

                <a
                  href="https://www.ecu911.gob.ec/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sitio oficial ECU 911 ↗
                </a>
              </article>

              <article className="resource-card">
                <span className="resource-label">ORIENTACIÓN EN SALUD MENTAL</span>

                <strong>171 · Opción 6</strong>

                <p>
                  El Ministerio de Salud Pública ha publicado este canal
                  para primeros auxilios psicológicos. Consulta su
                  disponibilidad y horarios vigentes.
                </p>

                <a
                  href="https://www.salud.gob.ec/a-traves-de-la-linea-171-msp-ofrece-atencion-en-salud-mental/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Información del MSP ↗
                </a>
              </article>

              <article className="resource-card">
                <span className="resource-label">REDES DE APOYO</span>

                <strong>Habla con alguien.</strong>

                <p>
                  Una persona adulta de confianza, un docente, un orientador
                  o un profesional de salud pueden acompañarte.
                </p>

                <a href="#feedback">
                  Explorar FuturoLab ↗
                </a>
              </article>
            </div>

            <p className="resources-disclaimer">
              FuturoLab EC es un espacio educativo y de orientación general.
              No reemplaza la atención profesional, psicológica, médica o
              jurídica. Ante peligro inmediato, busca servicios de emergencia.
            </p>
          </div>
        </section>

        {/* FORMULARIO DE FEEDBACK */}

        <section className="feedback-section" id="feedback">
          <div className="container feedback-grid">
            <div className="feedback-intro">
              <span className="eyebrow">TU VOZ TAMBIÉN CONSTRUYE</span>

              <h2>
                Ayúdanos a
                <br />
                <span>hacerlo mejor.</span>
              </h2>

              <p>
                Tus opiniones nos ayudan a mejorar los contenidos, las
                actividades y la experiencia de aprendizaje de FuturoLab.
              </p>

              <div className="feedback-note">
                <span>✦</span>
                Comparte únicamente comentarios generales sobre el sitio.
                No incluyas datos privados ni información médica o íntima.
              </div>
            </div>

            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <div className="form-heading">
                <h3>Formulario de opinión</h3>
                <span>Tu participación importa.</span>
              </div>

              <div className="form-group">
                <label htmlFor="feedback-name">
                  Nombre <span>(opcional)</span>
                </label>

                <input
                  id="feedback-name"
                  type="text"
                  name="name"
                  placeholder="¿Cómo te llamas?"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  maxLength={60}
                />
              </div>

              <div className="form-group">
                <label htmlFor="feedback-topic">
                  ¿Qué sección quieres evaluar?
                </label>

                <select
                  id="feedback-topic"
                  name="topic"
                  value={feedback.topic}
                  onChange={handleFeedbackChange}
                >
                  <option>Experiencia general</option>
                  <option>Educación sexual integral</option>
                  <option>Proyecto de vida</option>
                  <option>Prevención de violencias</option>
                  <option>Salud mental</option>
                  <option>Enfoque integral</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="feedback-rating">
                  ¿Cómo calificas la experiencia?
                </label>

                <select
                  id="feedback-rating"
                  name="rating"
                  value={feedback.rating}
                  onChange={handleFeedbackChange}
                >
                  <option value="5">5 - Excelente</option>
                  <option value="4">4 - Muy buena</option>
                  <option value="3">3 - Buena</option>
                  <option value="2">2 - Regular</option>
                  <option value="1">1 - Necesita mejorar</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="feedback-message">
                  Cuéntanos tu opinión
                </label>

                <textarea
                  id="feedback-message"
                  name="message"
                  placeholder="¿Qué te gustó? ¿Qué cambiarías?"
                  rows="4"
                  minLength="10"
                  maxLength="500"
                  required
                  value={feedback.message}
                  onChange={handleFeedbackChange}
                />

                <small>{feedback.message.length}/500 caracteres</small>
              </div>

              <label className="consent-label">
                <input
                  type="checkbox"
                  name="consent"
                  checked={feedback.consent}
                  onChange={handleFeedbackChange}
                />

                <span>
                  Acepto que mi opinión general sea almacenada para fines
                  de evaluación y mejora de FuturoLab.
                </span>
              </label>

              <button
                type="submit"
                className="button button-primary form-submit"
              >
                Enviar opinión <span>↗</span>
              </button>

              {feedbackStatus.message && (
                <p
                  className={`form-status ${feedbackStatus.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {feedbackStatus.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* PIE DE PÁGINA */}

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand" href="#inicio">
              <span className="brand-symbol">F</span>

              <span>
                Futuro<span className="brand-highlight">Lab</span>
                <small>ECUADOR</small>
              </span>
            </a>

            <p>Una tribu sin tabú.</p>
            <p>Conocimiento para transformar el futuro.</p>
          </div>

          <div className="footer-links">
            <strong>EXPLORA</strong>

            <a href="#esi">Educación sexual integral</a>
            <a href="#violencia">Prevención de violencias</a>
            <a href="#salud-mental">Salud mental</a>
            <a href="#enfoque">Enfoque integral</a>
          </div>

          <div className="footer-links">
            <strong>FUTUROLAB</strong>

            <a href="#recursos">Recursos de apoyo</a>
            <a href="#feedback">Opiniones</a>
            <a href="#inicio">Volver al inicio ↑</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} FuturoLab EC. Todos los derechos reservados.</p>

          <p>Educación · Derechos · Bienestar</p>
        </div>
      </footer>
    </>
  );
}

export default App;
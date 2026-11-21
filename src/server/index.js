import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// =====================================
// CONFIGURACIÓN GENERAL
// =====================================

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

// =====================================
// PROTECCIÓN DE ENVÍOS
// =====================================

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 8,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    message:
      "Has realizado demasiados envíos. Inténtalo nuevamente más tarde.",
  },
});

// =====================================
// MODELO DE MONGODB
// =====================================

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "",
    },

    topic: {
      type: String,

      required: true,

      enum: [
        "Experiencia general",
        "Educación sexual integral",
        "Proyecto de vida",
        "Prevención de violencias",
        "Salud mental",
        "Enfoque integral",
      ],
    },

    rating: {
      type: Number,

      required: true,

      min: 1,
      max: 5,
    },

    message: {
      type: String,

      required: true,

      trim: true,

      minlength: 10,
      maxlength: 500,
    },

    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "Se requiere aceptar el aviso de privacidad.",
      },
    },
  },

  {
    timestamps: true,

    versionKey: false,
  }
);

const Feedback =
  mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema);

// =====================================
// FUNCIONES DE VALIDACIÓN
// =====================================

function cleanText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, "")
    .trim();
}

// =====================================
// RUTA DE PRUEBA DE LA API
// =====================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,

    project: "FuturoLab EC",

    api: "operativa",

    database:
      mongoose.connection.readyState === 1
        ? "conectada"
        : "desconectada",

    timestamp: new Date().toISOString(),
  });
});

// =====================================
// API: REGISTRAR OPINIONES
// =====================================

app.post(
  "/api/feedback",
  feedbackLimiter,
  async (req, res) => {
    try {
      const name = cleanText(req.body.name);

      const topic = cleanText(req.body.topic);

      const message = cleanText(req.body.message);

      const rating = Number(req.body.rating);

      const consent = req.body.consent;

      // Validar consentimiento

      if (consent !== true) {
        return res.status(400).json({
          success: false,

          message:
            "Debes aceptar el aviso de privacidad.",
        });
      }

      // Validar nombre

      if (name.length > 60) {
        return res.status(400).json({
          success: false,

          message: "El nombre supera el límite permitido.",
        });
      }

      // Validar tema

      const allowedTopics = [
        "Experiencia general",
        "Educación sexual integral",
        "Proyecto de vida",
        "Prevención de violencias",
        "Salud mental",
        "Enfoque integral",
      ];

      if (!allowedTopics.includes(topic)) {
        return res.status(400).json({
          success: false,

          message: "Selecciona una sección válida.",
        });
      }

      // Validar calificación

      if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          success: false,

          message: "La calificación debe estar entre 1 y 5.",
        });
      }

      // Validar mensaje

      if (message.length < 10 || message.length > 500) {
        return res.status(400).json({
          success: false,

          message:
            "Tu opinión debe contener entre 10 y 500 caracteres.",
        });
      }

      // Registrar en MongoDB

      const newFeedback = await Feedback.create({
        name,
        topic,
        rating,
        message,
        consent,
      });

      return res.status(201).json({
        success: true,

        message: "Opinión registrada correctamente.",

        id: newFeedback._id,
      });

    } catch (error) {
      console.error("Error registrando opinión:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,

          message: "Revisa los datos enviados.",
        });
      }

      return res.status(500).json({
        success: false,

        message:
          "Ocurrió un error interno. Inténtalo más tarde.",
      });
    }
  }
);

// =====================================
// RUTA NO ENCONTRADA
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: "La ruta solicitada no existe.",
  });
});

// =====================================
// CONECTAR MONGODB Y ENCENDER SERVIDOR
// =====================================

async function startServer() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        "No se ha configurado MONGODB_URI en el archivo .env"
      );
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB conectado correctamente.");

    app.listen(PORT, () => {
      console.log(
        `FuturoLab API disponible en http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "No se pudo iniciar FuturoLab:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
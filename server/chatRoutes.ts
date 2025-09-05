import express from "express";

const r = express.Router();

r.post("/api/chat", express.json(), (req, res) => {
  const userMessage = (req.body.message || "").toLowerCase();
  let botResponse = "";

  if (userMessage.includes("precios") || userMessage.includes("costo")) {
    botResponse = "AquApp ofrece planes personalizados según el tamaño y las necesidades de tu centro de cultivo. Para una cotización exacta, por favor, contáctanos directamente a través de nuestro formulario o solicita una llamada.";
  } else if (userMessage.includes("funcionalidades") || userMessage.includes("características") || userMessage.includes("que hace")) {
    botResponse = "AquApp te permite monitorear la salud de peces, la calidad del agua, gestionar balsas jaulas con visualización 3D, generar reportes normativos automáticos, programar mantenimiento y recibir alertas inteligentes. ¿Hay alguna funcionalidad específica que te interese conocer más a fondo?";
  } else if (userMessage.includes("demo") || userMessage.includes("prueba") || userMessage.includes("ver")) {
    botResponse = "¡Claro! Puedes solicitar una demostración personalizada con uno de nuestros expertos para que te muestre cómo AquApp puede transformar tu operación. Visita nuestra sección 'Comenzar Ahora' para agendarla.";
  } else if (userMessage.includes("soporte") || userMessage.includes("ayuda") || userMessage.includes("problema")) {
    botResponse = "Nuestro equipo de soporte técnico está disponible para ayudarte. Puedes encontrar más información en nuestra sección de 'Contacto' o, si ya eres cliente, a través del portal de soporte dentro de la plataforma.";
  } else if (userMessage.includes("ia") || userMessage.includes("inteligencia artificial") || userMessage.includes("predictivo")) {
    botResponse = "AquApp integra IA para la predicción de mortalidad, optimización de recursos y análisis de datos avanzados, transformando la información en decisiones estratégicas. Invertimos en infraestructura local para potenciar agentes de IA en tus centros.";
  } else if (userMessage.includes("normativa") || userMessage.includes("regulaciones") || userMessage.includes("chile")) {
    botResponse = "AquApp está diseñado para cumplir con las normativas chilenas, incluyendo la generación automática de reportes según la RESA y otras regulaciones. Esto te ayuda a mantener el cumplimiento y reducir riesgos.";
  } else {
    botResponse = "Gracias por tu interés en AquApp. Tu consulta ha sido registrada y un miembro de nuestro equipo se pondrá en contacto contigo a la brevedad para resolver tus dudas. Mientras tanto, ¿hay algo más en lo que pueda ayudarte?";
  }

  res.json({ response: botResponse });
});

export default r;

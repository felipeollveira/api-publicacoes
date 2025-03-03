require('dotenv').config();

// Middleware 
function logAccess(req, res, next) {
  const origin = req.headers.origin || 'Localhost';
  const ip = req.headers['x-forwarded-for'] || req.ip; 

  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  if (!allowedOrigins.includes(origin)) {
    // Loga tentativas de acesso bloqueadas
    console.error(`Tentativa de acesso bloqueada - Origem: ${origin}, IP: ${ip}`);
    return res.status(403).json({ error: 'Acesso não permitido.', origin }); 
  }

  // Loga acessos permitidos
  console.info(`Acesso permitido - Origem: ${origin}, IP: ${ip}`);

  next();
}

// Configuração do CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

    // Permite requisições apenas de origens permitidas
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Permite a requisição
    } else {
      callback(new Error('Acesso não permitido por CORS')); // Rejeita requisições de origens não permitidas
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Exporta as funções
module.exports = { logAccess, corsOptions };
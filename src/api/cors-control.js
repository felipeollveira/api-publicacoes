require('dotenv').config();

// Middleware
function logAccess(req, res, next) {
  const origin = req.headers.origin || 'Localhost'; 
  const ip = req.headers['x-forwarded-for'] || req.ip; 


  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  if (!allowedOrigins.includes(origin)) {
    console.error(`Tentativa de acesso bloqueada - Origem: ${origin}, IP: ${ip}`);
    return res.status(403).send('Acesso não permitido por CORS'); 
  }

  next(); // Passa para o próximo middleware
}

// Configuração do CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

    
    if (allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Acesso não permitido por CORS')); 
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { logAccess, corsOptions };
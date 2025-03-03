/** */
require('dotenv').config();

  // Configuração do CORS
  const corsOptions = {
    origin: function (origin, callback) {
      if ((process.env.ALLOWED_ORIGINS.split(',')).includes(origin)) {
        callback(null, true); // Permite a requisição
      } else {
        console.error()
        callback(new Error('Acesso não permitido por CORS')); 
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
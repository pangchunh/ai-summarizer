const allowedOrigins = ['http://localhost:3001', 'https://isa-ai-summarizer-admin.onrender.com', 'https://isa-ai-summarizer.onrender.com'];

const allowCors = (req, res, next) => {
  const origin = req.headers.origin;
  console.log(origin)

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Include this line for credentials

  next();
};

module.exports = {allowCors};
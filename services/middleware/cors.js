const allowedOrigins = ['http://localhost:3001', 'http://example.com', 'http://anotherdomain.com'];

const allowCors = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Include this line for credentials

  next();
};

module.exports = {allowCors};
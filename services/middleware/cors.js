const allowedOrigins = ['http://localhost:3001', 'https://isa-ai-summarizer.onrender.com'];

const allowCors = (req, res, next) => {
  console.log("Handling cors in middleware")
  const origin = req.headers.origin;
  console.log(origin)

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Include this line for credentials

  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }

};

module.exports = {allowCors};
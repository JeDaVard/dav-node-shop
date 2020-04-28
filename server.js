const app = require('./app');
const https = require('https');
const fs = require('fs');

const port = process.env.PORT;

// SSL
const privateKey = fs.readFileSync('-server.key');
const certificate = fs.readFileSync('server.cert');

const server =
    process.env.NODE_ENV === 'production'
        ? https.createServer({ key: privateKey, cert: certificate }, app)
        : app;

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

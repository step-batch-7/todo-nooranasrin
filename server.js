const http = require('http');
const { stdout, stderr } = process;
const { handleRequest } = require('./lib/routers');
const [, , port] = process.argv;
const DEFAULT_PORT = 4000;

const main = function(port = DEFAULT_PORT) {
  const server = http.createServer(handleRequest);
  server.on('error', err => stderr.write('server error', err));
  server.listen(port, () =>
    stdout.write('started listening', server.address())
  );
};

main(port);

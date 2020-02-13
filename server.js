const app = require('./lib/routers');
const [, , port] = process.argv;
const DEFAULT_PORT = 4000;

const main = function(port = DEFAULT_PORT) {
  app.listen(port, () => process.stdout.write('Started Listening'));
};

main(port);

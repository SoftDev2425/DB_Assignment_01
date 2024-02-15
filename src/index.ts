import { fastify } from "fastify";
import pino from "pino";

const server = fastify({
  logger: pino({ level: "info" }),
});

const startServer = async () => {
  try {
    server.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`server listening on ${address}`);
    });
  } catch (error) {
    server.log.error(error);
  }
};

startServer();

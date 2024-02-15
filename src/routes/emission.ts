import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { tester } from "../services/emissions.service";

interface Params {
  id: string;
}

export async function emissionRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const emissions = await tester();
      return { emissions };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed getting emissions. Please try again later." });
    }
  });

  fastify.get("/:id", async function (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
      const id = request.params.id;
      //   return await getUserById(id);
      return { message: `hello from emission by id ${id}` };
    } catch (error: any) {
      fastify.log.error(error);
      reply.code(500).send({ error: error.message });
    }
  });
}

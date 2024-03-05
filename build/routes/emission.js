"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emissionRoutes = void 0;
const emissions_service_1 = require("../services/emissions.service");
function emissionRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const emissions = yield (0, emissions_service_1.tester)();
                    return { emissions };
                }
                catch (error) {
                    fastify.log.error(error);
                    reply.code(500).send({ error: "Failed getting emissions. Please try again later." });
                }
            });
        });
        fastify.get("/:id", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const id = request.params.id;
                    //   return await getUserById(id);
                    return { message: `hello from emission by id ${id}` };
                }
                catch (error) {
                    fastify.log.error(error);
                    reply.code(500).send({ error: error.message });
                }
            });
        });
    });
}
exports.emissionRoutes = emissionRoutes;

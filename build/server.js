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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const emission_1 = require("./routes/emission");
const cors_1 = __importDefault(require("@fastify/cors"));
function buildServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const fastify = (0, fastify_1.default)({ logger: true });
        fastify.register(cors_1.default, {
            origin: ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:3000"],
            methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
        });
        fastify.get("/", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                return { msg: "Hello from DB assignment 1" };
            });
        });
        fastify.register(emission_1.emissionRoutes, { prefix: "/api/emission" });
        return fastify;
    });
}
exports.buildServer = buildServer;

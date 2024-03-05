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
const server_1 = require("./server");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield (0, server_1.buildServer)();
        server.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
            if (err) {
                server.log.error(err);
                process.exit(1);
            }
            server.log.info(`server listening on ${address}`);
        });
        //@ts-ignore
        [("SIGINT", "SIGTERM")].forEach((signal) => {
            process.on(signal, () => __awaiter(this, void 0, void 0, function* () {
                yield server.close();
                process.exit(0);
            }));
        });
    });
}
startServer();

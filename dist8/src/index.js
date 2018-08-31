"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
exports.TestmoduleApplication = application_1.TestmoduleApplication;
async function main(options) {
    const app = new application_1.TestmoduleApplication(options);
    await app.boot();
    await app.start();
    const url = app.restServer.url;
    return app;
}
exports.main = main;
//# sourceMappingURL=index.js.map
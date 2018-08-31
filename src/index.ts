import {TestmoduleApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {TestmoduleApplication};

export async function main(options?: ApplicationConfig) {

  const app = new TestmoduleApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  return app;
}

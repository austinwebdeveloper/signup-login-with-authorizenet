import { inject } from '@loopback/core';
import { juggler, DataSource, AnyObject } from '@loopback/repository';
const config = require('./mongo.datasource.json');
console.log(config)
export class MongoDataSource extends juggler.DataSource {
  static dataSourceName = 'mongo';
  constructor(
    @inject('datasources.config.mongo', { optional: true })
    dsConfig: AnyObject = config
  ) {
    super(dsConfig);
  }
}

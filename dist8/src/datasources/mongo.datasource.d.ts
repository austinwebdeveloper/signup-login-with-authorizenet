import { juggler, AnyObject } from '@loopback/repository';
export declare class MongoDataSource extends juggler.DataSource {
    static dataSourceName: string;
    constructor(dsConfig?: AnyObject);
}

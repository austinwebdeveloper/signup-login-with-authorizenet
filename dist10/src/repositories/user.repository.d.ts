import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { User } from '../models';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.email> {
    protected datasource: juggler.DataSource;
    constructor(datasource: juggler.DataSource);
}

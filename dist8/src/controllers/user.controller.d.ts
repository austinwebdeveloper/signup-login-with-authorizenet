import { UserRepository } from '../repositories';
import { User } from '../models';
export declare class UserController {
    protected userRepo: UserRepository;
    constructor(userRepo: UserRepository);
    createUser(user: User): Promise<{} | undefined>;
    updateSubscription(user: Object): Promise<{}>;
    getSubscriptionDetails(user: Object): Promise<{}>;
    getSubscriptionStatus(user: Object): Promise<{}>;
	reSubscribe(user: Object): Promise<{}>;
    cancelSubscription(user: Object): Promise<{}>;
    loginUser(user: Object): Promise<object>;
    findUserById(id: string): Promise<User>;
    findUser(): Promise<User[]>;
    replaceUser(id: string, user: User): Promise<boolean>;
    updateUser(id: string, user: User): Promise<boolean>;
    deleteUser(id: string): Promise<boolean>;
}

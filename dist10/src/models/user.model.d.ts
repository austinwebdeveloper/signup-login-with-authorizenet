import {Entity} from '@loopback/repository';
   export declare class User extends Entity {
 _id: object;
 firstname :string; 
  lastname :string; 
  username :string; 
  email :string; 
  password :string; 
  address :string; 
  city :string; 
  state :string; 
  country :string; 
  zip :number; 
  phone :number; 
  cardcode :number; 
  expiredate :string; 
  cardnumber :number; 
  subscription_id :string; 
  subscription_status :string; 
 constructor(data?: Partial<User>);
}

import {Entity, model, property} from '@loopback/repository';
 @model()
export class User extends Entity {
  @property({
 type: 'object',
 id: true,
required: false,
})
_id: object;
@property({
type: 'string', 
required: true,
})
 firstname :string; 
@property({
type: 'string', 
required: true,
})
 lastname :string; 
@property({
type: 'string', 
required: true,
})
 username :string; 
@property({
type: 'string', 
required: true,
})
 email :string; 
@property({
type: 'string', 
required: true,
})
 password :string; 
@property({
type: 'string', 
required: false,
})
 address :string; 
@property({
type: 'string', 
required: false,
})
 city :string; 
@property({
type: 'string', 
required: false,
})
 state :string; 
@property({
type: 'string', 
required: false,
})
 country :string; 
@property({
type: 'number', 
required: false,
})
 zip :number; 
@property({
type: 'number', 
required: false,
})
 phone :number; 
@property({
type: 'number', 
required: true,
})
 cardcode :number; 
@property({
type: 'string', 
required: true,
})
 expiredate :string; 
@property({
type: 'number', 
required: true,
})
 cardnumber :number; 
@property({
type: 'string', 
required: false,
})
 subscription_id :string; 
@property({
type: 'string', 
required: false,
})
 subscription_status :string; 
constructor(data?: Partial<User>) {
super(data);
}
};

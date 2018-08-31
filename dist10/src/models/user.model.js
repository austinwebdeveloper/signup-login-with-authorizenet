"use strict";
 var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
let User = class User extends repository_1.Entity {
constructor(data) {
super(data);
}
};
__decorate([
 repository_1.property({
 type: 'object',
 id: true,
required: false,
 }),
    __metadata("design:type", Object)
], User.prototype, "_id", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: true,
}),
    __metadata("design:type", String)
], User.prototype,"firstname", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: true,
}),
    __metadata("design:type", String)
], User.prototype,"lastname", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: true,
}),
    __metadata("design:type", String)
], User.prototype,"username", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: true,
}),
    __metadata("design:type", String)
], User.prototype,"email", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: true,
}),
    __metadata("design:type", String)
], User.prototype,"password", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: false,
}),
    __metadata("design:type", String)
], User.prototype,"address", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: false,
}),
    __metadata("design:type", String)
], User.prototype,"city", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: false,
}),
    __metadata("design:type", String)
], User.prototype,"state", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: false,
}),
    __metadata("design:type", String)
], User.prototype,"country", void 0);
__decorate([
repository_1.property({
type: 'number', 
required: false,
}),
    __metadata("design:type", Number)
], User.prototype,"zip", void 0);
__decorate([
repository_1.property({
type: 'number', 
required: false,
}),
    __metadata("design:type", Number)
], User.prototype,"phone", void 0);
__decorate([
repository_1.property({
type: 'number', 
required: true,
}),
    __metadata("design:type", Number)
], User.prototype,"cardcode", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: true,
}),
    __metadata("design:type", String)
], User.prototype,"expiredate", void 0);
__decorate([
repository_1.property({
type: 'number', 
required: true,
}),
    __metadata("design:type", Number)
], User.prototype,"cardnumber", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: false,
}),
    __metadata("design:type", String)
], User.prototype,"subscription_id", void 0);
__decorate([
repository_1.property({
type: 'string', 
required: false,
}),
    __metadata("design:type", String)
], User.prototype,"subscription_status", void 0);
User = __decorate([
repository_1.model(),
__metadata("design:paramtypes", [Object])
], User);
exports.User = User;

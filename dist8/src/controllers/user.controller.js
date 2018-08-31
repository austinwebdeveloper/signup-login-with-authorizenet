"use strict";
// Uncomment these imports to begin using these cool features!
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {inject} from '@loopback/context';
const repository_1 = require("@loopback/repository");
const context_1 = require('@loopback/context');
const repositories_1 = require("../repositories");
const superagent = require('superagent');
var path = require('path');
const mongodb = require('mongodb');
var createSubscription = require('../../../service/createSubscription');
var updateSubscription = require('../../../service/updateSubscription');
var cancelSubscription = require('../../../service/cancelSubscription');
var getSubscription = require('../../../service/getSubscription');
var getSubscriptionStatus = require('../../../service/getSubscriptionStatus');
var constants = require('../../../constants');
var paymentconstants = require('../../../paymentConfig');
const nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;
var md5 = require('md5');
const config = require("../../../updateport");

const transporter = nodemailer.createTransport({
    service: constants.service,
    auth: {
    user: constants.email,
    pass: constants.password
}
});
const models_1 = require("../models");
const rest_1 = require("@loopback/rest");



let UserController = class UserController {
    constructor(userRepo) {
     this.userRepo = userRepo;
    }
    async verifyUser() {
		console.log('result')
		 let result =  await repositories_1.UserRepository.find();
		console.log('result')
		console.log(result)
		return result;
	}
    async createUser(user) {
        let data;
        if (!user.email && !user.password) {
            throw new rest_1.HttpErrors.BadRequest('email or password is required');
        }
        let response = await this.userRepo.find({ where: { or:[{username: user.username}, {email: user.email }]} });
		console.log(response)
        if (response.length > 0) {
            throw new rest_1.HttpErrors.BadRequest('email or username already exists');
        }
        else {		
	
                let repo = this.userRepo;
                return new Promise((resolve, reject) => {
                    createSubscription.createSubscription(user, function (err, transaction_result) {
                        if (err) {
                            resolve(err);
                        }
                        else {
                            if (transaction_result.messages.resultCode == "Error") {
                                resolve(transaction_result.messages);
                            }
                            else {
								var date = new Date();
                                user.subscription_id = transaction_result.subscriptionId;
                                user.subscription_status =  "active" 
                                let mailOptions = {
										from: constants.email, 
										to: user.email, 
										subject: 'Subscription successfully completed',
                                    html:"<!doctype html><html><head><style>"+
											 "table { width: 100%; line-height: inherit; text-align: left; background:#fff; }"+
												"table, th, td {	border: 1px solid black; border-collapse: collapse; }"+
												"th, td {	padding: 7px;		text-align: center;	} .heading{background:#DCDCDC;}"+
												"table tr.top table td {padding-bottom: 20px;} .content{max-width: 800px; margin: auto; padding: 30px 10px 30px 10px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: normal; color: #555;}"+
												"@media screen and (max-width: 480px) {.content{padding: 30px 0px 30px 0px;}}</style></head><body><div class='content' >"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height:normal; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;line-height:24px; margin:30px 0px;'>"+
                    "<p>Hi "+user.username+", Thank you for Subscribing,<br>Following are your subscription details"+ 
                "<table cellpadding='0' cellspacing='0'><tr class='heading'><th>Name</th><th>Subscription ID</th><th>Payment Schedule</th><th>Subscription Amount</th>"+
                "</tr> <tr> <td>"+ user.username +"</td> <td>"+transaction_result.subscriptionId+"</td> <td>Payments occur on day "+date.getDate()+" of every month</td>"+
                         "<td>$"+paymentconstants.amount+"</td></tr></table></div> </div></body></html>",}; 
                              
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);


								});
                                create(user);
                                async function create(user) {
									user.password = md5(user.password);
									console.log(user.password)
                                    let result = await repo.create(user);                                    
                                       resolve(result);
                                  
                                }
                            }
                        }
                    });
                });
            
        }
    }
    async updateSubscription(user) {
        let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
            return new Promise((resolve, reject) => {
                updateSubscription.updateSubscription(response.subscription_id, user, function (err, transaction_result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        if (transaction_result.messages.resultCode == "Error") {
                           resolve(transaction_result.messages);
                        }
                        else {
                            user.subscription_status = "active";
                            console.log(response._id);
                            update(user);
                            async function update(user) {
                                let result = await repo.updateById(response._id, user);
                                if (result == true) {
                                    let id = response._id;
                                    let updatedResult = await repo.findById(id);
                                    resolve(updatedResult);
                                }
                            }
                        }
                    }
                });
            });
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
        }
    }
    async getSubscriptionDetails(user) {
       let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
            return new Promise((resolve, reject) => {
                getSubscription.getSubscription(response.subscription_id, function (err, transaction_result) {
                    if (err) {
                        throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
                        reject(err);
                    }
                    else {
                        if (transaction_result.messages.resultCode == "Error") {
                         resolve(transaction_result.messages);

                        }
                        else {
                            resolve(transaction_result);
                        }
                    }
                });
            });
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
        }
    }
    async getSubscriptionStatus(user) {
      let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
            return new Promise((resolve, reject) => {
                getSubscriptionStatus.getSubscriptionStatus(response.subscription_id, function (err, transaction_result) {
                    if (err) {
                        throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
                        reject(err);
                    }
                    else {
                        if (transaction_result.messages.resultCode == "Error") {
                           resolve(transaction_result.messages);
                        }
                        else {
                            resolve(transaction_result);
                        }
                    }
                });
            });
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
        }
    }
    async cancelSubscription(user) {
      let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
            return new Promise((resolve, reject) => {
                cancelSubscription.cancelSubscription(response.subscription_id, function (err, transaction_result) {
                    if (err) {
                        throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
                        reject(err);
                    }
                    else {
                        if (transaction_result.messages.resultCode == "Error") {
                             resolve(transaction_result.messages);
                        }
                        else {
                            user.subscription_status = "inactive";
                            console.log(response._id);
                            update(user);
                            async function update(user) {
                                let result = await repo.updateById(response._id, user);
                                if (result == true) {
                                    let id = response._id;
                                    let updatedResult = await repo.findById(id);
								let mailOptions = {
										from: constants.email, 
										to: response.email, 
										subject: 'Subscription Cancelled',
                                   html:"<!doctype html><html><head><style>"+
											 "table { width: 100%; line-height: inherit; text-align: left; background:#fff; }"+
												"table, th, td {	border: 1px solid black; border-collapse: collapse; }"+
												"th, td {	padding: 7px;		text-align: center;	}"+
												"table tr.top table td {padding-bottom: 20px;}"+
												"</style></head><body><div style='max-width: 800px; margin: auto; padding: 30px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; color: #555;'>"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height: normal; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;line-height: 24px;margin:30px 0px;'>"+
                    "<p>Hi "+response.username+",<br> You have been successfully cancelled your subscription.</p></div> </div></body></html>",
					}; 
                              
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);


								});
                                    resolve(updatedResult);
                                }
                            }
                        }
                    }
                });
            });
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
        }
    }
    async reSubscribe(user) {
		        let data;
       let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)
		        if (response) {
					response.cardnumber = user.cardnumber;
					response.cardcode = user.cardcode;
					response.expiredate = user.expiredate;
					console.log(response)
                return new Promise((resolve, reject) => {
                    createSubscription.createSubscription(response, function (err, transaction_result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            if (transaction_result.messages.resultCode == "Error") {
                             resolve(transaction_result.messages);

                            }
                            else {
								var date = new Date();
                                data = { 
								"cardnumber" : user.cardnumber,
					"cardcode" : user.cardcode,
					"expiredate" : user.expiredate,
					"subscription_id": transaction_result.subscriptionId, "subscription_status": "active" };
                                let mailOptions = {
										from: constants.email, 
										to: response.email, 
										subject: 'Subscription successfully completed',
                                   html:"<!doctype html><html><head><style>"+
											 "table { width: 100%; line-height: inherit; text-align: left; background:#fff; }"+
												"table, th, td {	border: 1px solid black; border-collapse: collapse; }"+
												"th, td {	padding: 7px;		text-align: center;	} .heading{background:#DCDCDC;}"+
												"table tr.top table td {padding-bottom: 20px;} .content{max-width: 800px; margin: auto; padding: 30px 10px 30px 10px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: normal; color: #555;}"+
												"@media screen and (max-width: 480px) {.content{padding: 30px 0px 30px 0px;}}</style></head><body><div class='content' >"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height:normal; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;line-height:24px; margin:30px 0px;'>"+
                    "<p>Hi "+response.username+", Thank you for Subscribing,<br>Following are your subscription details"+ 
                "<table cellpadding='0' cellspacing='0'><tr class='heading'><th>Name</th><th>Subscription ID</th><th>Payment Schedule</th><th>Subscription Amount</th>"+
                "</tr> <tr> <td>"+ response.username +"</td> <td>"+transaction_result.subscriptionId+"</td> <td>Payments occur on day "+date.getDate()+" of every month</td>"+
                         "<td>$"+paymentconstants.amount+"</td></tr></table></div> </div></body></html>",}; 
                              
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);


								});
                                console.log(response._id);
                                update(response);
                                async function update(response) {
                                    let result = await repo.updateById(response._id, data);
                                    if (result == true) {
                                        let id = response._id;
                                        let updatedResult = await repo.findById(id);
                                        resolve(updatedResult);
                                    }
                                }
                            }
                        }
                    });
                });
            }
        }
    async loginUser(user) {
        // let userget = await this.userRepo.find();
		console.log(user)
        if (!user.username)  {
            throw new rest_1.HttpErrors.BadRequest('username is empty');
        }
		if (!user.password){
			            throw new rest_1.HttpErrors.BadRequest('password is empty');
		}
		user.password = md5(user.password);
		console.log(user.password)
        let response = await this.userRepo.find({where: {and: [{or:[{username: user.username},{email:user.username}]}, {password: user.password}]}});
		console.log(response)
        if (response.length > 0) {
            return response[0];
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('email or password is incorrect!!!!');
        }
    }
    async findUserById(id) {
        return await this.userRepo.findById(id);
    }
    async findUser() {
		console.log('result')
        return await this.userRepo.find();
    }
    async replaceUser(id, user) {
        return await this.userRepo.replaceById(id, user);
    }
    async updateUser(id, user) {
        return await this.userRepo.updateById(id, user);
    }
    async deleteUser(id) {
        return await this.userRepo.deleteById(id);
    }
};
__decorate([
    rest_1.post('/users/signup'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    rest_1.post('/users/updateSubscription'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSubscription", null);
__decorate([
    rest_1.post('/users/getSubscriptionDetails'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSubscriptionDetails", null);
__decorate([
    rest_1.post('/users/getSubscriptionStatus'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSubscriptionStatus", null);
__decorate([
    rest_1.post('/users/cancelSubscription'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cancelSubscription", null);
__decorate([
    rest_1.post('/users/reSubscribe'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "reSubscribe", null);
__decorate([
    rest_1.post('/users/login'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    rest_1.get('/users/{id}'),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserById", null);
__decorate([
    rest_1.get('/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUser", null);

__decorate([
    rest_1.put('/users/{id}'),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, models_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "replaceUser", null);
__decorate([
    rest_1.patch('/users/{id}'),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, models_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    rest_1.del('/users/{id}'),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    __param(0, repository_1.repository(repositories_1.UserRepository)),
    __metadata("design:paramtypes", [repositories_1.UserRepository])
], UserController);


new CronJob('0 1 1 2 * *', function() {	
  (async function(){
  var port = config.port;
  const response = await superagent.get('http://localhost:'+port+'/users/')
    response.body.map(function (res, i){
	   return new Promise((resolve, reject) => {
                getSubscriptionStatus.getSubscriptionStatus(res.subscription_id, function (err, transaction_result) {
                    if (err) {
                        throw new rest_1.HttpErrors.BadRequest('subscription_id not found');
                        reject(err);
                    }
                    else {
                        if (transaction_result.messages.resultCode == "Error") {
                         resolve(transaction_result.messages);

                        }
                        else {
							if(transaction_result.status == 'Suspended' )
							{
								var date = new Date()
							let mailOptions = {
										from: constants.email, 
										to: res.email, 
										subject: 'Subscription Suspended',
                                    html:"<!doctype html><html><head><style>"+
											 "table { width: 100%; line-height: inherit; text-align: left; background:#fff; }"+
												"table, th, td {	border: 1px solid black; border-collapse: collapse; }"+
												"th, td {	padding: 7px;		text-align: center;	} .heading{background:#DCDCDC;}"+
												"table tr.top table td {padding-bottom: 20px;} .content{max-width: 800px; margin: auto; padding: 30px 10px 30px 10px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: normal; color: #555;}"+
												"@media screen and (max-width: 480px) {.content{padding: 30px 0px 30px 0px;}}</style></head><body><div class='content' >"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height:normal; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;line-height:24px; margin:30px 0px;'>"+
                    "<p>Hi "+ res.username +", your subscription has been suspended due to your credit card expiration or due to credit limit,<br> Please update credit limit if it is over or else,<br> Update your updated credit card details on the app if your credit card is expired ,<br>Following are your current subscription details"+ 
                "<table cellpadding='0' cellspacing='0'><tr class='heading'><th>Name</th><th>Subscription ID</th><th>Payment Schedule</th><th>Subscription Amount</th>"+
                "</tr> <tr> <td>"+ res.username +"</td> <td>"+res.subscription_id+"</td> <td>Payments occur on day "+date.getDate()+" of every month</td>"+
                         "<td>$"+paymentconstants.amount+"</td></tr></table></div> </div></body></html>",}; 
                              
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);


								});
                            resolve(transaction_result);
							}
							else if(transaction_result.status == 'Terminated'){
								var date = new Date()
								let mailOptions = {
										from: constants.email, 
										to: res.email, 
										subject: 'Subscription Terminated',
                                    html:"<!doctype html><html><head><style>"+
											 "table { width: 100%; line-height: inherit; text-align: left; background:#fff; }"+
												"table, th, td {	border: 1px solid black; border-collapse: collapse; }"+
												"th, td {	padding: 7px;		text-align: center;	}"+
												"table tr.top table td {padding-bottom: 20px;}"+
												"</style></head><body><div style='max-width: 800px; margin: auto; padding: 30px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; color: #555;'>"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height: normal; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;line-height: 24px;margin:30px 0px;'>"+
                    "<p>Hi "+ res.username +", your subscription has been terminated due to your credit card expiration ,<br> Please do resubscription on the app for re-subscribing your account with us."+ 
                    "</div> </div></body></html>",}; 
                              
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);
								});
							}
							else{
								console.log(transaction_result)
							}
                        }
                    }
                });
            });
	})
})();
     
   }, null, true, 'America/Chicago');
   
   
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
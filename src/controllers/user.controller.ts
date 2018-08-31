// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories';
var path = require('path');
const mongodb = require('mongodb');
var createSubscription = require('../../../service/createSubscription')
var updateSubscription = require('../../../service/updateSubscription')
var cancelSubscription = require('../../../service/cancelSubscription')
var getSubscription = require('../../../service/getSubscription')
var getSubscriptionStatus = require('../../../service/getSubscriptionStatus');
var constants = require('../../../constants');
var paymentconstants = require('../../../paymentConfig');
const nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;
var md5 = require('md5');
const config = require("../../../updateport");
const superagent = require('superagent');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: constants.service,
    auth: {
    user: constants.email,
    pass: constants.password
}
});
import { User } from '../models';
import {
  HttpErrors,
  post,
  param,
  requestBody,
  get,
  put,
  patch,
  del,
} from '@loopback/rest';
export class UserController {

  constructor(@repository(UserRepository) protected userRepo: UserRepository) { }
  @post('/users/signup')
  async createUser(@requestBody() user: User) {
    let data;
    if (!user.email) {
      throw new HttpErrors.BadRequest('email is required');
    }
    let response = await this.userRepo.find({ where: { email: user.email } });
    console.log(response)
    if (response.length > 0) {
      throw new HttpErrors.BadRequest('email already exists');
    }
    else {
      let creation_response = await this.userRepo.create(user);
      if (creation_response) {
        let repo = this.userRepo;
        return new Promise((resolve, reject) => {
          createSubscription.createSubscription(user, function (err, transaction_result) {
            if (err) {
              reject(err);
            }
            else {

              if (transaction_result.messages.resultCode == "Error") {
                throw new HttpErrors.BadRequest(transaction_result.messages.message[0].text);
                reject(transaction_result.messages.message[0].text)
              }
              else {
				  	var date = new Date();
                data = { "subscription_id": transaction_result.subscriptionId, "subscription_status": "active" };
                	let mailOptions = {
										from: constants.email, 
										to: user.email, 
										subject: 'Subscription successfully completed',
                                    html:"<!doctype html><html><head><style>"+
											 "table { width: 100%; line-height: inherit; text-align: left; background:#fff; }"+
												"table, th, td {	border: 1px solid black; border-collapse: collapse; }"+
												"th, td {	padding: 7px;		text-align: center;	}"+
												"table tr.top table td {padding-bottom: 20px;}"+
												"</style></head><body><div style='max-width: 800px; margin: auto; padding: 30px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; color: #555;'>"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height: 20px; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;margin:30px 0px;'>"+
                    "<p>Thank you for Subscribing,<br>Following are your subscription details"+ 
                "<table cellpadding='0' cellspacing='0'><tr class='heading'><th>Name</th><th>Subscription ID</th><th>Payment Schedule</th><th>Subscription Amount</th>"+
                "</tr> <tr> <td>"+ user.username +"</td> <td>"+transaction_result.subscriptionId+"</td> <td>Payments occur on day "+date.getDate()+" of every month</td>"+
                         "<td>$"+paymentconstants.amount+"</td></tr></table></div> </div></body></html>",};
                              
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);


								});
                console.log(creation_response._id)
                update(user)
                async function update(user) {
                  let result = await repo.updateById(creation_response._id, data);
                  if (result == true) {
                    let id = creation_response._id;
                    let updatedResult = await repo.findById(id);
                    resolve(updatedResult);
                  }
                }
              }
            }
          })
        })
      }
    }
  }
  @post('/users/updateSubscription')
  async updateSubscription(@requestBody() user: Object) {
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
              throw new HttpErrors.BadRequest(transaction_result.messages.message[0].text);
              reject(transaction_result.messages.message.text);
            }
            else {
              user.subscription_status = "active";
              console.log(response._id)
              update(user)
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

        })
      })
    }
    else {
      throw new HttpErrors.BadRequest('subscription_id not found');
    }
  }

  @post('/users/getSubscriptionDetails')
  async getSubscriptionDetails(@requestBody() user: Object) {
   let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
      return new Promise((resolve, reject) => {
        getSubscription.getSubscription(response.subscription_id, function (err, transaction_result) {
          if (err) {
            throw new HttpErrors.BadRequest('subscription_id not found');
            reject(err);
          }
          else {
            if (transaction_result.messages.resultCode == "Error") {
              throw new HttpErrors.BadRequest(transaction_result.messages.message[0].text);
              reject(transaction_result.messages.message[0].text);
            }
            else {

              resolve(transaction_result);

            }
          }

        })
      })
    }
    else {
      throw new HttpErrors.BadRequest('subscription_id not found');
    }
  }

  @post('/users/getSubscriptionStatus')
  async getSubscriptionStatus(@requestBody() user: Object) {
    let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
      return new Promise((resolve, reject) => {
        getSubscriptionStatus.getSubscriptionStatus(response.subscription_id, function (err, transaction_result) {
          if (err) {
            throw new HttpErrors.BadRequest('subscription_id not found');
            reject(err);
          }
          else {
            if (transaction_result.messages.resultCode == "Error") {
              throw new HttpErrors.BadRequest(transaction_result.messages.message[0].text);
              reject(transaction_result.messages.message[0].text);
            }
            else {

              resolve(transaction_result);

            }
          }

        })
      })
    }
    else {
      throw new HttpErrors.BadRequest('subscription_id not found');
    }
  }

  @post('/users/cancelSubscription')
  async cancelSubscription(@requestBody() user: Object) {
   let repo = this.userRepo;
       let id = new mongodb.ObjectID(user.user_id);
	    console.log(id)
        let response = await this.userRepo.findById(id); 
		console.log(response._id)		
        if (response) {
      return new Promise((resolve, reject) => {
        cancelSubscription.cancelSubscription(response.subscription_id, function (err, transaction_result) {
          if (err) {
            throw new HttpErrors.BadRequest('subscription_id not found');
            reject(err);
          }
          else {
            if (transaction_result.messages.resultCode == "Error") {
              throw new HttpErrors.BadRequest(transaction_result.messages.message[0].text);
              reject(transaction_result.messages.message[0].text);
            }
            else {

              user.subscription_status = "inactive";
              console.log(response._id)
              update(user)
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
                              "<h1 style='width:100%; line-height: 20px; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;margin:30px 0px;'>"+
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

        })
      })
    }
    else {
      throw new HttpErrors.BadRequest('subscription_id not found');
    }
  }
 @post('/users/reSubscribe')
  async reSubscribe(@requestBody() user: Object) {
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
                                throw new rest_1.HttpErrors.BadRequest(transaction_result.messages.message[0].text);
                                reject(transaction_result.messages.message[0].text);
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
												"th, td {	padding: 7px;		text-align: center;	}"+
												"table tr.top table td {padding-bottom: 20px;}"+
												"</style></head><body><div style='max-width: 800px; margin: auto; padding: 30px; border: 1px solid #808080; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; color: #555;'>"+
                                                "<div style=' margin-bottom: 30px; text-align: center'>"+
                              "<h1 style='width:100%; line-height: 20px; display: block;text-align:center; margin: 0 auto;'>"+constants.appName+"</h1> "+ 
                    "</div><hr><div style='text-align: center;margin:30px 0px;'>"+
                    "<p>Thank you for Subscribing,<br>Following are your subscription details"+ 
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


  @post('/users/login')
  async loginUser(@requestBody() user: Object): Promise<object> {
    // let userget = await this.userRepo.find();
    if (!user.email && !user.password) {
      throw new HttpErrors.BadRequest('email or password is empty');
    }

    let response = await this.userRepo.find({ where: { email: user.email } })
    if (response.length > 0) {
      return response[0]
    }
    else {
      throw new HttpErrors.BadRequest('email or password is incorrect!!!!');
    }
  }

  @get('/users/{id}')
  async findUserById(@param.path.number('id') id: string): Promise<User> {
    return await this.userRepo.findById(id);
  }

  @get('/users')
  async findUser(): Promise<User[]> {
    return await this.userRepo.find();
  }

  @put('/users/{id}')
  async replaceUser(
    @param.path.number('id') id: string,
    @requestBody() user: User,
  ): Promise<boolean> {
    return await this.userRepo.replaceById(id, user);
  }

  @patch('/users/{id}')
  async updateUser(
    @param.path.number('id') id: string,
    @requestBody() user: User,
  ): Promise<boolean> {
    return await this.userRepo.updateById(id, user);
  }

  @del('/users/{id}')
  async deleteUser(@param.path.number('id') id: string): Promise<boolean> {
    return await this.userRepo.deleteById(id);
  }

}


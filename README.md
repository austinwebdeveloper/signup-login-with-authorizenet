## Signup Login with Authorize.net 
The signup-login-with-authorizenet module is a Node.js with loopback framework script and it provides a fastest way to create user signup and login services with authentication and payment subscription with Authorize.net.


## Pre-requisites
Node.js , and the platform-specific tools needed to compile native NPM modules (which you may already have):

## Installation

To install the signup-login-with-authorizenet module, simply run the following command within your app's directory:

```sh
npm i  signup-login-with-authorizenet --save
```

## Development

```sh
var loopback = require("signup-login-with-authorizenet");
```
### Database Configuration:

```sh
var dbConfig = {
    "name":""	
	"host": "",
    "port": ,
    "url": "",
    "database": "",
    "password": "",
    "user": "",
    "connector": "" // connector name ex. mongodb or mysql
};

loopback.config.datasourceset(dbConfig);
```

#### Must follow below model properties configuration for payment integration with Authorize.net 

### Model Configuration:

```sh
var modelConfig = {
"properties":[
    {
    "name": "firstname",
      "type": "string",   
      "required": true
      },
     {
    "name": "lastname",
      "type": "string",
      "required": true
	  },
	  {
	  "name": "username",
      "type": "string",   
      "required": true
      },
	  {
	  "name": "email",
      "type": "string",   
      "required": true
      },
     {
    "name": "password",
      "type": "string",
      "required": true
	  },
     {
    "name": "address",
      "type": "string",
      "required": false
	  },
	  {
	  "name": "city",
      "type": "string",   
      "required": false
      },
     {
    "name": "state",
      "type": "string",
      "required": false
	  },
     {
    "name": "country",
      "type": "string",
      "required": false
	  },
     {
    "name": "zip",
      "type": "number",
      "required": false
	  },
	  {
	  "name": "phone",
      "type": "number",   
      "required": false
      },
     {
    "name": "cardcode",
      "type": "number",
      "required": true
	  },
     {
    "name": "expiredate",
      "type": "string",
      "required": true
	  },
     {
    "name": "cardnumber",
      "type": "number",
      "required": true
	  },
	  {
    "name": "subscription_id",
      "type": "string",
      "required": false
	  },
	  {
    "name": "subscription_status",
      "type": "string",   
      "required": false
	  } 
    
]}
loopback.modelConfiguration.modelConfiguration(modelConfig);
```

### Set Authorize.net keys

##### Note: if you haven't created keys,...follow  https://support.authorize.net/s/article/How-do-I-obtain-my-API-Login-ID-and-Transaction-Key

```sh 
var authorizekeys = {
    "apiLoginKey":"",  //Authorize.net APIloginkey
    "transactionKey":""  //Authorize.net transactionKey
} 
loopback.paymentKeysConfig.paymentKeysConfig(authorizekeys)
 ```

###  Authorize.net Merchant Details config

```sh 
var paymentconfig = {
    "amount":"50",  // Amount of subscription
    "trail_amount":"0", // Trail Amount of subscription
    "interval_length":"1", // The measurement of time, in association with unit, that is used to define the frequency of the billing occurrences.(For a unit of days, use an integer between 7 and 365, inclusive. For a unit of months, use an integer between 1 and 12, inclusive.)
    "interval_unit":"months" // The unit of time, in association with the length, between each billing occurrence.(days or moths)
} 
loopback.paymentConfiguration.paymentConfiguration(paymentconfig)
 ```
###  Set mail service and login details  for configuring nodemailer module
```sh 
var emailkeys = {
    "service":"" , // Gmail or Yahoo
	"email":"",  // if gmail(ex:abc@gmail.com)
	"password":"",   // email password
	"appName":"" // your application name for email title

} 
loopback.constants.constants(emailkeys) 
```

###  Update server port 
```sh  
var port = {
    "port":	 // default server will run on port 3000
} 
loopback.updatePort.configPort(port) 
```
#### Include following code in your index file:
 
```sh 
loopback.getstart();
```

#### Run following in your terminal to start the APP:
 
```sh 
 npm start
``` 
 
Verify the deployment by navigating to your server address in your preferred browser.


```sh
http://localhost:3000/ping
POST Services:
http://localhost:3000/users/signup //Signup and subscription creation will be happend with this service
http://localhost:3000/users/login   // Login will be done with email and password or username and password
{

   "username": "",  // Note: Key is username, value will be username or email
  "password":""
}
http://localhost:3000/users/updateSubscription 

example:

{
  "expiredate": "2025-08",
  "cardcode": 123,
  "cardnumber": 4111111111111111,
  "user_id":"" 
}

http://localhost:3000/users/getSubscriptionStatus

example:

{
  "user_id":"" 
}

http://localhost:3000/users/getSubscriptionDetails

example:

{
  "user_id":"" 
}

http://localhost:3000/users/cancelSubscription

example:

{
  "user_id":"" 
}

Get Services:

http://localhost:3000/users/
http://localhost:3000/users?id=  // get user by id service, pass id here


``` 

#Licence
MIT
 
 

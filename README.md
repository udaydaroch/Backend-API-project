# API Server (Petition Site)

## Running locally

1. Use `npm install` to populate the `node_modules/` directory with up-to-date packages
2. Create a file called `.env`, following the instructions in the section below
3. Go to phpMyAdmin have an account and create a database with the name that you set in the `.env` file
2. Run `npm run start` or `npm run debug` to start the server
3. The server will be accessible on `localhost:4941`

### `.env` file

Create a `.env` file in the root directory of this project including the following information (note that you will need
to create the database first in phpMyAdmin):

For example:
SENG365_MYSQL_HOST={hostname}
SENG365_MYSQL_USER={your usercode}
SENG365_MYSQL_PASSWORD={your password}
SENG365_MYSQL_DATABASE={a database name}


## Some notes about endpoint status codes

| Status Code | Status Message        | Description                                                                   | Example                                          |
|:------------|-----------------------|-------------------------------------------------------------------------------|--------------------------------------------------|
| 200         | OK                    | Request completed successfully                                                | Successfully get petitions                       |
| 201         | Created               | Resources created successfully                                                | Successfully create a petition                   |
| 400         | Bad Request           | The request failed due to client error                                        | Creating a petition without a request body       |
| 401         | Unauthorised          | The requested failed due invalid authorisation                                | Creating a petition without authorisation header |
| 403         | Forbidden             | The request is refused by the server                                          | Trying to delete someone else's petition         |
| 500         | Internal Server Error | The request causes an error and cannot be completed                           |                                                  |
| 501         | Not Implemented       | The request can not be completed because the functionality is not implemented |                                                  | 

A Postman collection has been provided in the `postman` folder, you can easily import this (and the specific
environment variables) to test your assignment as you work on it. 

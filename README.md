# Test-CRUD-API

## Getting Started

### Project Setup
Once you clone or download project go into you folder

To start app you need to run following command
> docker-compose up --build -d

It will start api with database in docker containers with network connection between them and create default database tables.  

## Middlewares
```
> ApiAuth this will check user access token that we have return in login response.
```

## Routing files
> Currently we have added 3 routing files 
```
> pub.js   # public routing access everyone can access this APIs
> api.js   # only logged in user/ with vaild token user can access this routes
```
## Example APIs
>here attached link of postman collection you can download and check in local
> https://www.getpostman.com/collections/d5afafb2fe173ef3f057



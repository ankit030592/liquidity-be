# liquidity-be

## Pre-Requisites ##
node version 12.x
mysql version 5.7
mongodb


```
#!shell
nvm install 12.13.0
nvm use 12.13.0
npm install -g mysql
npm install -g sequelize-auto

```

# CODE SETUP #
## Get the repository ##
```
#!shell
git clone https://github.com/ankit030592/liquidity-be.git

```

## Install packages ##

```
#!shell

npm install

```

# DB SETUP IN LOCAL#
## Login to mysql ##


```
#!shell

mysql -u root -p
create user 'liquidity'@'localhost' identified by 'liquidity';
drop database liquidity;
create database liquidity;
grant all privileges on liquidity.* to 'liquidity'@'localhost' with grant option;
exit;
mysql -u liquidity -pliquidity liquidity < db/liquidity.sql;
```

## If you would like to re-generate the models from the DB, run the below ##

```
#!shell

sequelize-auto -o "./models" -d liquidity -h localhost -u liquidity -p 3306 -x liquidity -e mysql

```

# RUN #
## Start server on command line ##

```
#!shell

PORT=3000 NODE_ENV=development DEBUG=liquidity:* npm start

```

## Start server on command line as a background process ##

```
#!shell

PORT=3000 NODE_ENV=development DEBUG=liquidity:* forever start bin/www 

```
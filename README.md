# Task Manager

This is backend for intership project

## Local env requirements

- Node.js 16
- PostgreSQL 14

## Setup local

1. Create the database:

    ```

    psql postgres
    create user intershipuser with password '1234';
    alter user intershipuser with superuser;
    create database testdb with owner = intershipuser;
    grant all privileges on database testdb to intershipuser;
    alter user intershipuser createdb;
    exit

    ```

1. Istall modules `npm install`
2. Create `.env` file based on `.env.examle`
3. Run server `npm run start`
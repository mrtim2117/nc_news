# Tim's News API

## Background

Welcome to Tim's News API! The first of several learning projects undertaken on my journey back to the wonderful world of software development. Please feel free to explore the hosted version. Click on the link below to investigate the endpoints currently provided, and where to find them:

https://tims-nc-news.herokuapp.com/api

Note: This is a living, breathing project, and further endpoints will be added as time progresses.

The the underlying database consists of a small number of relational tables hosted in Postgress. This is fronted with api code written in JavaScript, targetting Node.js. Connectivity between the two layers is implemented using [node-postgres](https://node-postgres.com/).

Please follow the instructions below to clone the repo, then build and test your own version of the api.

Minimum version requirements:

- `Node.js` v16.10.0
- `Postgres` v12.9

## Step 1 - Cloning the Project

Start a terminal session (assuming you have git installed) and issue the following command to clone the repo:

git clone https://github.com/mrtim2117/nc_news.git

To ensure you have the latest code at any point in time, simply navigate to your local project folder containing the above clone, then enter the following command from your terminal session:

`git pull origin main`

## Step 2 - Install Dependencies

From the root of your project folder above, issue the command

`npm install`

This will install development and runtime dependencies:

**Dev (& test) dependencies:**

- `jest`
- `jest-sorted`
- `supertest`

**Runtime dependencies**

- `pg`
- `pg-format`
- `dotenv`
- `express`

## Step 3 - Initialise Database Connectivity

Two separate .env files are needed for their respective databases:

- `.env.development`
- `.env.test`

Use the included `.env-example` to help here

## Step 4 - Seed Your Databases

From the root project folder, create the empty development and test databases by issuing the following command:

`npm setup-dbs`

To then create the tables and populate them in the development database (test database follows...) issue the following command:

`npm seed`

It's now worth starting a PSQL cli session to inspect the contents of the development database you've just populated.

## Step 5 - Running the Tests

At the start of each test run, all tables are dropped from the test database, re-created and re-populated with fresh test data. All tests are defined in the `app.test.js` file, and are executed by issuing the following command from the root project folder:

`npm test`

Have fun, and come back soon for the latest updates...

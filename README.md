# CRUD App

This is a CRUD (Create, Read, Update, Delete) application built with React js, Nodejs, Express, and MySQL.

<br>

# Project Demo

<br>
<br>

## Folder Structure

```bash
vahan-project/
|-- client/
| |-- src/
| |-- public/
| |-- .env <-- Client's .env file
|
|-- server/
| |-- src/
| |-- uploads/
| |-- .env <-- Server's .env file
|
|-- .gitignore
|-- README.md
```

# Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MySQL installed and running.

Now clone the repository to your local desktop

<br>

## Cloning command

```
git  clone <repository url>
```

## Frontend

```bash
# Navigate to the frontend directory:
cd client

# Install dependencies:
npm install

```

## Backend

```bash
# Navigate to the backend directory:
cd server

# Install dependencies:
npm install

```

<br>
<br>

Before running the server and react app, please set-up the MySQL connection from MySQL Workbench.

<br>

## Go to MySQL workbench and make a database named crud_app using query

```bash
create database crud_app;
use crud_app;

```

# to show table data write query -

```bash
select * from users;
```

<br>

## Environment variables

# For the client-side, you'll need to create a .env file in the client directory with the following content:

```bash
REACT_APP_API_BASE_URL=http://localhost:3001
```

# For the server-side, you'll need to create a .env file in the server directory with the following content:

```bash
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
```

## Now run both the server and client react app by writing command in terminal

```bash
npm start
```

tip(use the split terminal to see both running...)

<br>

## If any error while running, please mail me at

```bash
dorbihimanshu306@gmail.com
```

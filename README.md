# Node.js RESTful API 
A Node.js RESTful API tutorial project with authorization and JWT route protection as seen on [Academind](https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q).

## Getting Started 

### Prerequisites

You will need the following installed on your system
* [Node and NPM](https://nodejs.org)
* [Git](https://git-scm.com/)

### Installation

Clone the repo and install the dependencies in the command line:
```
npm install
```
Rename `nodemon.json-sample` to `nodemon.json` and add your MongoDB connection and JWT key to the environment variables:
```json
{
  "env": {
    "MONGO_DB_CONNECTION" : "yourDBConnection",
    "JWT_KEY" : "yourSecret"
  }
}
```
Then start the server:
```
npm run start
```

## Built with
- Node.js and Express
- MongoDB and Mongoose
- JWT
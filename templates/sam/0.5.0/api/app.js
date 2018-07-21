const bodyParser = require('body-parser')
const cors = require('cors');

const app = require('express')();
const healthcheck = require('./healthcheck');
const user = require('./user');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/healthcheck", healthcheck);
app.use("/user", user);

module.exports = app;
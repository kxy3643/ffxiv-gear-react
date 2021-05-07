const path = require('path');
require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');

const port = process.env.PORT || 3001;
const dbURL = process.env.MONGODB_URI;
const redisLocalURL = process.env.REDIS_URL;
const redisLocalPORT = process.env.REDIS_PORT;
let redisPASS = process.env.REDIS_PASS;

const app = express();

const controllers = require('./src/controllers');
const mid = require('./src/middleware');

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

let redisURL = {
    hostname: redisLocalURL,
    port: redisLocalPORT,
};

if (process.env.REDISCLOUD_URL) {
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    [, redisPASS] = redisURL.auth.split(':');
}
const redisClient = redis.createClient({
    host: redisURL.hostname,
    port: redisURL.port,
    password: redisPASS,
});

mongoose.connect(dbURL, mongooseOptions, (err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
});  

app.disable('x-powered-by');
app.use(compression());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(session({
    key: 'sessionid',
    store: new RedisStore({
    client: redisClient,
    }),
    secret: 'Monday2Chest',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));

//CSRF goes after Parsers
app.use(csrf());
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
  
    console.log('Missing CSRF token');
    return false;
});


app.get('/getTopDPS', (req, res) => {
    return controllers.Api.getRanking().then((data) => {
        if(data === null){
            return res.status(504).json({message: 'FFlogs API Error'});
        }
        return res.status(200).json(data);
    }).catch(() => {
        return res.status(504).json({message: 'FFlogs API Error'});
    });
});

app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
app.post('/login', mid.requiresSecure, controllers.Account.login);
app.post('/signup', mid.requiresSecure, controllers.Account.signup);
app.get('/logout', mid.requiresSecure, controllers.Account.logout);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => {
  //console.log(`app listening on port ${port}`);
});
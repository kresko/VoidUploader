const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require("./passportConfig");
const app = express();
const path = require('node:path');
const assetsPath = path.join(__dirname, 'public');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const authRouter = require('./routes/authRouter');
const indexRouter = require("./routes/indexRouter");

app.use('/', express.static(assetsPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: 'a santa at nasa',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);
app.use(passport.session());
passportConfig(passport);

app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log("Listening on port " + port);
});
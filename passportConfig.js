const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/queryHandler");
const bcrypt = require("bcryptjs");

async function passportConfig(passport) {
    // Configure LocalStrategy
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await db.getUsersByUsername(username); //zameni metode za prismu

                if (!user) {
                    return done(null, false, { message: "Incorrect username" });
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    // Configure serializeUser
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Configure deserializeUser
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.getUsersById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = passportConfig;
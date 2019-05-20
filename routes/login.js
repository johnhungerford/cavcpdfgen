const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/', function(req, res, next) {
    console.log('Logging in...');
    console.log(req.session);

    if (req.body.logout) {
        req.session.destroy();
        return res.json({ success: true });
    }

    console.log('authenticating credentials');
    const username = req.body.username;
    const password = req.body.password;
    console.log(`username: ${username}; password: ${password}`);


    if (username === undefined || password === undefined) {
        return res.json({
            success: false,
            message: 'missing username or password',
        });
    }

    global.mysql.query(`SELECT * FROM users WHERE username="${username}"`, function (err2, resQuery) {
        if (err2) {
            return res.json({
                success: false,
                message: 'unable to query credentials',
            });
        }

        console.log('queried: ', resQuery);
        if (resQuery.length === 0) {
            return res.json({
                success: false,
                message: 'invalid username or password',
            });
        }

        bcrypt.compare(password, resQuery[0].password, (err3, resBcrypt) => {
            if (err3) {
                return res.json({
                    success: false,
                    message: 'unable to perform encryption comparison',
                });
            }

            console.log('bcrypted: ', resBcrypt);
            if (resBcrypt) {
                console.log('bcrypt success callback');
                jwt.sign(
                    { 
                        user: {
                            username: username,
                            fullname: resQuery[0].fullname,
                            title: resQuery[0].title,
                            office: resQuery[0].office,
                            street: resQuery[0].street,
                            city: resQuery[0].city,
                            state: resQuery[0].state,
                            zip: resQuery[0].zip,
                            phone: resQuery[0].phone,
                            email: resQuery[0].email,
                            id: resQuery[0].id,
                        }
                    }, 
                    global.jwtSecret,
                    { expiresIn: '3h' },
                    (err4, token) => {
                        if (err4) {
                            return res.json({
                                success: false,
                                message: 'unable to generate token',
                            });
                        }

                        console.log('ID ... ' + resQuery[0].id);
                        req.session.webloadertoken = token;
                        return res.json({
                            success: true,
                            username: username,
                            id: resQuery[0].id,
                        });
                    }
                );

                return;
            }

            return res.json({
                success: false,
                message: 'invalid username or password',
            });
        });
    });
});

router.post('/register', function(req, res, next) {
    console.log(`/login/register router:\n\t Username: ${req.body.username}`);
    if (
        req.body.username === undefined ||
        req.body.username === null ||
        req.body.username.length < 6 ||
        req.body.username.search(';') > -1 ||
        !/^[A-Za-z0-9_-]+$/.test(req.body.username)
    ) return res.json({ success: false, message: 'Missing or invalid username' });

    if (
        req.body.password === undefined ||
        req.body.password === null ||
        req.body.password.length < 8 ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&~])/.test(req.body.password)
    ) return res.json({ success: false, message: 'Missing or invalid password' });

    const reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (
        req.body.email === undefined ||
        req.body.email === null ||
        !reEmail.test(req.body.email)
    ) return res.json({ success: false, message: 'Missing or invalid email'})

    global.mysql.query(
        `SELECT EXISTS(SELECT * FROM users WHERE username="${req.body.username}");`,
        (errValidate, resValidate) => {
            if (errValidate) return res.json({ success: false, message: 'Unable to validate user', err: errValidate });
            let valid = false;
            for (let i in resValidate[0]) {
                if (resValidate[0].hasOwnProperty(i) ) {
                    if (typeof(resValidate[0][i]) === 'number' && resValidate[0][i] === 0) {
                        valid = true;
                    } 
                }
            }

            if (!valid) return res.json({ success: false, message: 'User already exists!', data: resValidate[0]}); 
            bcrypt.hash(req.body.password, 12, function(errHash, resHash) {
                if (errHash) return res.json({ success: false, message: 'Unable to encrypt password' , err: errHash});
                global.mysql.query(
                    `INSERT INTO users SET ?`,
                    {
                        username: req.body.username,
                        password: resHash,
                        email: req.body.email,
                        phone: req.body.phone,
                        fullname: req.body.fullname,
                        title: req.body.title,
                        office: req.body.office,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                    },
                    (errInsert, resInsert) => {
                        if (errInsert) return res.json({ success: false, message: 'Unable to create user', err: errInsert});
                        return res.json({ success: true, data: resInsert });
                    }
                );
            });
        }
    );
});

router.get('/test', (req, res, next) => {
    const token = req.session.webloadertoken;
    if (token === undefined || token === null) {
        return res.json({
            success: false, 
            message: 'no token'
        });
    }

    jwt.verify(
        token, 
        global.jwtSecret, 
        {
            algorithms: 'HS256',
            maxAge: '3h',
        },
        (err, decoded)=>{
            if (err) return res.json({
                success: false, 
                message: `bad token: ${err.message}`
            });
            
            if (decoded.username === undefined) return res.json({
                success: false,
                message: 'token is missing username...',
            });

            return res.json({success: true, token: decoded});
        });
});

module.exports = router;

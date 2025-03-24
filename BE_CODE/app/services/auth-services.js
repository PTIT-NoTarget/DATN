const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const configuration = require("../config/config-jwt");
const {status} = require("express/lib/response");
const database = require("../models");
const User = database.user;


exports.signup = (req, res) => {
    validateRequest(req);

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        fullName: req.body.fullName,
        sex: req.body.sex,
        dob: req.body.dob,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        position: req.body.position,
        avatarUrl: req.body.avatarUrl,
        role: req.body.role,
        position_1: req.body.position_1,
        position_level: req.body.position_level,
        start_date: req.body.start_date,
    })
        .then(res.send({ message: "User successfully registered" }))
        .catch((exception) => {
            res.status(500).send({ message: exception.message });
        });
};

exports.signin = (req, res) => {
    validateRequest(req);

    User.findOne({
        where: {
            username: req.body.username,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found",
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid password!",
                });
            }

            // Set expired token in 10 minutes
            var token = jwt.sign({ id: user.id }, configuration.secret, {
                expiresIn: 86400,
            });

            user.then(
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    accessToken: token,
                })
            );
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

function validateRequest(req) {
    if (!req.body) {
        status(400).send({
            message: "Request can't be empty!",
        });

    }
}

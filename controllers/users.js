const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const { defineAbilityFor } = require('../utilities/permissions');

async function create(req, res, next) {
    const { name, lastName, email, password, roles } = req.body;
    const rolesArray = JSON.parse(roles).map((id) => {
        return mongoose.Types.ObjectId(id);
    });
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, lastName, email, password: passwordHash, salt, roles: rolesArray });

    const currentUser = req.auth.data.user;
    const ability = defineAbilityFor(currentUser);

    if (ability.cannot('CREATE', 'User')) {
        res.status(403).json({
            msg: "User couldn't be created",
            obj: {},
        });
        return;
    }
    
    
    user.save().then((obj) => {
        res.status(200).json({
            msg: 'User correctly created',
            obj: obj,
        });
    }).catch((exc) => {
        res.status(500).json({
            msg: "User couldn't be created",
            obj: exc,
        })
    });
}

function list(req, res, next) {
    const currentUser = req.auth.data.user;
    const ability = defineAbilityFor(currentUser);

    if (ability.cannot('LIST', 'User')) {
        res.status(403).json({
            msg: "User couldn't be listed",
            obj: {},
        });
        return;
    }
    
    User.find().then((obj) => {
        res.status(200).json({
            msg: 'Users list',
            obj: obj,
        });
    }).catch((exc) => {
        res.status(500).json({
            msg: "User couldn't be listed",
            obj: exc,
        })
    });
}

function index(req, res, next) {
    const { id } = req.params;

    const currentUser = req.auth.data.user;
    const ability = defineAbilityFor(currentUser);

    if (ability.cannot('READ', 'User')) {
        res.status(403).json({
            msg: "User couldn't be readed",
            obj: {},
        });
        return;
    }

    User.findOne({ _id: id }).then((obj) => {
        res.status(200).json({
            msg: `User ${id}`,
            obj: obj,
        });
    }).catch((exc) => {
        res.status(500).json({
            msg: `User  ${id} couldn't be recovered`,
            obj: exc,
        })
    });
}

function replace(req, res, next) {
    const { id } = req.params;
    const { name, lastName, email, password } = {
        name: req.body.name || "",
        lastName: req.body.lastName || "",
        email: req.body.email || "",
        password: req.body.password || "",
    }
    const user = new Object({
        _name: name,
        _lastName: lastName,
        _email: email,
        _password: password
    });

    const currentUser = req.auth.data.user;
    const ability = defineAbilityFor(currentUser);

    if (ability.cannot('REPLACE', 'User')) {
        res.status(403).json({
            msg: "User couldn't be replaced",
            obj: {},
        });
        return;
    }

    User.findOneAndUpdate({ _id: id }, user, { new: true }).then((obj) => {
        res.status(200).json({
            msg: `User ${obj.id} updated`,
            obj: obj,
        });
    }).catch((exc) => {
        res.status(500).json({
            msg: `User  ${obj.id} couldn't be updated`,
            obj: exc,
        })
    });
}

function update(req, res, next) {
    const { id } = req.params;
    const { name, lastName, email, password, roles } = {
        name: req.body.name || undefined,
        lastName: req.body.lastName || undefined,
        email: req.body.email || undefined,
        password: req.body.password || undefined,
        roles: JSON.parse(req.body.roles).map((id) => {
            return new mongoose.Types.ObjectId(id);
        }),
    }
    const user = new Object({
        ...{
            _name: name,
            _lastName: lastName,
            _email: email,
            _password: password,
            _roles: roles,
        }
    });
    console.log(user);

    const currentUser = req.auth.data.user;
    const ability = defineAbilityFor(currentUser);
    console.log(ability.can('UPDATE', 'User'));
    if (ability.cannot('UPDATE', 'User')) {
        res.status(403).json({
            msg: "User couldn't be updated",
            obj: {},
        });
        return;
    }

    User.findOneAndUpdate({ _id: id }, user, { new: true }).then((obj) => {
        res.status(200).json({
            msg: `User ${id} updated`,
            obj: obj,
        });
    }).catch((exc) => {
        res.status(500).json({
            msg: `User  ${id} couldn't be updated`,
            obj: exc,
        })
    });
}

function destroy(req, res, next) {
    const { id } = req.params;

    const currentUser = req.auth.data.user;
    const ability = defineAbilityFor(currentUser);

    if (ability.cannot('DELETE', 'User')) {
        res.status(403).json({
            msg: "User couldn't be deleted",
            obj: {},
        });
        return;
    }

    User.findByIdAndDelete({ _id: id }).then((obj) => {
        res.status(200).json({
            msg: `User ${id} deleted`,
            obj: obj,
        });
    }).catch((exc) => {
        res.status(500).json({
            msg: `User  ${id} couldn't be deleted`,
            obj: exc,
        })
    });
}

module.exports = { create, list, index, replace, update, destroy }
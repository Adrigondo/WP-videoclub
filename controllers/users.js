const express = require('express');

function create(req, res, next) {
    res.send('Users create');
}

// params by header = req.params.{name}
// params by body = req.body.{name}
// params by body = req.body.{name}
function list(req, res, next) {
    res.send('Users list');
}

function index(req, res, next) {
    // console.log(req);
    res.send(`Users index ${req.params.id}`);
}

function replace(req, res, next) {
    res.send(`Users replace ${req.params.id}`);
}

function update(req, res, next) {
    res.send(`Users update ${req.params.id}`);
}

function destroy(req, res, next) {
    res.send(`Users destroy ${req.params.id}`);
}

module.exports={create, list, index, replace, update, destroy}
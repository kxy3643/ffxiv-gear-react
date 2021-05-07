const models = require('../models');

const { Team } = models;

const addTeam = (request, response) => {
    const req = request;
    const res = response;
    const body = req.body;

    let status = 201;
    const responseJSON = {
        message: 'No classes selected!',
    };

    
}
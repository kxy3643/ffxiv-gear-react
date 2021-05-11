const models = require('../models');

const { Team } = models;

const addTeam = (request, response) => {
    const req = request;
    const res = response;
    const body = req.body;

    console.log(body);

    if (!body.name || !body.contact) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const teamInfo = {
        name: body.name,
        contact: body.contact,
        t1: body.t1,
        t2: body.t2,
        h1: body.h1,
        h2: body.h2,
        d1: body.d1,
        d2: body.d2,
        d3: body.d3,
        d4: body.d4,
        owner: req.session.account._id,
    }

    Team.TeamModel.findByName(body.name, (data) => {
        if(!data) return res.status(400).json({ error: 'Team name has been taken!' });
    })

    const newTeam = new Team.TeamModel(teamInfo);

    //const teamPromise = newTeam.save();
}


module.exports.addTeam = addTeam;

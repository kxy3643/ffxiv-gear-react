const models = require('../models');

const { Team } = models;

const addTeam = (request, response) => {
    const req = request;
    const res = response;
    const body = req.body;

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

    Team.TeamModel.findByName(body.name).then((data)=>{
        if(data[0] !== undefined){
            return res.status(400).json({ error: 'Team name has been taken!' });
        }
        else{
            const newTeam = new Team.TeamModel(teamInfo);

            const teamPromise = newTeam.save();
        
            teamPromise.catch((err) => {
                if (err.code === 11000) {
                  return res.status(400).json({ error: 'Team already existes' });
                }
        
                return res.status(400).json({ error: 'An error occurred' });
            });

            return res.status(201).json({message: 'Team created'});
        }
    });

    return true;
}


const findTeam = (request, response) => {
    const req = request;
    const res = response;
    const body = req.body;


}


module.exports.addTeam = addTeam;

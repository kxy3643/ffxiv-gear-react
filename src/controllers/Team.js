const models = require('../models');

const { Team } = models;

const addTeam = (request, response) => {
  const req = request;
  const res = response;
  const { body } = req;

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
  };

  Team.TeamModel.findByName(body.name).then((data) => {
    if (data[0] !== undefined) {
      return res.status(400).json({ error: 'Team name has been taken!' });
    }

    const newTeam = new Team.TeamModel(teamInfo);

    const teamPromise = newTeam.save();

    teamPromise.catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Team already existes' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return res.status(201).json({ message: 'Team created' });
  });

  return true;
};

const getTeam = (request, response) => {
  const req = request;
  const res = response;

  if (req.session.account === undefined) {
    return res.status(302).json({ teams: [] });
  }

  Team.TeamModel.findByOwner(req.session.account._id).then((data) => {
    if (data.length === 0) {
      return res.status(302).json({ teams: [] });
    }

    const responseJSON = {
      teams: data,
    };
    return res.status(302).json(responseJSON);
  });

  return true;
};

const deleteTeam = (request, response) => {
  const req = request;
  const res = response;
  const { body } = req;

  if (req.session.account === undefined) {
    return res.status(403).json({ error: 'Please login first!' });
  }

  Team.TeamModel.findByName(body.name).then((data) => {
    if (data.length === 0) {
      return res.status(400).json({ error: 'Team does not exist!' });
    }

    if (toString(data[0].owner) !== toString(req.session.account._id)) {
      return res.status(401).json({ error: 'This is not your team!' });
    }

    Team.TeamModel.deleteByName(body.name).then((data1) => {
      if (data1.deletedCount === 1) {
        return res.status(302).json({ error: 'Team deleted' });
      }

      return res.status(404).json({ error: 'Team not found' });
    });

    return true;
  });

  return true;
};

const deleteAdmin = (request, response) => {
  const req = request;
  const res = response;
  const { body } = req;

  if (req.session.account === undefined) {
    return res.status(403).json({ error: 'Please login first!' });
  }

  Team.TeamModel.findByName(body.name).then((data) => {
    if (data.length === 0) {
      return res.status(400).json({ error: 'Team does not exist!' });
    }

    if (req.session.account.username === 'ykc200'
            || req.session.account.username === 'tony') {
      Team.TeamModel.deleteByName(body.name).then((data1) => {
        if (data1.deletedCount === 1) {
          return res.status(302).json({ error: 'Team deleted' });
        }

        return res.status(404).json({ error: 'Team not found' });
      });
    } else {
      return res.status(401).json({ error: 'You do not access to this function!' });
    }
    return true;
  });

  return true;
};

const getAllTeams = (request, response) => {
  const req = request;
  const res = response;

  if (req.session.account === undefined) {
    return res.status(403).json({ error: 'Please login first!' });
  }

  if (req.session.account.username === 'ykc200'
    || req.session.account.username === 'tony') {
    Team.TeamModel.findAll().then((data) => {
      if (data.length === 0) {
        return res.status(302).json({ teams: [] });
      }

      const responseJSON = {
        teams: data,
      };
      return res.status(302).json(responseJSON);
    });
  } else {
    return res.status(401).json({ error: 'You do not access to this list!' });
  }

  return true;
};

const search = (request, response) => {
  const req = request;
  const res = response;
  const { query } = req;

  if (req.session.account === undefined) {
    return res.status(403).json({ error: 'Please login first!' });
  }

  if (query === null) {
    return res.status(400).json({ error: 'Please enter a class!' });
  }

  Team.TeamModel.findAll().then((data) => {
    if (data.length === 0) {
      return res.status(302).json({ teams: [] });
    }

    const indexList = [];

    let iteration = 0;

    if (query.class === 'h' || query.class === 't') {
      iteration = 2;
    } else {
      iteration = 4;
    }

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 1; j < iteration + 1; j += 1) {
        const searchClass = query.class + j;
        if (data[i][searchClass] === 18) {
          indexList.push(i);
          break;
        }
      }
    }

    if (indexList.length === 0) {
      return res.status(302).json({ teams: [] });
    }
    const responseJSON = {
      teams: [],
    };
    for (let i = 0; i < indexList.length; i += 1) {
      responseJSON.teams.push(data[indexList[i]]);
    }
    return res.status(302).json(responseJSON);
  });

  return true;
};

module.exports.addTeam = addTeam;
module.exports.getTeam = getTeam;
module.exports.deleteTeam = deleteTeam;
module.exports.getAllTeams = getAllTeams;
module.exports.deleteAdmin = deleteAdmin;
module.exports.search = search;

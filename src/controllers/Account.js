const models = require('../models');

const { Account } = models;

//Logout + login + sign up was taken from domomaker
//Logout
const logout = (request, response) => {
  const req = request;
  const res = response;

  req.session.destroy();
  res.redirect('/');
};

//Login
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  //error checking
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  //authenticate
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ loggedIn: true });
  });
};

//Sign up
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  //error checking
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  //encrypt and store
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ loggedIn: true });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

//Change password
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.passOld = `${req.body.passOld}`;

  //error checking
  if (!req.body.passOld || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  //authenticate
  return Account.AccountModel.authenticate(req.body.username, req.body.passOld, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Check your old password!' });
    }
    //encrypt
    Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const newPassData = {
        salt,
        password: hash,
      };

      //update
      Account.AccountModel.updateByUsername(req.body.username, newPassData, (err1, docs) => {
        if (err1) {
          console.log(err1);
          return res.status(400).json({ error: 'An error occurred' });
        }

        if (docs.nModified !== 0) {
          return res.status(200).json({ message: 'Password Changed' });
        }

        return true;
      });
    });
    return true;
  });
};

//csrf
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;

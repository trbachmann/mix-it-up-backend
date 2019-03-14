const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const bcrypt = require('bcrypt');

module.exports.getUser = function (req, res) {
  let user;
  findUser(req.body.email)
    .then(userData => {
      if (!userData.length) {
        return res.status(404).json({ error: 'No user found with that email' });
      }
      else {
        user = userData[0];
        return validatePassword(req.body.password, user.password);
      }
    })
    .then(() => {
      res.status(200).json({
        id: user.id,
        first_name: user.first_name
      });
    })
    .catch(error => {
      res.status(500).json({ error })
    });
};


module.exports.registerUser = function (req, res) {
  const userRequest = req.body;
  let user;
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!userRequest[requiredParameter]) {
      return res.status(422).json({
        error: `Missing a required property of ${requiredParameter}`
      });
    }
  }

  hashPassword(userRequest.password)
    .then(hashedPassword => {
      user = {...userRequest, password: hashedPassword};
    })
    .then(() => createUser(user))
    .then(userId => {
      res.status(201).json({ id: userId });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
}

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  })
}

const createUser = (user) => {
  return database('users').insert(user, 'id')
    .then(userId => userId[0])
}

const findUser = (email) => {
  return database('users').where('email', email).select()
  .then(userData => userData)
}

const validatePassword = (passwordToValidate, foundUserPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordToValidate, foundUserPassword, (err, response) => {
      if (err) {
        reject(err);
      } else if (response) {
        resolve(response);
      } else {
        reject(new Error('Passwords do not match'))
      }
    });
  })
}
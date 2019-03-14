const express = require('express');
const app = express();
const User = require('../controllers/users.controllers');

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.listen(app.get('port'), () => {
  console.log(`App is running on localhost:${app.get('port')}`);
});

app.get('/api/v1/users', User.getUser);

app.post('/api/v1/users/register', User.registerUser);
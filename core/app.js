const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const handleError = require('../middlewares/handle-error');
const getUser = require('../middlewares/get-user');

const app = express();
const port = process.env.PORT ?? 8000;

app.use(cors({ credentials: true, origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(getUser());
app.use(require('../routes/auth'));
app.use(require('../routes/user'));
app.use(require('../routes/museum'));
app.use(handleError());

app.get('/', (req, res) => res.send());

app.listen(port, () => console.log('App listening at port', port));

module.exports = waifuseum => (app.waifuseum = waifuseum);

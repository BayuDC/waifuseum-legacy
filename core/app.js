const express = require('express');
const cookieParser = require('cookie-parser');
const handleError = require('../middlewares/handle-error');

const app = express();
const port = process.env.PORT ?? 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(require('../routes/auth'));
app.use(require('../routes/main'));
app.use(handleError());

app.listen(port, () => console.log('App listening at port', port));

module.exports = waifuseum => (app.waifuseum = waifuseum);

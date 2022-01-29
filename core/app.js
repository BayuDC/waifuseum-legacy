const express = require('express');
const uploadImg = require('../middlewares/upload-img');
const handleError = require('../middlewares/handle-error');

const app = express();
const port = process.env.PORT ?? 8080;

app.use(express.json());
app.use(express.urlencoded());
app.use(uploadImg());

app.use(require('../routes/main'));
app.use(handleError());

app.listen(port, () => console.log('App listening at port', port));

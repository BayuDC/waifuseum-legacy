const express = require('express');

const app = express();
const port = process.env.PORT ?? 8080;

app.use(require('../routes/main'));

app.listen(port, () => console.log('App listening at port', port));

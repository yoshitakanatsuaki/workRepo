const express = require('express');
const app = express();
const logger = require('morgan');
const webSiteRouter = require('./routes/webSite');
const machineRouter = require('./routes/machine');
const functionRouter = require('./routes/index');

const cors = require('./middlewares/response');
const catch404 = require('./middlewares/catch404');

const errorHandler = require('./middlewares/errorHandler');

// CORSを許可する
app.use(cors);
app.use(logger('dev'));
app.use(webSiteRouter);
app.use(machineRouter);
app.use(functionRouter);

// catch 404 and forward to error handler
app.use(catch404);

// error handler
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

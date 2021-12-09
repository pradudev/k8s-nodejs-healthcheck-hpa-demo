const logger = require('./logger');
const utils = require('./utils');
const express = require('express');
require('dotenv').config({ path: './.env' }); // https://www.npmjs.com/package/dotenv

var app = express();

app.get('/info', (req, res) => {
  logger.info('calling /info');

  res.send(utils.getServerInfo(req));
});

app.get('/stop-server', (req, res) => {
  logger.info('calling /stop-server');
  logger.info('Terminating Express.js server');

  setTimeout(function () {
    logger.info('Terminated Express.js server');
    server.close();
  }, 3000);
});

app.get('/terminate', (req, res) => {
  logger.info('calling /terminate');
  logger.info('Terminating Node process');

  process.exit(1);
});

app.get('/set-is-healthy', (req, res) => {
  logger.info('calling /set-is-healthy');
  const state = req.query.state || 'true';

  utils.setHealthState(state);

  logger.info(`Updated with state=${state}`);

  res.send('Updated the Health State');

});

app.get('/healthz', (req, res) => {
  logger.info('calling /healthz');

  const isHealthy = utils.getHealthState();

  logger.info(`isHealthy=${isHealthy}`);

  if (isHealthy) {
    logger.info('I am healthy');
    res.send('I am healthy');
  }
  else {
    logger.error('I died');
    res.sendStatus(500);
  }
});


app.get('/set-mem-iteration-count', (req, res) => {
  logger.info('calling /set-mem-iteration-count');
  const count = req.query.count || '10000';

  console.log(count);

  utils.setMemIterationCount(count);

  logger.info(`Updated with count=${count}`);

  res.send('Updated the Mem Iteration Count');

});

app.get('/memmory-hunger', (req,res) => {
  logger.info('calling /memmory-hunger');

  var size = req.query.ramInMB || '1';
  utils.consumeMemv2(size);

  res.send('Done');

});

//console.log(JSON.stringify(process));

const port = process.env.SERVER_PORT || 3000

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


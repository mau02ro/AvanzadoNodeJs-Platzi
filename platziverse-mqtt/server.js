'use strict';

const debug = require('debug')('platziverse:mqtt');
const mosca = require('mosca');
const redis = require('redis');
const chalk = require('chalk');
const db = require('platziverse-db');

const backend = {
  type: 'redis',
  redis,
  return_buffers: true,
};

const settings = {
  port: 1883,
  backend: backend,
};

const db_config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: (s) => debug(s),
};

const server = new mosca.Server(settings);

let Agent, Metric;

server.on('clientConnected', (client) => {
  debug(`Client Connected: ${client.id}`);
});

server.on('clientDisconnected', (client) => {
  debug(`Client Disconnected: ${client.id}`);
});

server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`); // topic es el tipo del mensaje
  debug(`Payload: ${packet.payload}`); //
});

server.on('ready', async () => {
  //Instanciar la db
  const servicies = await db(db_config).catch(handleFatalError);

  Agent = servicies.Agent;
  Metric = servicies.Metric;

  console.log(`${chalk.green('[platziverse-mqtt]')} - Server is running`);
});

server.on('error', handleFatalError);
process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

function handleFatalError(err) {
  console.error(`${chalk.red('[Fatal error] -> ')} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

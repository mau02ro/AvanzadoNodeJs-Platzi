'use strict';

const debug = require('debug')('platziverse:db:setup');
// const inquirer = require("inquirer");
const chalk = require('chalk');

const db = require('./');

// const prompt = inquirer.createPromptModule();

async function setup() {
  let confirmation = process.argv.filter((p) => p === '-y' || p === '--yes')[0];
  // const answer = await prompt([
  //   {
  //     type: "confirm",
  //     name: "setup",
  //     message: "This will destroy your database, are you sure?",
  //   },
  // ]);

  if (!confirmation) {
    return console.log('Nothing happene :)');
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: (s) => debug(s),
    setup: true,
  };
  await db(config).catch(handleFatalError);

  console.log('Success!');
  process.exit(0);
}

function handleFatalError(err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}}`);
  console.error(err.stack);
  process.exit(1);
}

setup();

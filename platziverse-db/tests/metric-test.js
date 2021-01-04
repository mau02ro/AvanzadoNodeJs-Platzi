"use strict";

const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const agentFixtures = require("./fixtures/metric");

let id = 1;
let uuid = "yyy-yyy-yyy";
let AgentStub = null;
let db = null;
let sandbox = null;

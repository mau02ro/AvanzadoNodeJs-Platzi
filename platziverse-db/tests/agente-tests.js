"use strict";
const proxyquire = require("proxyquire");
const test = require("ava");
const sinon = require("sinon");

const config = {
  logging: function () {},
};

let MetricStub = {
  belongsTo: sinon.spy(), // un spy es una funcion específica de sinon que se usa al momento de hacer pruebas
};

let AgentStub = null;
let db = null;
let sandbox = null;

test.beforeEach(async () => {
  /* un sanbox es un ambiente específico de sinon que solo va a funccionar
  para un caso en particular cuando termine la prueba se reiniciara.*/
  sandbox = sinon.createSandbox();

  AgentStub = {
    hasMany: sandbox.spy(),
  };

  /*redefinimos las rutas para los test */
  const setupDatabase = proxyquire("../", {
    "./models/agent": () => AgentStub,
    "./models/metric": () => MetricStub,
  });

  db = await setupDatabase(config);
});

test.after(() => {
  sandbox && sinon.reset();
});

test("Agent", (t) => {
  t.truthy(db.Agent, "Agent service should exist");
});

test.serial("Setup", (t) => {
  t.true(AgentStub.hasMany.called, "AgentModel.hasMany was executed");
  t.true(MetricStub.belongsTo.called, "MetricStub.belongsTo was executed");
});

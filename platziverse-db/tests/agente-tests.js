"use strict";
const proxyquire = require("proxyquire");
const test = require("ava");
const sinon = require("sinon");

const agentFixtures = require("./fixtures/agent");

const config = {
  logging: function () {},
};

let MetricStub = {
  belongsTo: sinon.spy(), // un spy es una funcion específica de sinon que se usa al momento de hacer pruebas
};

let AgentStub = null;
let db = null;
let sandbox = null;

let single = Object.assign({}, agentFixtures.single);
let id = 1;

test.beforeEach(async () => {
  /* un sanbox es un ambiente específico de sinon que solo va a funccionar
  para un caso en particular cuando termine la prueba se reiniciara.*/
  sandbox = sinon.createSandbox();

  AgentStub = {
    hasMany: sandbox.spy(),
  };

  //Modelo findById Stub
  AgentStub.findById = sandbox.stub();
  AgentStub.findById
    .withArgs(id)
    .returns(Promise.resolve(agentFixtures.findById(id)));

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

test.serial("Agent#findById", async (t) => {
  let agent = await db.Agent.findById(id);

  t.true(AgentStub.findById.called, "AgentModel.findById was executed");
  t.true(AgentStub.findById.calledOnce, "AgentModel.findById was executed");
  t.true(
    AgentStub.findById.calledWith(id),
    "findById should by called with specified id"
  );

  t.deepEqual(agent, agentFixtures.findById(id), "should be the same");
});

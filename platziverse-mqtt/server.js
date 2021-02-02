'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const { parserPayload } = require('./utils')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend: backend
}

const db_config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: (s) => debug(s)
}

const server = new mosca.Server(settings)

const clients = new Map()

let Agent, Metric

server.on('clientConnected', (client) => {
  debug(`Client Connected: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async (client) => {
  debug(`Client Disconnected: ${client.id}`)
  const agent = clients.get(client.id)
  if (agent) {
    // Mark agent as Disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (error) {
      return handleError(error)
    }

    // Delete agent from clients list
    clients.delete(client.id)

    server.publish({
      topic: 'Disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(
      `Client (${client.id}) associated to agent (${agent.uuid}) marked as Disconnected`
    )
  }
})

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`) // topic es el tipo del mensaje

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break

    case 'agent/message':
      const payload = parserPayload(packet.payload)
      if (payload) {
        debug(`Payload: ${packet.payload}`)

        payload.agent.connected = true

        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (error) {
          return handleError(error)
        }

        debug(`Agent ${agent.uuid} saved`)

        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store Metrics
        for (const metric of payload.metrics) {
          let m

          try {
            m = await Metric.create(agent.uuid, metric)
          } catch (error) {
            return handleError(error)
          }

          debug(`Metric ${m.id} saved on agent ${agent.uuid}`)
        }
      }
      break
  }
})

server.on('ready', async () => {
  // Instanciar la db
  const servicies = await db(db_config).catch(handleFatalError)

  Agent = servicies.Agent
  Metric = servicies.Metric

  console.log(`${chalk.green('[platziverse-mqtt]')} - Server is running`)
})

server.on('error', handleFatalError)
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[Fatal error] -> ')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`${chalk.red('[Error] -> ')} ${err.message}`)
  console.error(err.stack)
}

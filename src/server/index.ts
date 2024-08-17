import { createServer } from '@helenejs/server'
import { ServerEvents } from '@helenejs/utils'
import chalk from 'chalk'
import omit from 'lodash/omit'

async function start() {
  const server = createServer({
    port: 8002,
    host: '0.0.0.0',
    origins: ['http://localhost:8000'],
    allowedContextKeys: ['userId', 'token'],
    rateLimit: {
      max: 512,
      interval: 60 * 1000,
    }
  })

  await import('./methods')

  server.on(ServerEvents.METHOD_EXECUTION, data => {
    if (data.time > 100) {
      console.log(
        chalk.yellow(
          `Method "${data.method}" took ${data.time.toFixed(2)}ms to execute`,
        ),
        omit(data, 'result'),
      )
    }
  })

  await server.isReady()
}

start().catch(console.error)
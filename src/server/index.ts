import { createServer } from '@helenejs/server'
import { ServerEvents } from '@helenejs/utils'
import chalk from 'chalk'
import omit from 'lodash/omit'
import sirv from 'sirv'

async function start() {
  const server = createServer({
    port: Number(process.env.PORT) || 8002,
    host: '0.0.0.0',
    origins: ['http://localhost:8000', 'http://0.0.0.0:8000'],
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

  if (process.env.NODE_ENV === 'production') {
    Helene.express.use(
      sirv('./dist/client', {
        gzip: true,
        single: true,
        setHeaders: res => {
          res.setHeader('Cache-Control', 'no-store, max-age=0')
        },
      }),
    )
  }

  await server.isReady()

  process.on('SIGINT', async () => {
    await server.close()
    process.exit()
  })
}

start().catch(console.error)
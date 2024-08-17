import chalk from 'chalk'
import { spawn } from 'child_process'
import { resolve } from 'path'
import { createServer } from 'vite'

run().catch(console.error)

async function run() {
  console.log(`\rStarting...`)
  console.log(process.cwd())

  const viteDevServer = await createServer({
    configFile: resolve(process.cwd(), './vite.config.mjs'),
    server: {
      host: '0.0.0.0',
      port: 8000,
      middlewareMode: false,
      fs: {
        strict: false,
      },
      hmr: {
        overlay: true,
      },
    },
    optimizeDeps: {
      force: process.argv.includes('--force'),
    },
  })

  await viteDevServer.listen()

  console.log(chalk.green(`\rDevelopment server running at http://localhost:8000/`) + '\n')

  const server = spawn(
    'node',
    [
      '--watch',
      '-r',
      '@swc-node/register',
      '-r',
      'dotenv/config',
      './src/server/index.ts',
      'dotenv_config_path=./.env.server',
      // 'dotenv_config_debug=true',
      ...process.argv.slice(2),
    ],
    {
      stdio: 'inherit',
      cwd: process.cwd(),
    },
  )

  const signals = ['SIGUSR2', 'SIGINT', 'SIGQUIT', 'SIGTERM', 'SIGHUP']

  signals.forEach(signal => {
    process.once(signal, async function () {
      console.log(`\r\nReceived ${signal}, killing server process...`)
      await viteDevServer.close()
      server.kill()
    })
  })
}

import Fastify from 'fastify'
import { list } from 'drivelist'
import cors from '@fastify/cors'
import projects from './projects'
import commandExists from 'command-exists'

export default function server(
  dbPath = '/home/mgyugcha/.config/Electron/database.db',
) {
  process.env.DB = dbPath
  const fastify = Fastify({
    logger: true,
  })

  fastify.register(cors)

  fastify.get('/drivers', async (_, reply) => {
    const drivers = await list()
    reply.send(drivers)
  })

  fastify.get('/carvers', (_, reply) => {
    const carvers: string[] = []
    commandExists('scalpel', (err, success1) => {
      if (success1) carvers.push('scalpel')
      commandExists('foremost', (err, success2) => {
        if (success2) carvers.push('foremost')
        reply.send(carvers)
      })
    })
  })

  fastify.register(projects, { prefix: '/projects' })

  fastify.listen({ port: 3001 }, (err, address) => {
    if (err) throw err
  })
}

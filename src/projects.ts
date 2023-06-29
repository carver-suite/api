import { Project } from './types/Projects'
import { FastifyPluginAsync } from 'fastify'
import { getDatabase } from './libs/database'

const projects: FastifyPluginAsync = async (instance) => {
  const db = await getDatabase()

  instance.get('/', async (_, reply) => {
    const sql = 'SELECT id, titulo FROM recover'
    await new Promise<void>((resolve, reject) => {
      db.all<Project>(sql, (error, rows) => {
        if (error) return reject(error)
        reply.send(rows || [])
        resolve()
      })
    })
  })

  instance.post<{ Body: Project }>('/', async (request, reply) => {
    const sql = 'INSERT INTO recover(titulo) VALUES(?)'
    await new Promise<void>((resolve, reject) => {
      const { titulo } = request.body
      db.run(sql, [titulo], function (error) {
        if (error) return reject(error)
        reply.send({ id: this.lastID })
        resolve()
      })
    })
  })

  instance.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const sql = 'SELECT * FROM recover WHERE id=?'
    await new Promise<void>((resolve, reject) => {
      db.get(sql, [request.params.id], (error, row) => {
        if (error) return reject(error)
        if (!row) {
          reply.status(404).send('No se encontró ese proyecto')
        } else {
          reply.send(row)
        }
        resolve()
      })
    })
  })

  instance.put<{ Params: { id: string }; Body: Record<string, string> }>(
    '/:id',
    async (request, reply) => {
      const sql = `UPDATE recover SET
titulo=?,
propietario=?,
fechaDeIngreso=?,
horaDeIngreso=?,
diagnosticoExpress=?,
requerimientosDelUsuario=?,
especialista=?,
fechaDeEntrega=?,
horaDeEntrega=?,
novedadesFinales=?,
observacionesFinales=?
WHERE id=?`
      const data = [
        request.body.titulo,
        request.body.propietario,
        request.body.fechaDeIngreso,
        request.body.horaDeIngreso,
        request.body.diagnosticoExpress,
        request.body.requerimientosDelUsuario,
        request.body.especialista,
        request.body.fechaDeEntrega,
        request.body.horaDeEntrega,
        request.body.novedadesFinales,
        request.body.observacionesFinales,
        request.params.id,
      ]
      await new Promise<void>((resolve, reject) => {
        db.run(sql, data, (error) => {
          if (error) return reject(error)
          reply.send('success')
          resolve()
        })
      })
    },
  )

  instance.delete<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {
      const sql = 'DELETE FROM recover WHERE id=?'
      await new Promise<void>((resolve, reject) => {
        db.run(sql, [request.params.id], (error) => {
          if (error) return reject(error)
          reply.send('success')
          resolve()
        })
      })
    },
  )
}

export default projects

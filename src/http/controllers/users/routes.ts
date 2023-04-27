import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}

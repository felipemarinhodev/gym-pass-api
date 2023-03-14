import { hash } from 'bcryptjs'
import { describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    const currentUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }
    vi.spyOn(usersRepository, 'create').mockReturnValueOnce(
      new Promise((resolve, reject) => resolve(currentUser)),
    )

    vi.spyOn(usersRepository, 'findByEmail').mockResolvedValue(currentUser)

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })
})

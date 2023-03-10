import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())

    const { user } = await registerUseCase.execute({
      name: 'Fulano',
      email: 'fulano@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())

    const email = 'fulano@email.com'
    await registerUseCase.execute({
      name: 'Fulano',
      email,
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'Fulano',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })
})

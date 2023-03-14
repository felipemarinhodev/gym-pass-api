import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'

const PASSWORD = '123456'

async function makeSut() {
  const usersRepository = new InMemoryUsersRepository()
  const sut = new AuthenticateUseCase(usersRepository)

  const currentUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password_hash: await hash(PASSWORD, 6),
    created_at: new Date(),
  }

  return { usersRepository, sut, currentUser }
}

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const { usersRepository, sut, currentUser } = await makeSut()
    vi.spyOn(usersRepository, 'create').mockResolvedValue(currentUser)
    vi.spyOn(usersRepository, 'findByEmail').mockResolvedValue(currentUser)
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {
    const { usersRepository, sut, currentUser } = await makeSut()
    vi.spyOn(usersRepository, 'create').mockResolvedValue(currentUser)

    vi.spyOn(usersRepository, 'findByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new InvalidCredentialsError())),
    )

    expect(() =>
      sut.execute({
        email: 'fulano@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    const { usersRepository, sut, currentUser } = await makeSut()
    vi.spyOn(usersRepository, 'create').mockResolvedValue(currentUser)

    vi.spyOn(usersRepository, 'findByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new InvalidCredentialsError())),
    )

    expect(() =>
      sut.execute({
        email: 'fulano@example.com',
        password: 'any_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

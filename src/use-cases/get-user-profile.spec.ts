import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, vi } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'

function makeSut() {
  const usersRepository = new InMemoryUsersRepository()
  const sut = new GetUserProfileUseCase(usersRepository)
  return { sut, usersRepository }
}

describe('Get User profile Use Case', () => {
  it('should be able to get user profile', async () => {
    const { sut, usersRepository } = makeSut()
    vi.spyOn(usersRepository, 'findById').mockResolvedValue({
      id: 'user-id',
      name: 'fulano',
      email: '',
      password_hash: 'any_password_hash',
      created_at: new Date(),
    })

    const { user } = await sut.execute({ userId: 'user-id' })

    expect(user?.id).toEqual(expect.any(String))
  })
  it('should not be able to get user profile with wrong id', async () => {
    const { sut, usersRepository } = makeSut()

    vi.spyOn(usersRepository, 'findById').mockRejectedValueOnce(
      new ResourceNotFoundError(),
    )

    expect(
      async () => await sut.execute({ userId: 'user-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, vi } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'

describe('Get User profile Use Case', () => {
  it('should be able to get user profile', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfileUseCase(usersRepository)

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
})

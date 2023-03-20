import { CheckInsRepositoryStub } from '@/repositories/in-memory/check-ins-repository-stub'
import { describe, expect, it, vi } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

const makeSut = () => {
  const checkInsRepositoryStub = new CheckInsRepositoryStub()
  const sut = new FetchUserCheckInsHistoryUseCase(checkInsRepositoryStub)

  return { sut, checkInsRepositoryStub }
}

describe('Fetch user Check-in Use Case', () => {
  it('should be able to fetch check-in history', async () => {
    const { sut, checkInsRepositoryStub } = makeSut()
    vi.spyOn(checkInsRepositoryStub, 'findManyByUserId').mockResolvedValue([
      {
        id: 'any_check-in_id_1',
        created_at: new Date(),
        validated_at: new Date(),
        user_id: 'any_user_id',
        gym_id: 'any_gym_id',
      },
      {
        id: 'any_check-in_id_2',
        created_at: new Date(),
        validated_at: new Date(),
        user_id: 'any_user_id',
        gym_id: 'any_gym_id2',
      },
    ])
    const { checkIns } = await sut.execute({ userId: 'any_user', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'any_gym_id' }),
      expect.objectContaining({ gym_id: 'any_gym_id2' }),
    ])
  })
  it('should be able to fetch paginated check-in history', async () => {
    const { sut, checkInsRepositoryStub } = makeSut()
    for (let i = 1; i <= 22; i++) {
      await checkInsRepositoryStub.create({
        user_id: 'any_user_id',
        gym_id: `any_gym_id${i}`,
      })
    }

    const { checkIns } = await sut.execute({ userId: 'any_user_id', page: 1 })

    expect(checkIns).toHaveLength(20)
    // expect(checkIns).toEqual([
    //   expect.objectContaining({ gym_id: 'any_gym_id' }),
    //   expect.objectContaining({ gym_id: 'any_gym_id2' }),
    // ])
  })
})

import { CheckInsRepositoryStub } from '@/repositories/in-memory/check-ins-repository-stub'
import { describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

function makeSut() {
  const checkInsRepositoryStub = new CheckInsRepositoryStub()
  const sut = new GetUserMetricsUseCase(checkInsRepositoryStub)
  return { sut, checkInsRepositoryStub }
}
describe('Get User Metrics Use Case', () => {
  it('should be able to get check-ins count from metrics', async () => {
    const { sut, checkInsRepositoryStub } = makeSut()

    vi.spyOn(checkInsRepositoryStub, 'countByUserId').mockResolvedValue(2)
    expect(await sut.execute({ userId: 'any_id' })).toEqual({
      checkInsCount: 2,
    })
  })
})

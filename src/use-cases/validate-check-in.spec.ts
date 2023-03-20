import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckInsRepositoryStub } from '@/repositories/in-memory/check-ins-repository-stub'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

const makeSut = () => {
  const checkInsRepository = new CheckInsRepositoryStub()
  const sut = new ValidateCheckInUseCase(checkInsRepository)
  return { sut, checkInsRepository }
}

describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const { sut, checkInsRepository } = makeSut()

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01 ',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })
  it('should not be able to validate an inexistent check-in', async () => {
    const { sut } = makeSut()

    await expect(() =>
      sut.execute({
        checkInId: 'any_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    const { sut, checkInsRepository } = makeSut()
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})

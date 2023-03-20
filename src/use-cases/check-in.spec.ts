import { CheckInsRepositoryStub } from '@/repositories/in-memory/check-ins-repository-stub'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

const makeSut = () => {
  const checkInsRepository = new CheckInsRepositoryStub()
  const gymsRepository = new InMemoryGymsRepository()
  const sut = new CheckInUseCase(checkInsRepository, gymsRepository)
  vi.spyOn(gymsRepository, 'findById').mockResolvedValue({
    id: 'gym-01',
    title: 'Javascript Gym',
    description: '',
    phone: '',
    latitude: new Decimal(49.2246963),
    longitude: new Decimal(-123.1063684),
  })
  return { sut }
}

describe('Check-in Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { sut } = makeSut()

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 49.2246963,
      userLongitude: -123.1063684,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    const { sut } = makeSut()
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 49.2246963,
      userLongitude: -123.1063684,
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 49.2246963,
        userLongitude: -123.1063684,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should be able to check in twice in the different days', async () => {
    const { sut } = makeSut()
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 49.2246963,
      userLongitude: -123.1063684,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 49.2246963,
      userLongitude: -123.1063684,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gym', async () => {
    const { sut } = makeSut()

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 49.2243778,
        userLongitude: -123.117618,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

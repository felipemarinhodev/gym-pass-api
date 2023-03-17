import { CheckInsRepository } from '@/repositories/checkin-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckIn, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

class CheckInsRepositoryStub implements CheckInsRepository {
  public items: CheckIn[] = []

  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const { user_id, gym_id } = data
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id,
      gym_id,
    }
    this.items.push(checkIn)
    return new Promise((resolve) => resolve(checkIn))
  }

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    const result = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    return new Promise((resolve) => resolve(result || null))
  }
}

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
    ).rejects.toBeInstanceOf(Error)
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
    ).rejects.toBeInstanceOf(Error)
  })
})

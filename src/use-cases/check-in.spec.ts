import { CheckInsRepository } from '@/repositories/checkin-repository'
import { Prisma, CheckIn } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
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
}

const makeSut = () => {
  const checkInsRepository = new CheckInsRepositoryStub()
  const sut = new CheckInUseCase(checkInsRepository)

  return { sut, checkInsRepository }
}

describe('Check-in Use Case', () => {
  it('should be able to check in', async () => {
    const { sut } = makeSut()

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})

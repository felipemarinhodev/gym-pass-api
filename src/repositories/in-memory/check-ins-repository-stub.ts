import { CheckInsRepository } from '@/repositories/checkin-repository'
import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

export class CheckInsRepositoryStub implements CheckInsRepository {
  public items: CheckIn[] = []

  async countByUserId(userId: string) {
    return this.items.filter((item) => (item.user_id = userId)).length
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => (item.user_id = userId))
      .slice((page - 1) * 20, page * 20)
  }

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

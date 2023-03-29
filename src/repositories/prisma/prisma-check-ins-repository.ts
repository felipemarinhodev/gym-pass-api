import { prisma } from '@/lib/prisma'
import { Prisma, CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../checkin-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const result = await prisma.checkIn.create({
      data,
    })
    return result
  }

  async save(data: CheckIn) {
    const result = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })
    return result
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const result = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return result
  }

  async findManyByUserId(userId: string, page: number) {
    const result = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20, // how many register I want see.
      skip: (page - 1) * 20, // skip x register before get the first.
    })
    return result
  }

  async countByUserId(userId: string) {
    const result = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return result
  }

  async findById(id: string) {
    const result = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return result
  }
}

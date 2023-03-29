import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class PrismaGymsRepositor implements GymsRepository {
  async findById(id: string) {
    const result = await prisma.gym.findUnique({
      where: {
        id,
      },
    })
    return result
  }

  async searchMany(query: string, page: number) {
    const result = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return result
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const result = await prisma.$queryRaw<Gym[]>`
      SELECT * 
      from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return result
  }

  async create(data: Prisma.GymCreateInput) {
    const result = await prisma.gym.create({
      data,
    })
    return result
  }
}

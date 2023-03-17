import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) return null

    return gym
  }

  create({
    id,
    title,
    description = null,
    phone = null,
    latitude,
    longitude,
  }: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: id ?? randomUUID(),
      title,
      description,
      phone,
      latitude: new Prisma.Decimal(latitude.toString()),
      longitude: new Prisma.Decimal(longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return new Promise((resolve) => resolve(gym))
  }
}

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Prisma } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

const makeSut = () => {
  const inMemoryGymsRepository = new InMemoryGymsRepository()
  const sut = new SearchGymsUseCase(inMemoryGymsRepository)

  return {
    inMemoryGymsRepository,
    sut,
  }
}

describe('Search Gyms Use Case', () => {
  it('should be able to search for gyms', async () => {
    const { sut, inMemoryGymsRepository } = makeSut()
    vi.spyOn(inMemoryGymsRepository, 'searchMany').mockResolvedValue([
      {
        id: 'any_id_01',
        title: 'gym-01',
        description: null,
        phone: null,
        latitude: new Prisma.Decimal((49.2246963).toString()),
        longitude: new Prisma.Decimal((-123.1063684).toString()),
      },
      {
        id: 'any_id_02',
        title: 'gym-02',
        description: null,
        phone: null,
        latitude: new Prisma.Decimal((49.2246963).toString()),
        longitude: new Prisma.Decimal((-123.1063684).toString()),
      },
    ])
    const { gyms } = await sut.execute({ query: 'gym', page: 1 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-01' }),
      expect.objectContaining({ title: 'gym-02' }),
    ])
  })
  it('should be able to fetch paginated gym search', async () => {
    const { sut, inMemoryGymsRepository } = makeSut()
    vi.spyOn(inMemoryGymsRepository, 'searchMany').mockResolvedValue([
      {
        id: 'any_id_21',
        title: 'gym-21',
        description: null,
        phone: null,
        latitude: new Prisma.Decimal((49.2246963).toString()),
        longitude: new Prisma.Decimal((-123.1063684).toString()),
      },
      {
        id: 'any_id_22',
        title: 'gym-22',
        description: null,
        phone: null,
        latitude: new Prisma.Decimal((49.2246963).toString()),
        longitude: new Prisma.Decimal((-123.1063684).toString()),
      },
    ])

    const { gyms } = await sut.execute({ query: 'gym', page: 2 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
    ])
  })
})

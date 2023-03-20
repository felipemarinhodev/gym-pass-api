import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { describe, expect, it } from 'vitest'

const makeSut = () => {
  const inMemoryGymsRepository = new InMemoryGymsRepository()
  const sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)

  return {
    sut,
    gymRepository: inMemoryGymsRepository,
  }
}

describe('Fetch Nearby Gyms Use Case', () => {
  it('should be able to fetch nearby gyms', async () => {
    const { sut, gymRepository } = makeSut()

    await gymRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})

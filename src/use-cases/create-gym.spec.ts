import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

const makeSut = () => {
  const gymsRepository = new InMemoryGymsRepository()
  const sut = new CreateGymUseCase(gymsRepository)

  return { sut, gymsRepository }
}

describe('Create Gym Use Case', () => {
  beforeEach(() => {})

  it('Should be able to create a gym', async () => {
    const { sut } = makeSut()
    const { gym } = await sut.execute({
      title: 'gym-01',
      description: null,
      phone: null,
      latitude: 49.2246963,
      longitude: -123.1063684,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})

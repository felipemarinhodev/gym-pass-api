import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  // Qual codigo vai ser executado antes dos testes (antes de cada arquivo de teste)
  async setup() {
    console.log('setup')

    return {
      teardown() {
        // Vai ser executado depois dos testes!
        console.log('teardown')
      },
    }
  },
}

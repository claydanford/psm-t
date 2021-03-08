import { getInput, response } from '../encrypt'

describe('encrypt', () => {
  describe('getInput', () => {
    it('should return the event body', async () => {
      const secret = await getInput('POST', 'FOO')
      expect(secret).toEqual('FOO')
    })

    it('should return a random string', async () => {
      const secret = await getInput('GET', '')
      expect(secret).toHaveLength(15)
      expect(typeof secret).toBe('string')
    })

    it('should return as undefined', async () => {
      const secret = await getInput('POST', null)
      expect(secret).toBeNull()
    })
  })

  describe('response', () => {
    it('should return response object', () => {
      const result = response(200, 'FOO')
      expect(result).toStrictEqual({
        statusCode: 200,
        body: '{"message":"FOO"}'
      })
    })
  })
})

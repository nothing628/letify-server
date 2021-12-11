import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    /**
     * Make request
     */
    const response = await supertest(BASE_URL).get('/').expect(200)
    const { body } = response

    /**
     * Construct JSDOM instance using the response HTML
     */
    // const { document } = new JSDOM(text).window

    // const title = document.querySelector('.title')
    // assert.exists(title)
    assert.deepEqual(body, {hello: "world"});
  })
})

import test from 'japa'
import supertest from 'supertest'
import Wallet from 'App/Models/Wallet'
import { name } from 'faker'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/wallets`

test.group('Test /wallets End-Point', () => {
  const fakeLabel = name.firstName()
  test('ensure POST /wallets can store to database', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/')
      .send({
        label: fakeLabel,
      })
      .expect(200)
    const { body } = response

    assert.deepEqual(body, {
      success: true,
      data: {
        label: fakeLabel,
      },
    })
    const wallet = await Wallet.findBy('label', fakeLabel)

    assert.isNotNull(wallet, 'Wallet should stored in database')
  })

  test('ensure GET /wallets can list wallet', async (assert) => {
    const response = await supertest(BASE_URL).get('/').expect(200)
    const { body } = response
    const wallets = await Wallet.all()

    assert.hasAllKeys(body, ['success', 'data'])
    assert.isTrue(body.success)
    assert.deepInclude(body.data, wallets[0].toJSON())
  })
})
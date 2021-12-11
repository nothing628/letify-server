import test from 'japa'
import supertest from 'supertest'
import Wallet from 'App/Models/Wallet'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/wallets`

test.group('Test /wallets End-Point', () => {
  test('ensure POST /wallets can store to database', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/')
      .send({
        label: 'Fake label',
      })
      .expect(200)
    const { body } = response

    assert.deepEqual(body, {
      success: true,
      data: {
        label: 'Fake label',
      },
    })
    const wallet = await Wallet.findBy('label', 'Fake label');

    assert.isNotNull(wallet, 'Wallet should stored in database');
  })
})

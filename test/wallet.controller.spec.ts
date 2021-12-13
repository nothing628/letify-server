import test from 'japa'
import supertest from 'supertest'
import Wallet from 'App/Models/Wallet'
import { name } from 'faker'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/wallets`

test.group('Test /wallets End-Point', () => {
  const fakeLabel = name.firstName()
  const newFakeLabel = name.firstName()
  let fakeId = ''

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
    fakeId = wallet?.id || ''
  })

  test('ensure GET /wallets can list wallet', async (assert) => {
    const response = await supertest(BASE_URL).get('/').expect(200)
    const { body } = response
    const wallets = await Wallet.all()

    assert.hasAllKeys(body, ['success', 'data'])
    assert.isTrue(body.success)
    assert.deepInclude(body.data, wallets[0].toJSON())
  })

  test(`ensure GET /wallets/:id can show wallet`, async (assert) => {
    const response = await supertest(BASE_URL).get(`/${fakeId}`).expect(200)
    const { body } = response
    const wallet = await Wallet.find(fakeId)

    assert.hasAllKeys(body, ['success', 'data'])
    assert.isTrue(body.success)
    assert.deepEqual(body.data, wallet?.toJSON())
  })

  test(`ensure PATCH /wallets/:id can update wallet`, async (assert) => {
    const response = await supertest(BASE_URL)
      .patch(`/${fakeId}`)
      .send({ label: newFakeLabel })
      .expect(200)
    const { body } = response
    const wallet = await Wallet.findBy('label', newFakeLabel)

    assert.hasAllKeys(body, ['success', 'data'])
    assert.isTrue(body.success)
    assert.deepEqual(body.data, wallet?.toJSON())
  })

  test(`ensure DELETE /wallets/:id can delete wallet`, async (assert) => {
    await supertest(BASE_URL).delete(`/${fakeId}`).expect(204)

    const wallet = await Wallet.findBy('label', newFakeLabel)

    assert.isNull(wallet, 'Wallet should deleted from database')
  })

  test(`ensure GET /wallets/:id throw 404 (not exists data)`, async (assert) => {
    const response = await supertest(BASE_URL).get(`/${fakeId}`).expect(404)
    const { body } = response

    assert.hasAllKeys(body, ['success', 'message'])
    assert.isFalse(body.success)
    assert.equal(body.message, 'Wallet not found')
  })

  test(`ensure PATCH /wallets/:id throw 404 (not exists data)`, async (assert) => {
    const response = await supertest(BASE_URL)
      .patch(`/${fakeId}`)
      .send({ label: newFakeLabel })
      .expect(404)
    const { body } = response

    assert.hasAllKeys(body, ['success', 'message'])
    assert.isFalse(body.success)
    assert.equal(body.message, 'Wallet not found')
  })

  test(`ensure DELETE /wallets/:id throw 404 (not exists data)`, async (assert) => {
    await supertest(BASE_URL).delete(`/${fakeId}`).expect(404)
  })
})

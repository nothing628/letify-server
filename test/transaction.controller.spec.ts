import test from 'japa'
import { assert, expect } from 'chai'
import supertest from 'supertest'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import moment from 'moment'
import get from 'lodash/get'
import { finance, date, datatype } from 'faker'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/transactions`

test.group('Test /transactions End-Point', (group) => {
  const fakeNotes = finance.transactionDescription()
  let tempId = ''
  let wallets: Wallet[] = []

  group.before(async () => {
    const currentWallets = await Wallet.all()

    if (currentWallets.length >= 2) {
      wallets = currentWallets
      return
    }

    // Create two wallet
    for (let i = 0; i < 2; i++) {
      const wallet = new Wallet()
      wallet.label = finance.accountName()
      await wallet.save()

      wallets.push(wallet)
    }
  })

  test('ensure POST /transactions can store transaction to database', async (assert) => {
    const amount = parseFloat(finance.amount(0, 1000000, 0, ''))
    const transactionAt = date.past(1)
    const response = await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: wallets[0].id,
        amount: amount,
        notes: fakeNotes,
        transactionAt: transactionAt.toISOString(),
      })
      .expect(200)

    const { body } = response

    assert.deepNestedPropertyVal(body, 'success', true)
    assert.deepNestedPropertyVal(body, 'data.wallet_id', wallets[0].id)
    assert.deepNestedPropertyVal(body, 'data.amount', amount)
    assert.deepNestedPropertyVal(body, 'data.notes', fakeNotes)

    const actualTransactionAt = moment(get(body, 'data.transactionAt'))
    const expectedTransactionAt = moment(transactionAt)
    assert.isTrue(actualTransactionAt.isSame(expectedTransactionAt))

    const transaction = await Transaction.findBy('notes', fakeNotes)

    assert.isNotNull(transaction, 'Transaction should be exists in database')
    tempId = transaction?.id || ''
  })

  test('ensure POST /transactions validate the request', async () => {
    const amount = parseFloat(finance.amount(0, 1000000, 0, ''))
    const transactionAt = date.past(1)

    // Request without wallet id
    await supertest(BASE_URL)
      .post('/')
      .send({
        amount: amount,
        notes: fakeNotes,
        transactionAt: transactionAt.toISOString(),
      })
      .expect(422)

    // Request without amount
    await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: wallets[0].id,
        notes: fakeNotes,
        transactionAt: transactionAt.toISOString(),
      })
      .expect(422)

    // Request without transaction time
    await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: wallets[0].id,
        amount: amount,
        notes: fakeNotes,
      })
      .expect(422)

    // Request with empty notes
    // this should be treated as valid request
    await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: wallets[0].id,
        amount: amount,
        notes: '',
        transactionAt: transactionAt.toISOString(),
      })
      .expect(200)
  })

  test('ensure GET /transactions can list all transaction', async () => {
    const response = await supertest(BASE_URL).get('/').expect(200)
    const { body } = response
    const transactions = await Transaction.all()
    const transactions_object = transactions.map((t) => t.toJSON())

    assert.deepNestedPropertyVal(body, 'success', true)
    expect(get(body, 'data')).to.have.length(transactions.length)
    expect(get(body, 'data')).to.have.deep.members(transactions_object)
  })

  test('ensure GET /transactions can filter list transaction based on wallet id', async () => {
    for (let i = 0; i < wallets.length; i++) {
      const response = await supertest(BASE_URL).get(`/?wallet_id=${wallets[i].id}`).expect(200)
      const { body } = response
      const transactions = await Transaction.query().withScopes((scope) =>
        scope.withWallet(wallets[i])
      )
      const transactions_object = transactions.map((t) => t.toJSON())

      expect(get(body, 'success')).to.be.true
      expect(get(body, 'data'))
        .to.have.length(transactions_object.length)
        .that.have.deep.members(transactions_object)
    }
  })

  test('ensure GET /transactions/:id can get correct transaction', async () => {
    const response = await supertest(BASE_URL).get(`/${tempId}`).expect(200)
    const { body } = response
    const transaction = await Transaction.find(tempId)

    expect(get(body, 'success')).to.be.true
    expect(get(body, 'data')).to.deep.equal(transaction?.toJSON())
  })

  test('ensure GET /transactions/:id throw 404 when get non-exists transaction', async () => {
    const fakeId = datatype.uuid()
    const response = await supertest(BASE_URL).get(`/${fakeId}`).expect(404)
    const { body } = response

    expect(get(body, 'success')).to.be.false
    expect(get(body, 'message')).to.equal('Transaction not found')
  })

  test('ensure PATCH /transactions/:id can update transaction', async () => {
    const fakeAmount = parseFloat(finance.amount(0, 1000000, 0, ''))
    const fakeDescription = finance.transactionDescription()
    const transactionAt = date.past(1)
    const response = await supertest(BASE_URL)
      .patch(`/${tempId}`)
      .send({
        amount: fakeAmount,
        notes: fakeDescription,
        transactionAt: transactionAt,
      })
      .expect(200)
    const { body } = response
    const transaction = await Transaction.findOrFail(tempId)
    const transactionObject = transaction.toJSON()
    transactionObject.amount = parseFloat(transactionObject.amount)

    expect(get(body, 'success')).to.be.true
    expect(get(body, 'data')).to.be.deep.equal(transactionObject)
  })

  test('ensure PATCH /transactions/:id throw 404 when update non-exists transaction', async () => {
    const fakeId = datatype.uuid()
    const fakeAmount = parseFloat(finance.amount(0, 1000000, 0, ''))
    const fakeDescription = finance.transactionDescription()
    const transactionAt = date.past(1)
    const response = await supertest(BASE_URL)
      .patch(`/${fakeId}`)
      .send({
        amount: fakeAmount,
        notes: fakeDescription,
        transactionAt: transactionAt,
      })
      .expect(404)
    const { body } = response

    expect(get(body, 'success')).to.be.false
    expect(get(body, 'message')).to.equal('Transaction not found')
  })

  test('ensure PATCH /transactions/:id validate the request', async () => {
    const fakeAmount = parseFloat(finance.amount(0, 1000000, 0, ''))
    const fakeDescription = finance.transactionDescription()
    const transactionAt = date.past(1)

    // Request without amount
    await supertest(BASE_URL)
      .patch(`/${tempId}`)
      .send({
        notes: fakeDescription,
        transactionAt: transactionAt,
      })
      .expect(422)

    // Request without transaction time
    await supertest(BASE_URL)
      .patch(`/${tempId}`)
      .send({
        amount: fakeAmount,
        notes: fakeDescription,
      })
      .expect(422)

    // Request with empty notes
    // this should be treated as valid request
    await supertest(BASE_URL)
      .patch(`/${tempId}`)
      .send({
        amount: fakeAmount,
        transactionAt: transactionAt,
      })
      .expect(200)
  })

  test('ensure DELETE /transactions/:id', async () => {
    await supertest(BASE_URL).delete(`/${tempId}`).expect(204)

    const transaction = await Transaction.find(tempId)

    expect(transaction).to.be.null
  })

  test('ensure DELETE /transactions/:id throw 404 when delete non-exists transactions', async () => {
    const fakeId = datatype.uuid()
    const response = await supertest(BASE_URL).delete(`/${fakeId}`).expect(404)
    const { body } = response

    expect(get(body, 'success')).to.be.false
    expect(get(body, 'message')).to.equal('Transaction not found')
  })
})

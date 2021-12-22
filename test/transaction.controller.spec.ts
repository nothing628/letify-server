import test from 'japa'
import { assert, expect } from 'chai'
import supertest from 'supertest'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import moment from 'moment'
import { get } from 'lodash'
import { finance, date } from 'faker'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/transactions`

test.group('Test /transactions End-Point', (group) => {
  const fakeNotes = finance.transactionDescription()
  let tempId = ''
  let walletId = ''

  group.before(async () => {
    const wallet = new Wallet()
    wallet.label = finance.accountName()
    await wallet.save()

    walletId = wallet.id
  })

  test('ensure POST /transactions can store transaction to database', async (assert) => {
    const amount = parseFloat(finance.amount(0, 1000000, 0, ''))
    const transactionAt = date.past(1)
    const response = await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: walletId,
        amount: amount,
        notes: fakeNotes,
        transactionAt: transactionAt.toISOString(),
      })
      .expect(200)

    const { body } = response

    assert.deepNestedPropertyVal(body, 'success', true)
    assert.deepNestedPropertyVal(body, 'data.wallet_id', walletId)
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
        wallet_id: walletId,
        notes: fakeNotes,
        transactionAt: transactionAt.toISOString(),
      })
      .expect(422)

    // Request without transaction time
    await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: walletId,
        amount: amount,
        notes: fakeNotes,
      })
      .expect(422)

    // Request with empty notes
    // this should be treated as valid request
    await supertest(BASE_URL)
      .post('/')
      .send({
        wallet_id: walletId,
        amount: amount,
        notes: '',
        transactionAt: transactionAt.toISOString(),
      })
      .expect(200)
  })

  test('ensure GET /transaction can list all transaction', async () => {
    const response = await supertest(BASE_URL).get('/').expect(200)
    const { body } = response
    const transactions = await Transaction.all()
    const transactions_object = transactions.map(t => t.toJSON())

    assert.deepNestedPropertyVal(body, 'success', true)
    expect(get(body, 'data')).to.have.length(transactions.length)
    expect(get(body, 'data')).to.have.deep.members(transactions_object)
  })
})

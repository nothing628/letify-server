import test from 'japa'
import supertest from 'supertest'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import { name, finance, date } from 'faker'

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

  test('ensure POST /transactions can stroe transaction to database', async (assert) => {
    const amount = finance.amount(0, 1000000, 0, '')
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

    assert.deepEqual(body, {
      success: true,
      data: {
        wallet_id: walletId,
        amount: amount,
        notes: fakeNotes,
        transactionAt: transactionAt.toISOString(),
      },
    })
    const transaction = await Transaction.findBy('notes', fakeNotes)

    assert.isNotNull(transaction, 'Transaction should be exists in database')
    tempId = transaction?.id || ''
  })
})

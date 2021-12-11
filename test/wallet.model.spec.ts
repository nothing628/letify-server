import test from 'japa'
import Wallet from 'App/Models/Wallet'

test.group('Wallet Models', () => {
  test('ensure wallet can be saved', async (assert) => {
    const wallet = new Wallet()
    wallet.label = 'My Label'
    await wallet.save()

    assert.isNotEmpty(wallet.id)
    assert.equal(wallet.label, 'My Label')
    assert.isNotEmpty(wallet.createdAt)
    assert.isNotEmpty(wallet.updatedAt)
  })
})

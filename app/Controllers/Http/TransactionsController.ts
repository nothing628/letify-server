import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionCreateSchemaValidator from 'App/Validators/TransactionCreateSchemaValidator'
import TransactionUpdateSchemaValidator from 'App/Validators/TransactionUpdateSchemaValidator'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import has from 'lodash/has'
import get from 'lodash/get'

export default class TransactionsController {
  async index({ request, response }: HttpContextContract) {
    try {
      let transactions = await Transaction.all()
      const query = request.qs()

      if (has(query, 'wallet_id')) {
        const wallet_id = get(query, 'wallet_id')
        const wallet = await Wallet.findOrFail(wallet_id)

        transactions = await Transaction.query()
          .withScopes((scopes) => scopes.withWallet(wallet))
          .exec()
      }

      return {
        success: true,
        data: transactions,
      }
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Wallet not found',
      }
    }
  }

  async store({ request }: HttpContextContract) {
    const body = await request.validate(TransactionCreateSchemaValidator)
    const transaction = new Transaction()
    transaction.wallet_id = body['wallet_id']
    transaction.transactionAt = body['transactionAt']
    transaction.amount = body['amount']
    transaction.notes = body['notes'] || ''

    await transaction.save()

    return {
      success: true,
      data: {
        amount: body['amount'],
        notes: body['notes'],
        transactionAt: body['transactionAt'],
        wallet_id: body['wallet_id'],
      },
    }
  }

  async show({ params, response }: HttpContextContract) {
    const idTransaction = params['id']

    try {
      const transaction = await Transaction.findOrFail(idTransaction)

      return {
        success: true,
        data: transaction,
      }
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Transaction not found',
      }
    }
  }

  async update({ request, response, params }: HttpContextContract) {
    const idTransaction = params['id']
    const updateData = await request.validate(TransactionUpdateSchemaValidator)

    try {
      const transaction = await Transaction.findOrFail(idTransaction)
      transaction.amount = updateData.amount
      transaction.notes = updateData.notes || ''
      transaction.transactionAt = updateData.transactionAt

      await transaction.save()

      return {
        success: true,
        data: transaction,
      }
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Transaction not found',
      }
    }
  }

  async destroy({ params, response }: HttpContextContract) {
    const idTransaction = params['id']

    try {
      const transaction = await Transaction.findOrFail(idTransaction)

      await transaction.delete()

      response.status(204)
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Transaction not found',
      }
    }
  }
}

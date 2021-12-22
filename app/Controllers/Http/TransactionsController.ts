import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionCreateSchemaValidator from 'App/Validators/TransactionCreateSchemaValidator'
import TransactionUpdateSchemaValidator from 'App/Validators/TransactionUpdateSchemaValidator'
import Transaction from 'App/Models/Transaction'

export default class TransactionsController {
  async index() {
    const transactions = await Transaction.all()

    return {
      success: true,
      data: transactions,
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
  }

  async update({ request, response, params }: HttpContextContract) {
    const idTransaction = params['id']
  }

  async destroy({ params, response }: HttpContextContract) {
    const idTransaction = params['id']

    response.status(204)
  }
}

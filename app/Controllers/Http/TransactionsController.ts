import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionCreateSchemaValidationValidator from 'App/Validators/TransactionCreateSchemaValidationValidator'
import TransactionUpdateSchemaValidationValidator from 'App/Validators/TransactionUpdateSchemaValidationValidator'

export default class TransactionsController {
  async index() {}

  async store({ request }: HttpContextContract) {}

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

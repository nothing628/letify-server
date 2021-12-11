import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WalletCreateSchema from 'App/Validators/WalletCreateSchemaValidator'
import WalletUpdateSchema from 'App/Validators/WalletUpdateSchemaValidator'

export default class WalletsController {
  async index(ctx: HttpContextContract) {
    return {
      success: true,
    }
  }

  async store({ request }: HttpContextContract) {
    const createData = await request.validate(WalletCreateSchema)

    return {
      success: true,
    }
  }

  async show({ params }: HttpContextContract) {
    const idWallet = params['id']

    return {
      success: true,
    }
  }

  async update({ request, params }: HttpContextContract) {
    const idWallet = params['id']
    const updateData = await request.validate(WalletUpdateSchema)

    return {
      success: true,
    }
  }

  async destroy({ params }: HttpContextContract) {
    const idWallet = params['id']

    return {
      success: true,
    }
  }
}

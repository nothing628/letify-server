import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wallet from 'App/Models/Wallet'
import WalletCreateSchema from 'App/Validators/WalletCreateSchemaValidator'
import WalletUpdateSchema from 'App/Validators/WalletUpdateSchemaValidator'

export default class WalletsController {
  async index() {
    const wallets = await Wallet.all()

    return {
      success: true,
      data: wallets,
    }
  }

  async store({ request }: HttpContextContract) {
    const createData = await request.validate(WalletCreateSchema)
    const newWallet = new Wallet()
    newWallet.label = createData.label

    const result = await newWallet.save()

    return {
      success: true,
      data: {
        label: result.label,
      },
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

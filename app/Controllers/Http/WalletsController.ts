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

  async show({ params, response }: HttpContextContract) {
    const idWallet = params['id']

    try {
      const wallet = await Wallet.findOrFail(idWallet)

      return {
        success: true,
        data: wallet,
      }
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Wallet not found',
      }
    }
  }

  async update({ request, response, params }: HttpContextContract) {
    const idWallet = params['id']
    const updateData = await request.validate(WalletUpdateSchema)

    try {
      const wallet = await Wallet.findOrFail(idWallet)
      wallet.label = updateData.label

      await wallet.save()

      return {
        success: true,
        data: wallet,
      }
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Wallet not found',
      }
    }
  }

  async destroy({ params, response }: HttpContextContract) {
    const idWallet = params['id']

    try {
      const wallet = await Wallet.findOrFail(idWallet)

      await wallet.delete()

      response.status(204)
    } catch {
      response.status(404)
      return {
        success: false,
        message: 'Wallet not found',
      }
    }
  }
}

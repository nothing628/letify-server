import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WalletCreateSchemaValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ escape: true, trim: true }, [rules.maxLength(50), rules.minLength(3)]),
  })

  public messages = {}
}

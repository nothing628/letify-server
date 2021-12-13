import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TransactionCreateSchemaValidationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    wallet_id: schema.string({}, [rules.required(), rules.uuid()]),
    amount: schema.number([rules.required()]),
    notes: schema.string({ escape: true, trim: true }, [rules.minLength(0), rules.maxLength(1024)]),
    transactionAt: schema.date({}, [rules.required()]),
  })

  public messages = {}
}

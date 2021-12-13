import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Transaction extends BaseModel {
  public static table = 'transactions'

  @column({ isPrimary: true })
  public id: string

  @column()
  public wallet_id: string

  @column()
  public amount: number

  @column()
  public notes: string

  @column.dateTime()
  public transactionAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

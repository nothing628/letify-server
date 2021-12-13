import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Wallet from './Wallet'

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

  @belongsTo(() => Wallet, { foreignKey: 'wallet_id' })
  public wallet: BelongsTo<typeof Wallet>
}

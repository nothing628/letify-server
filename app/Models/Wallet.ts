import { DateTime } from 'luxon'
import { BaseModel, HasMany, hasMany, column } from '@ioc:Adonis/Lucid/Orm'
import Transaction from './Transaction'

export default class Wallet extends BaseModel {
  public static table = 'wallets'

  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Transaction, {
    foreignKey: 'wallet_id',
  })
  public transactions: HasMany<typeof Transaction>
}

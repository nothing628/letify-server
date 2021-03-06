import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateTransactionTables extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('wallet_id')
      table.decimal('amount', 50, 2)
      table.string('notes', 1024)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('transaction_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('wallet_id').references('id').inTable('wallets')
    })

    this.schema.raw(`alter table ${this.tableName} alter id set default gen_random_uuid()`)
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

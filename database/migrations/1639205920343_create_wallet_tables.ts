import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateWalletTables extends BaseSchema {
  protected tableName = 'wallets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.string('label', 50).notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.raw(`alter table ${this.tableName} alter id set default gen_random_uuid()`)
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

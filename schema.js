const { DatabaseSync } = require("node:sqlite")
const db = new DatabaseSync("database.db")

db.prepare(
  `CREATE TABLE IF NOT EXISTS StoreInfo (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  address TEXT,
  cash INTEGER,
  create_date INTEGER,
  last_modify_date INTEGER,
  logo BLOB
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Users (
  id INTEGER,
  name TEXT,
  password TEXT,
  role TEXT,
  access_modules TEXT,
  create_date INTEGER,
  last_modify_date INTEGER,
  last_login_date INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Customers (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  address TEXT,
  remark TEXT,
  dues INTEGER,
  create_date INTEGER,
  last_modify_date INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Companies (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  remark TEXT,
  dues INTEGER,
  order_day TEXT,
  delivery_day TEXT,
  create_date INTEGER,
  last_modify_date INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Types (
  id INTEGER,
  name TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Generics (
  id INTEGER,
  name TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Products (
  id INTEGER,
  name TEXT,
  company_id INTEGER,
  type_id INTEGER,
  generic_id INTEGER,
  min_stock INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Stocks (
  id INTEGER,
  batch_no TEXT,
  product_id INTEGER,
  purchase_id INTEGER,
  quantity INTEGER,
  purchase_price TEXT,
  sell_price TEXT,
  expire_date INTEGER,
  rack_no INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Purchases (
  id INTEGER,
  company_id INTEGER,
  invoice_no TEXT,
  invoice_date INTEGER,
  total_bill TEXT,
  discount INTEGER,
  payable_bill INTEGER,
  paid INTEGER,
  dues INTEGER,
  product_data TEXT,
  payment_data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS PurchaseReturns (
  id INTEGER,
  purchase_id INTEGER,
  date INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Sells (
  id INTEGER,
  customer_id INTEGER,
  payable INTEGER, 
  discount INTEGER, 
  paid INTEGER,
  dues INTEGER,
  date INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS SellReturns (
  id INTEGER,
  sell_id INTEGER,
  paid INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Ledgers (
  id INTEGER,
  type TEXT,
  table_name TEXT,
  table_id_name TEXT,
  table_id INTEGER,
  amount INTEGER,
  date INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Invests (
  id INTEGER,
  amount INTEGER,
  remark TEXT, 
  date INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Withdraws (
  id INTEGER,
  amount INTEGER,
  remark TEXT,
  date INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.close()

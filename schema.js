const { DatabaseSync } = require('node:sqlite')
const db = new DatabaseSync('database.db')

db.prepare(
  `CREATE TABLE IF NOT EXISTS StoreInfo (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  address TEXT,
  cash TEXT
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Users (
  id INTEGER,
  name TEXT,
  password TEXT,
  role TEXT,
  last_login INTEGER,
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
  dues TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Companies (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  remark TEXT,
  dues TEXT,
  order_day TEXT,
  delivery_day TEXT,
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
  company_id TEXT,
  invoice_no TEXT,
  date INTEGER,
  total_bill TEXT,
  payable TEXT,
  discount TEXT,
  paid TEXT,
  dues TEXT,
  data TEXT,
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
  date INTEGER,
  discount TEXT, 
  payable TEXT, 
  paid TEXT,
  dues TEXT,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS SellReturns (
  id INTEGER,
  sell_id INTEGER,
  paid TEXT,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.close()

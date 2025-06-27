const {DatabaseSync} = require("node:sqlite")
const db = new DatabaseSync("database.db")

db.prepare(
  `CREATE TABLE IF NOT EXISTS StoreInfo (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  address TEXT,
  cash INTEGER
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
  due INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Companies (
  id INTEGER,
  name TEXT,
  mobile TEXT,
  address TEXT,
  remark TEXT,
  due INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS ProductType (
  id INTEGER,
  name TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS GenericName (
  id INTEGER,
  name TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS ProductName (
  id INTEGER,
  name TEXT,
  company_id INTEGER,
  type_id INTEGER,
  generic_id INTEGER,
  min_stoke INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Stock (
  id INTEGER,
  product_id INTEGER,
  purchase_id INTEGER,
  quantity INTEGER,
  purchase_price INTEGER,
  sell_price INTEGER,
  expire_date INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()


db.prepare(
  `CREATE TABLE IF NOT EXISTS Purchase (
  id INTEGER,
  company_id TEXT,
  date INTEGER,
  type TEXT,
  discount INTEGER,
  payable INTEGER,
  paid INTEGER,
  due INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS PurchaseReturn (
  id INTEGER,
  purchase_id INTEGER,
  date INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS Sell (
  id INTEGER,
  customer_id INTEGER,
  date INTEGER,
  discount INTEGER, 
  payable INTEGER, 
  paid INTEGER,
  due INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()

db.prepare(
  `CREATE TABLE IF NOT EXISTS SellReturn (
  id INTEGER,
  sell_id INTEGER,
  paid INTEGER,
  data TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
)`
).run()


db.close()
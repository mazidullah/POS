import { showMessege } from "./messege.js"

const { DatabaseSync } = require("node:sqlite")

export function nextRowId(tableName) {
  const db = new DatabaseSync("database.db")
  const sql = `SELECT * FROM ${tableName}`

  const result = db.prepare(sql).all().length

  db.close()
  return result + 1
}

export function currentRowId(tableName) {
  const db = new DatabaseSync("database.db")
  const sql = `SELECT * FROM ${tableName}`

  const result = db.prepare(sql).all().length

  db.close()
  return result
}

export function hasData(tableName, columnName, data) {
  let hasData = false
  const datas = getDatasFrom(tableName)

  for (let i = 0; i < datas.length; i++) {
    if (datas[i][columnName] === data) {
      hasData = true
      break
    }
  }

  return hasData
}

export function getData(tableName, conditions) {
  const db = new DatabaseSync("database.db")
  const sql = `SELECT * FROM ${tableName} ${conditions}`

  const result = db.prepare(sql).get()

  db.close()
  return result
}

export function getAllData(tableName) {
  const db = new DatabaseSync("database.db")
  const sql = `SELECT * FROM ${tableName}`

  const result = db.prepare(sql).all()

  db.close()
  return result
}

export function insertInto(tableName, columns, values) {
  const db = new DatabaseSync("database.db")
  const qusmrk = new Array(columns.length).fill("?").join()
  const sql = `INSERT INTO ${tableName}(${columns.join(",")}) VALUES(${qusmrk})`

  const result = db.prepare(sql).run(...values)

  db.close()
  return result
}

export function updateInto(tableName, columns, values, conditions) {
  const db = new DatabaseSync("database.db")
  const clmQusPair = columns.map(c => ` ${c} = ?`).join()
  const sql = `UPDATE ${tableName} SET ${clmQusPair} ${conditions}`
  const result = db.prepare(sql).run(...values)

  db.close()
  return result
}

export function deleteFrom(tableName, conditions) {
  const db = new DatabaseSync("database.db")
  const sql = `DELETE FROM ${tableName}${conditions ? " " + conditions : ""}`

  const result = db.prepare(sql).run()

  db.close()
  return result
}

export function updateCash(toAdd) {
  let storeInfo = getData("StoreInfo", "Where id = 1")
  let cash = Number(storeInfo.cash)

  if (cash + toAdd < 0) {
    showMessege("Invalid Operation", "Have not sufficient cash")
    return new Error("Not Sufficient cash")
  } else {
    updateInto("StoreInfo", ["cash"], [String(cash + toAdd)], "where id = 1")
  }
}

export function updateCompanyDue(id, toAdd) {
  let company = getData("companies", `where id = ${id}`)
  let dues = company.dues
  updateInto("companies", ["dues"], [String(dues + toAdd)], `where id = ${id}`)
}

export function fillDatabase() {
  const fs = require("node:fs")
  const { DatabaseSync } = require("node:sqlite")
  const db = new DatabaseSync("database.db")

  const compFunc = (a, b) => {
    if (a.toUpperCase() < b.toUpperCase()) return -1
    else if (a.toUpperCase() > b.toUpperCase()) return 1
    else return 0
  }

  const datas = fs.readFileSync("data.csv", "utf-8").split("\n")

  let generics = new Set()
  let companies = new Set()
  let types = new Set()

  datas.forEach(d => {
    let data = d.split(",")

    generics.add(data[2])
    companies.add(data[3])
    types.add(data[4])
  })

  generics = [...generics]
  companies = [...companies]
  types = [...types]

  generics.sort(compFunc)
  companies.sort(compFunc)
  types.sort(compFunc)

  db.prepare("BEGIN TRANSACTION").run()
  generics.forEach(g => {
    db.prepare("INSERT INTO Generics(name) VALUES(?)").run(g)
  })
  db.prepare("COMMIT").run()

  db.prepare("BEGIN TRANSACTION").run()
  companies.forEach(c => {
    db.prepare(
      "INSERT INTO Companies(name, mobile, remark, dues, order_day, delivery_day) VALUES(?, ?, ?, ?, ?, ?)"
    ).run(c, "", "", "0", "", "")
  })
  db.prepare("COMMIT").run()

  db.prepare("BEGIN TRANSACTION").run()
  types.forEach(t => {
    db.prepare("INSERT INTO Types(name) VALUES(?)").run(t)
  })
  db.prepare("COMMIT").run()

  db.prepare("BEGIN TRANSACTION").run()
  datas.forEach(data => {
    let d = data.split(",")

    let g_id = db.prepare("Select id from Generics where name = ?").get(d[2]).id
    let c_id = db
      .prepare("Select id from Companies where name = ?")
      .get(d[3]).id
    let t_id = db.prepare("Select id from Types where name = ?").get(d[4]).id

    db.prepare(
      "insert into Products(name, generic_id, company_id, type_id, min_stock) values(?, ?, ?, ?, ?)"
    ).run(`${d[0]} ${d[1]}`, g_id, c_id, t_id, 0)
  })
  db.prepare("COMMIT").run()
}

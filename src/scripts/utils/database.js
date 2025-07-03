const { DatabaseSync } = require("node:sqlite")


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
  const sql = `DELETE FROM ${tableName}${conditions? " " + conditions:""}`
  
  const result = db.prepare(sql).run()
  
  db.close()
  return result
}

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

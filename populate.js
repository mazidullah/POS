const fs = require("fs")
const results = []

const companies = new Set()
const generics = new Set()
const types = new Set()

const { DatabaseSync } = require("node:sqlite")
const db = new DatabaseSync("database.db")

try {
  let storeInfo = db.prepare("SELECT * FROM StoreInfo").get(1)
} catch (err) {
  // populate the database
  let file_content = fs.readFileSync("data.csv", "utf8")
  let lines = file_content.split("\n")

  lines.forEach(line => {
    let data = line.split(",")

    results.push({
      name: data[0],
      strength: data[1],
      generic: data[2],
      company: data[3],
      type: data[4],
    })
  })

  results.forEach(r => {
    companies.add(r.company)
    generics.add(r.generic)
    types.add(r.type)
  })

  companies.forEach(c => {
    db.prepare("insert into Companies(name) values(?)").run(c)
  })

  generics.forEach(g => {
    db.prepare("insert into Generics(name) values(?)").run(g)
  })

  types.forEach(t => {
    db.prepare("insert into Types(name) values(?)").run(t)
  })

  results.forEach(r => {
    let comapny_id = db
      .prepare("select id from Companies where name = ?")
      .get(r.company)
    let generic_id = db
      .prepare("select id from Generics where name = ?")
      .get(r.generic)
    let type_id = db.prepare("select id from Types where name = ?").get(r.type)

    db.prepare(
      "insert into Products(name, company_id, generic_id, type_id) values(?, ?, ?, ?)"
    ).run(`${r.name}${r.strength}`, comapny_id.id, generic_id.id, type_id.id)
  })

  db.close()
}

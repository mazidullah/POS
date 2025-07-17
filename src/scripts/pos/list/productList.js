import { delayFocus, intInput, enterToNextInput } from "../../utils/utils.js"
import { getData, updateInto, nextRowId } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getProducts(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name_asc")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Products.name)`
    )
  else if (sortBy === "name_des")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Products.name) DESC`
    )
  else if (sortBy === "id_asc")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY Products.id`
    )
  else if (sortBy === "id_des")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY Products.id DESC`
    )
  else if (sortBy === "generic_asc")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Generics.name)`
    )
  else if (sortBy === "generic_des")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Generics.name) DESC`
    )
  else if (sortBy === "type_asc")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Types.name)`
    )
  else if (sortBy === "type_des")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Types.name) DESC`
    )
  else if (sortBy === "company_asc")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Companies.name)`
    )
  else if (sortBy === "company_des")
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Companies.name) DESC`
    )

  const products = stmt.all()
  db.close()
  return products
}

function sanitize(searchTerm, products) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  products.forEach(product => {
    if (product.id == searchTerm) {
      startsWith.add(product)
      return
    }

    if (product.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (product.gn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (product.cn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (product.tn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (niddle.test(product.name)) {
      possibleNameMatch.add(product)
      return
    }

    if (niddle.test(product.gn)) {
      possibleNameMatch.add(product)
      return
    }

    if (niddle.test(product.cn)) {
      possibleNameMatch.add(product)
      return
    }

    if (niddle.test(product.tn)) {
      possibleNameMatch.add(product)
      return
    }
  })

  const sanitized = [...startsWith, ...possibleNameMatch]

  return sanitized
}

function render() {
  let searchTerm = productListSearch.value.trim()
  let display_per_page = Number(productListDisplayPerPage.value) || 100
  let goto_page = Number(productListGotoPage.value) || 1
  let sortBy = productListSortBy.value

  const allSortedData = sanitize(searchTerm, getProducts(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)
  productListPossiblePage.innerHTML = possiblePage

  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""
  toRenderData.forEach(list => {
    htmlString += `
        <tr>
          <td>${list.id < 10 ? "0" + list.id : list.id}</td>
          <td>${list.tn}</td>
          <td>${list.name}</td>
          <td>${list.gn}</td>
          <td>${list.cn}</td>
        </tr>
      `
  })

  productList.querySelector("tbody").innerHTML = ""
  productList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([productListSearch, productListGotoPage, productListSearch])
enterToNextInput([
  editProductListName,
  editProductListGenericId,
  editProductListTypeId,
  editProductListCompanyId,
  editProductListOk,
])

intInput(productListDisplayPerPage)
intInput(productListGotoPage)
intInput(editProductListGenericId)
intInput(editProductListTypeId)
intInput(editProductListCompanyId)

document
  .querySelector("nav li[data-navitem='productList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(productListSearch)
    render()
  })

productListSearch.addEventListener("input", render)
productListSortBy.addEventListener("input", render)
productListDisplayPerPage.addEventListener("keyup", render)
productListGotoPage.addEventListener("keyup", render)
productListDisplayPerPage.addEventListener("blur", () => {
  productListDisplayPerPage.value > 0
    ? ""
    : (productListDisplayPerPage.value = 100)
})
productListGotoPage.addEventListener("blur", () => {
  productListGotoPage.value > 0 ? "" : (productListGotoPage.value = 1)
})

productListTbody.addEventListener("click", e => {
  let tdatas = e.target.closest("tr").querySelectorAll("td")
  let id = Number(tdatas[0].innerHTML)
  let type = tdatas[1].innerHTML
  let typeId = getData("Types", `where name = '${type.trim()}'`).id
  let name = tdatas[2].innerHTML
  let generic = tdatas[3].innerHTML
  let genericId = getData("Generics", `where name = '${generic.trim()}'`).id
  let company = tdatas[4].innerHTML
  let companyId = getData("Companies", `where name = '${company.trim()}'`).id

  editProductListId.value = id
  editProductListName.value = name
  editProductListGenericId.value = genericId
  editProductListTypeId.value = typeId
  editProductListCompanyId.value = companyId

  editProductList.showModal()
})

editProductListCancel.addEventListener("click", () => {
  editProductList.close()
})

editProductListOk.addEventListener("click", () => {
  try {
    if (
      nextRowId("Generics") <= editProductListGenericId.value.trim() ||
      nextRowId("Types") <= editProductListTypeId.value.trim() ||
      nextRowId("Companies") <= editProductListCompanyId.value.trim()
    )
      throw new Error("Invaild Id")

    updateInto(
      "Products",
      ["name", "generic_id", "type_id", "company_id"],
      [
        editProductListName.value.trim(),
        editProductListGenericId.value.trim(),
        editProductListTypeId.value.trim(),
        editProductListCompanyId.value.trim(),
      ],
      `Where id = ${editProductListId.value.trim()}`
    )

    showMessege(
      "Successfully Updated",
      `Product Id: ${Number(editProductListId.value)}`
    )

    editProductList.close()
    render()
  } catch (err) {
    showMessege("Cannot Updated", `One or Multiple value are Invalid`)
  }
})

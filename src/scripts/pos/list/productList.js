import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { getData } from "../../utils/database.js"
import { updateInto } from "../../utils/database.js"
import { nextRowId } from "../../utils/database.js"
import { currentRowId } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getProducts(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Products.name)`
    )
  else if (sortBy === "name_des")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Products.name) DESC`
    )
  else if (sortBy === "id")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY Products.id`
    )
  else if (sortBy === "id_des")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY Products.id DESC`
    )
  else if (sortBy === "generic")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Generics.name)`
    )
  else if (sortBy === "generic_des")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Generics.name) DESC`
    )
  else if (sortBy === "type")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Types.name)`
    )
  else if (sortBy === "type_des")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Types.name) DESC`
    )
  else if (sortBy === "company")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Companies.name)`
    )
  else if (sortBy === "company_des")
    stmt = db.prepare(
      `SELECT 
      Products.id as productID, 
      Products.name as productName, 
      Products.min_stock as minStock, 
      Types.name as typeName, 
      Generics.name as genericName, 
      Companies.name as companyName from Products 
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

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  products.forEach(product => {
    if (product.productID === Number(searchTerm)) {
      exactMatch.add(product)
      return
    }

    if (product.productName.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (product.genericName.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (product.typeName.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (product.companyName.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (
      product.productName.toUpperCase().startsWith(searchTerm.toUpperCase())
    ) {
      startsWith.add(product)
      return
    }

    if (
      product.genericName.toUpperCase().startsWith(searchTerm.toUpperCase())
    ) {
      startsWith.add(product)
      return
    }

    if (product.typeName.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (
      product.companyName.toUpperCase().startsWith(searchTerm.toUpperCase())
    ) {
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

    if (niddle.test(product.tn)) {
      possibleNameMatch.add(product)
      return
    }

    if (niddle.test(product.cn)) {
      possibleNameMatch.add(product)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleNameMatch]
}

export function render() {
  let searchTerm = productListSearch.value.trim()
  let display_per_page = Number(productListDisplayPerPage.value)
  let sortBy = productListSortBy.value

  const allSortedData = sanitize(searchTerm, getProducts(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  productListPossiblePage.innerHTML = possiblePage
  productListGotoPage.value > possiblePage
    ? (productListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(productListGotoPage.value) || 1
  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""
  toRenderData.forEach((list, i) => {
    htmlString += `
        <tr data-id="${list.productID}">
          <td>${i + 1}</td>
          <td>${list.productID}</td>
          <td>${list.typeName}</td>
          <td>${list.productName}</td>
          <td>${list.genericName}</td>
          <td>${list.companyName}</td>
          <td>${list.minStock}</td>
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
  editProductListSave,
])

intInput(productListGotoPage, 1)
intInput(editProductListGenericId, 1)
intInput(editProductListTypeId, 1)
intInput(editProductListCompanyId, 1)

document
  .querySelector("nav li[data-navitem='productList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(productListSearch)
    render()
  })

productListSearch.addEventListener("input", () => {
  productListGotoPage.value = 1
  render()
})

productListSortBy.addEventListener("input", render)

productListDisplayPerPage.addEventListener("input", () => {
  productListGotoPage.value = 1
  render()
})

productListGotoPage.addEventListener("keyup", render)

productListGotoPage.addEventListener("blur", () => {
  productListGotoPage.value > 0 ? "" : (productListGotoPage.value = 1)
})

productListCreate.addEventListener("click", () => {
  createProduct.showModal()
  createProductId.value = nextRowId("Products")
  delayFocus(createProductName)
})

productListTbody.addEventListener("click", e => {
  let tr = e.target.closest("tr")
  let id = Number(tr.dataset["id"])

  let product = getData("Products", `WHERE id = ${id}`)

  editProductListId.value = id
  editProductListName.value = product.name
  editProductListGenericId.value = product.generic_id
  editProductListTypeId.value = product.type_id
  editProductListCompanyId.value = product.company_id

  editProductList.showModal()
})

editProductListClose.addEventListener("click", () => {
  editProductList.close()
})

editProductListCancel.addEventListener("click", () => {
  editProductList.close()
})

editProductListSave.addEventListener("click", () => {
  let genericId = Number(editProductListGenericId.value.trim())
  let minGenericId = 1
  let maxGenericId = currentRowId("Generics")

  let typeId = Number(editProductListTypeId.value.trim())
  let minTypeId = 1
  let maxTypeId = currentRowId("Types")

  let companyId = Number(editProductListCompanyId.value.trim())
  let minCompanyId = 1
  let maxCompanyId = currentRowId("Companies")

  if (genericId < minGenericId || genericId > maxGenericId) {
    showMessege(
      "Invalid generic id",
      `Generic id should be between ${minGenericId}-${maxGenericId}`
    )
    delayFocus(editProductListGenericId)
    return
  }

  if (typeId < minTypeId || typeId > maxTypeId) {
    showMessege(
      "Invalid type id",
      `Type id should be between ${minTypeId}-${maxTypeId}`
    )
    delayFocus(editProductListTypeId)
    return
  }

  if (companyId < minCompanyId || companyId > maxCompanyId) {
    showMessege(
      "Invalid company id",
      `Company id should be between ${minCompanyId}-${maxCompanyId}`
    )
    delayFocus(editProductListCompanyId)
    return
  }

  updateInto(
    "Products",
    ["name", "generic_id", "type_id", "company_id"],
    [
      editProductListName.value.trim(),
      editProductListGenericId.value.trim(),
      editProductListTypeId.value.trim(),
      editProductListCompanyId.value.trim(),
    ],
    `Where id = ${Number(editProductListId.value.trim())}`
  )

  showMessege(
    "Successfully Updated",
    `Product Id: ${Number(editProductListId.value)}`
  )

  editProductList.close()
  render()
  delayFocus(productListSearch)
})

import { padZero } from '../../utils/utils.js'
import { delayFocus } from '../../utils/utils.js'
import { intInput } from '../../utils/utils.js'
import { enterToNextInput } from '../../utils/utils.js'
import { getData } from '../../utils/database.js'
import { updateInto } from '../../utils/database.js'
import { nextRowId } from '../../utils/database.js'
import { showMessege } from '../../utils/messege.js'

function getProducts(sortBy) {
  const { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')
  let stmt

  if (sortBy === 'name')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Products.name)`
    )
  else if (sortBy === 'name_des')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Products.name) DESC`
    )
  else if (sortBy === 'id')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY Products.id`
    )
  else if (sortBy === 'id_des')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY Products.id DESC`
    )
  else if (sortBy === 'generic')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Generics.name)`
    )
  else if (sortBy === 'generic_des')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Generics.name) DESC`
    )
  else if (sortBy === 'type')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Types.name)`
    )
  else if (sortBy === 'type_des')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Types.name) DESC`
    )
  else if (sortBy === 'company')
    stmt = db.prepare(
      `SELECT Products.id, Products.name, Types.name as tn, Generics.name as gn, Companies.name as cn 
      from Products
      INNER JOIN Types ON Types.id = Products.type_id 
      INNER JOIN Generics ON Generics.id = Products.generic_id 
      INNER JOIN Companies ON Companies.id = Products.company_id 
      ORDER BY UPPER(Companies.name)`
    )
  else if (sortBy === 'company_des')
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

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, 'i')
  } catch (err) {
    niddle = new RegExp('')
  }

  products.forEach(product => {
    if (product.id === Number(searchTerm)) {
      exactMatch.add(product)
      return
    }

    if (product.name.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (product.gn.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (product.tn.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
      return
    }

    if (product.cn.toUpperCase() === searchTerm.toUpperCase()) {
      exactMatch.add(product)
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

    if (product.tn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (product.cn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
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
    : ''

  let goto_page = Number(productListGotoPage.value) || 1
  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ''
  toRenderData.forEach(list => {
    htmlString += `
        <tr data-id="${list.id}">
          <td>${padZero(list.id)}</td>
          <td>${list.tn}</td>
          <td>${list.name}</td>
          <td>${list.gn}</td>
          <td>${list.cn}</td>
        </tr>
      `
  })

  productList.querySelector('tbody').innerHTML = ''
  productList.querySelector('tbody').innerHTML = htmlString
}

enterToNextInput([productListSearch, productListGotoPage, productListSearch])
enterToNextInput([
  editProductListName,
  editProductListGenericId,
  editProductListTypeId,
  editProductListCompanyId,
  editProductListOk
])

intInput(productListGotoPage, 1)
intInput(editProductListGenericId, 1)
intInput(editProductListTypeId, 1)
intInput(editProductListCompanyId, 1)

document
  .querySelector("nav li[data-navitem='productList']")
  .closest('li')
  .addEventListener('click', () => {
    delayFocus(productListSearch)
    render()
  })

productListSearch.addEventListener('input', () => {
  productListGotoPage.value = 1
  render()
})

productListSortBy.addEventListener('input', render)

productListDisplayPerPage.addEventListener('input', () => {
  productListGotoPage.value = 1
  render()
})

productListGotoPage.addEventListener('keyup', render)

productListGotoPage.addEventListener('blur', () => {
  productListGotoPage.value > 0 ? '' : (productListGotoPage.value = 1)
})

productListCreate.addEventListener('click', () => {
  createProduct.showModal()
  createProductId.value = nextRowId('Products')
  delayFocus(createProductName)
})

productListTbody.addEventListener('click', e => {
  let tr = e.target.closest('tr')
  let id = Number(tr.dataset['id'])

  let product = getData('Products', `WHERE id = ${id}`)

  editProductListId.value = id
  editProductListName.value = product.name
  editProductListGenericId.value = product.generic_id
  editProductListTypeId.value = product.type_id
  editProductListCompanyId.value = product.company_id

  editProductList.showModal()
})

editProductListCancel.addEventListener('click', () => {
  editProductList.close()
})

editProductListOk.addEventListener('click', () => {
  try {
    if (
      nextRowId('Generics') <= editProductListGenericId.value.trim() ||
      nextRowId('Types') <= editProductListTypeId.value.trim() ||
      nextRowId('Companies') <= editProductListCompanyId.value.trim()
    )
      throw new Error('Invaild Id')

    updateInto(
      'Products',
      ['name', 'generic_id', 'type_id', 'company_id'],
      [
        editProductListName.value.trim(),
        editProductListGenericId.value.trim(),
        editProductListTypeId.value.trim(),
        editProductListCompanyId.value.trim()
      ],
      `Where id = ${editProductListId.value.trim()}`
    )

    showMessege(
      'Successfully Updated',
      `Product Id: ${Number(editProductListId.value)}`
    )

    editProductList.close()
    render()
  } catch (err) {
    showMessege('Cannot Updated', `One or Multiple value are Invalid`)
  }
})

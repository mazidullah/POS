import {
  delayFocus,
  intInput,
  enterToNextInput,
  mobileInput
} from '../../utils/utils.js'
import { updateInto } from '../../utils/database.js'
import { showMessege } from '../../utils/messege.js'

function getCustomers(sortBy) {
  const { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')
  let stmt

  if (sortBy === 'name_asc')
    stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(name) ASC`)
  else if (sortBy === 'name_des')
    stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(name) DESC`)
  else if (sortBy === 'id_asc')
    stmt = db.prepare(`SELECT * from Customers ORDER BY id`)
  else if (sortBy === 'id_des')
    stmt = db.prepare(`SELECT * from Customers ORDER BY id DESC`)
  else if (sortBy === 'mobile_asc')
    stmt = db.prepare(`SELECT * from Customers ORDER BY mobile`)
  else if (sortBy === 'mobile_des')
    stmt = db.prepare(`SELECT * from Customers ORDER BY mobile DESC`)
  else if (sortBy === 'address_asc')
    stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(address)`)
  else if (sortBy === 'address_des')
    stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(address) DESC`)
  else if (sortBy === 'remark_asc')
    stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(remark)`)
  else if (sortBy === 'remark_des')
    stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(remark) DESC`)
  else if (sortBy === 'due_asc')
    stmt = db.prepare(`SELECT * from Customers ORDER BY dues`)
  else if (sortBy === 'due_des')
    stmt = db.prepare(`SELECT * from Customers ORDER BY dues DESC`)

  const customers = stmt.all()
  db.close()
  return customers
}

function sanitize(searchTerm, customers) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, 'i')
  } catch (err) {
    niddle = new RegExp('')
  }

  customers.forEach(customer => {
    if (customer.id == searchTerm) {
      startsWith.add(customer)
      return
    }

    if (customer.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.mobile.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.address.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.remark.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.dues.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (niddle.test(customer.name)) {
      possibleNameMatch.add(customer)
      return
    }

    if (niddle.test(customer.mobile)) {
      possibleNameMatch.add(customer)
      return
    }

    if (niddle.test(customer.address)) {
      possibleNameMatch.add(customer)
      return
    }

    if (niddle.test(customer.remark)) {
      possibleNameMatch.add(customer)
      return
    }

    if (niddle.test(customer.dues)) {
      possibleNameMatch.add(customer)
      return
    }
  })

  const sanitized = [...startsWith, ...possibleNameMatch]

  return sanitized
}

function render() {
  let searchTerm = customerListSearch.value.trim()
  let display_per_page = Number(customerListDisplayPerPage.value) || 100
  let goto_page = Number(customerListGotoPage.value) || 1
  let sortBy = customerListSortBy.value

  const allSortedData = sanitize(searchTerm, getCustomers(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)
  customerListPossiblePage.innerHTML = possiblePage

  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ''
  toRenderData.forEach(list => {
    let hasDue = Number(list.dues) > 0
    htmlString += `
        <tr>
          <td>${list.id < 10 ? '0' + list.id : list.id}</td>
          <td>${list.name}</td>
          <td>${list.address || ''}</td>
          <td>${list.mobile || ''}</td>
          <td>${list.remark || ''}</td>
          <td ${hasDue ? "style='background-color: #ff000050'" : ''}>${
      list.dues
    }</td>
        </tr>
      `
  })

  customerList.querySelector('tbody').innerHTML = ''
  customerList.querySelector('tbody').innerHTML = htmlString
}

enterToNextInput([customerListSearch, customerListGotoPage, customerListSearch])
enterToNextInput([
  editCustomerListName,
  editCustomerListAddress,
  editCustomerListMobile,
  editCustomerListRemark,
  editCustomerListOk
])

intInput(customerListDisplayPerPage)
intInput(customerListGotoPage)
mobileInput(editCustomerListMobile)

document
  .querySelector("nav li[data-navitem='customerList']")
  .closest('li')
  .addEventListener('click', () => {
    delayFocus(customerListSearch)
    render()
  })

customerListSearch.addEventListener('input', render)
customerListSortBy.addEventListener('input', render)
customerListDisplayPerPage.addEventListener('keyup', render)
customerListGotoPage.addEventListener('keyup', render)
customerListDisplayPerPage.addEventListener('blur', () => {
  customerListDisplayPerPage.value > 0
    ? ''
    : (customerListDisplayPerPage.value = 100)
})
customerListGotoPage.addEventListener('blur', () => {
  customerListGotoPage.value > 0 ? '' : (customerListGotoPage.value = 1)
})

customerListTbody.addEventListener('click', e => {
  let tdatas = e.target.closest('tr').querySelectorAll('td')
  let id = Number(tdatas[0].innerHTML)
  let name = tdatas[1].innerHTML
  let address = tdatas[2].innerHTML
  let mobile = tdatas[3].innerHTML
  let remark = tdatas[4].innerHTML

  editCustomerListId.value = id
  editCustomerListName.value = name
  editCustomerListAddress.value = address
  editCustomerListMobile.value = mobile
  editCustomerListRemark.value = remark
  editCustomerList.showModal()
})

editCustomerListCancel.addEventListener('click', () => {
  editCustomerList.close()
})

editCustomerListOk.addEventListener('click', () => {
  try {
    updateInto(
      'Customers',
      ['name', 'address', 'mobile', 'remark'],
      [
        editCustomerListName.value.trim(),
        editCustomerListAddress.value.trim(),
        editCustomerListMobile.value.trim(),
        editCustomerListRemark.value.trim()
      ],
      `Where id = ${editCustomerListId.value.trim()}`
    )

    showMessege(
      'Successfully Updated',
      `Product Id: ${Number(editCustomerListId.value)}`
    )

    editCustomerList.close()
    render()
  } catch (err) {
    console.dir(err)
    showMessege('Cannot Updated', `One or Multiple value are Invalid`)
  }
})

import {
  enterToNextInput,
  delayFocus,
  suggestionHandler,
  intInput,
} from "../utils/utils.js"
import { showMessege } from "../utils/messege.js"
import { insertInto, nextRowId, getAllData } from "../utils/database.js"

const navbarName = "createProduct"
const tableName = "Products"
const fieldNames = ["name", "company_id", "type_id", "generic_id", "min_stock"]
const navbar = document.querySelector(`li[data-navitem="${navbarName}"]`)

enterToNextInput([
  newProductName,
  newProductCompanyName,
  newProductGenericName,
  newProductTypeName,
  newProductMinStock,
  createNewProduct,
])

suggestionHandler(
  newProductCompanyName,
  newProductCompanyNameSuggetions,
  renderCompanySuggetions
)
suggestionHandler(
  newProductGenericName,
  newProductGenericNameSuggetions,
  renderGenericSuggetions
)
suggestionHandler(
  newProductTypeName,
  newProductTypeNameSuggetions,
  renderTepeSuggetions
)

intInput(newProductMinStock)

function renderCompanySuggetions(searchTerm) {
  newProductCompanyNameSuggetions.innerHTML = ""

  if (searchTerm) {
    const companies = getAllData("Companies")
    let niddle
    try {
      niddle = new RegExp(searchTerm, "i")
    } catch (err) {
      niddle = new RegExp("")
    }
    const possibleNameMatch = []

    companies.forEach(company => {
      if (niddle.test(company.name)) {
        possibleNameMatch.push(company)
        return
      }
    })

    const sortedNameMatch = possibleNameMatch.sort((a, b) => a.name - b.name)
    const nextRenderList = [...sortedNameMatch]

    let htmlString = ""
    nextRenderList.forEach(list => {
      htmlString += `
        <div>
          <span>${list.id}</span>
          <span>${list.name}</span>
        </div>
      `
    })

    newProductCompanyNameSuggetions.innerHTML = htmlString
  }
}

function renderGenericSuggetions(searchTerm) {
  newProductGenericNameSuggetions.innerHTML = ""

  if (searchTerm) {
    const generics = getAllData("Generics")
    let niddle
    try {
      niddle = new RegExp(searchTerm, "i")
    } catch (err) {
      niddle = new RegExp("")
    }
    const possibleNameMatch = []

    generics.forEach(generic => {
      if (niddle.test(generic.name)) {
        possibleNameMatch.push(generic)
        return
      }
    })

    const sortedNameMatch = possibleNameMatch.sort((a, b) => a.name - b.name)
    const nextRenderList = [...sortedNameMatch]

    let htmlString = ""
    nextRenderList.forEach(list => {
      htmlString += `
        <div>
          <span>${list.id}</span>
          <span>${list.name}</span>
        </div>
      `
    })

    newProductGenericNameSuggetions.innerHTML = htmlString
  }
}

function renderTepeSuggetions(searchTerm) {
  newProductTypeNameSuggetions.innerHTML = ""

  if (searchTerm) {
    const types = getAllData("Types")
    let niddle
    try {
      niddle = new RegExp(searchTerm, "i")
    } catch (err) {
      niddle = new RegExp("")
    }
    const possibleNameMatch = []

    types.forEach(type => {
      if (niddle.test(type.name)) {
        possibleNameMatch.push(type)
        return
      }
    })

    const sortedNameMatch = possibleNameMatch.sort((a, b) => a.name - b.name)
    const nextRenderList = [...sortedNameMatch]

    let htmlString = ""
    nextRenderList.forEach(list => {
      htmlString += `
        <div>
          <span>${list.id}</span>
          <span>${list.name}</span>
        </div>
      `
    })

    newProductTypeNameSuggetions.innerHTML = htmlString
  }
}

// function checkIdName(id, name, tableName) {
//   if(id && id < 0) id =
// }

navbar.addEventListener("click", () => {
  newProductId.value = nextRowId(tableName)
  delayFocus(newProductName)
})

createNewProduct.addEventListener("click", () => {
  const name = newProductName.value.trim()

  const company_id = newProductCompanyNameSuggetions.dataset.id
  const comapny_name = newProductCompanyName.value.trim()

  const generic_id = newProductGenericNameSuggetions.dataset.id
  const generic_name = newProductGenericName.value.trim()

  const type_id = newProductTypeNameSuggetions.dataset.id
  const type_name = newProductTypeName.value.trim()

  if (checkIdName(company_id, comapny_name, "Companies"))
    if (checkIdName(generic_id, generic_name, "Generics"))
      if (checkIdName(type_id, type_name, "Types"))
        if (name.length === 0) {
          showMessege("Invalid name", "Product name must not empty!")
          delayFocus(newProductName)
          return
        }

  insertInto(tableName, fieldNames, [name, address, mobile, dues, remark])
  showMessege("Successfully Created", `Username: ${newProductName.value}`)

  newProductName.value = ""
  newProductAddress.value = ""
  newProductMobile.value = ""
  newProductRemark.value = ""

  delayFocus(newProductName)
  newProductId.value = nextRowId(tableName)
})

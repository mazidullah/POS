import {
  enterToNextInput,
  delayFocus,
  suggestionHandler,
  intInput,
} from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId, getAllData } from "../../utils/database.js"

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
  renderTypeSuggetions
)

intInput(newProductMinStock)

function renderCompanySuggetions(searchTerm) {
  newProductCompanyNameSuggetions.innerHTML = ""

  if (searchTerm) {
    const companies = getAllData("Companies")

    let niddle
    const startsWith = []
    const possibleNameMatch = []

    try {
      niddle = new RegExp(searchTerm, "i")
    } catch (err) {
      niddle = new RegExp("")
    }

    companies.forEach(company => {
      if (company.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
        startsWith.push(company)
        return
      }

      if (niddle.test(company.name)) {
        possibleNameMatch.push(company)
        return
      }
    })

    const sortedStartsWith = startsWith.sort((a, b) => a.name - b.name)
    const sortedNameMatch = possibleNameMatch.sort((a, b) => a.name - b.name)
    const nextRenderList = [...sortedStartsWith, ...sortedNameMatch]

    let htmlString = ""
    nextRenderList.forEach(list => {
      htmlString += `
        <div>
          <span class='suggetionIdSpan'>${list.id}</span>
          <span class='suggetionDataSpan'>${list.name}</span>
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
    const startsWith = []
    const possibleNameMatch = []

    try {
      niddle = new RegExp(searchTerm, "i")
    } catch (err) {
      niddle = new RegExp("")
    }

    generics.forEach(generic => {
      if (generic.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
        startsWith.push(generic)
        return
      }

      if (niddle.test(generic.name)) {
        possibleNameMatch.push(generic)
        return
      }
    })

    const sortedStartsWith = startsWith.sort((a, b) => a.name - b.name)
    const sortedNameMatch = possibleNameMatch.sort((a, b) => a.name - b.name)
    const nextRenderList = [...sortedStartsWith, ...sortedNameMatch]

    let htmlString = ""
    nextRenderList.forEach(list => {
      htmlString += `
        <div>
          <span class='suggetionIdSpan'>${list.id}</span>
          <span class='suggetionDataSpan'>${list.name}</span>
        </div>
      `
    })

    newProductGenericNameSuggetions.innerHTML = htmlString
  }
}

function renderTypeSuggetions(searchTerm) {
  newProductTypeNameSuggetions.innerHTML = ""

  if (searchTerm) {
    const types = getAllData("Types")

    let niddle
    const startsWith = []
    const possibleNameMatch = []

    try {
      niddle = new RegExp(searchTerm, "i")
    } catch (err) {
      niddle = new RegExp("")
    }

    types.forEach(type => {
      if (type.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
        startsWith.push(type)
        return
      }

      if (niddle.test(type.name)) {
        possibleNameMatch.push(type)
        return
      }
    })

    const sortedStartsWith = startsWith.sort((a, b) => a.name - b.name)
    const sortedNameMatch = possibleNameMatch.sort((a, b) => a.name - b.name)
    const nextRenderList = [...sortedStartsWith, ...sortedNameMatch]

    let htmlString = ""
    nextRenderList.forEach(list => {
      htmlString += `
        <div>
          <span class='suggetionIdSpan'>${list.id}</span>
          <span class='suggetionDataSpan'>${list.name}</span>
        </div>
      `
    })

    newProductTypeNameSuggetions.innerHTML = htmlString
  }
}

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

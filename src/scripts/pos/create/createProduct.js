import { enterToNextInput } from "../../utils/utils.js"
import { delayFocus } from "../../utils/utils.js"
import { suggestionHandler } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId, getAllData } from "../../utils/database.js"
import { render } from "../list/productList.js"

const tableName = "Products"
const fieldNames = ["name", "company_id", "generic_id", "type_id", "min_stock"]
const navbars = document.querySelectorAll(`.createProduct`)

intInput(createProductMinStock, 0)
enterToNextInput([
  createProductName,
  createProductCompanyName,
  createProductGenericName,
  createProductTypeName,
  createProductMinStock,
  createProductCreate,
])

suggestionHandler(
  createProductCompanyName,
  createProductCompanyNameSuggetions,
  renderCompanySuggetions
)
suggestionHandler(
  createProductGenericName,
  createProductGenericNameSuggetions,
  renderGenericSuggetions
)
suggestionHandler(
  createProductTypeName,
  createProductTypeNameSuggetions,
  renderTypeSuggetions
)

function renderCompanySuggetions(searchTerm) {
  createProductCompanyNameSuggetions.innerHTML = ""

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

    createProductCompanyNameSuggetions.innerHTML = htmlString
  }
}

function renderGenericSuggetions(searchTerm) {
  createProductGenericNameSuggetions.innerHTML = ""

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

    createProductGenericNameSuggetions.innerHTML = htmlString
  }
}

function renderTypeSuggetions(searchTerm) {
  createProductTypeNameSuggetions.innerHTML = ""

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

    createProductTypeNameSuggetions.innerHTML = htmlString
  }
}

createProductClose.addEventListener("click", () => {
  createProduct.close()
})

createProductCancel.addEventListener("click", () => {
  createProduct.close()
})

createProductCreate.addEventListener("click", () => {
  const name = createProductName.value.trim()

  const company_id = createProductCompanyNameSuggetions.dataset.id
  const generic_id = createProductGenericNameSuggetions.dataset.id
  const type_id = createProductTypeNameSuggetions.dataset.id
  const min_stock = createProductMinStock.value.trim() || 0

  if (name.length === 0) {
    showMessege("Invalid name", "Product name must not empty!")
    delayFocus(createProductName)
    return
  }

  if (company_id === "0") {
    showMessege("Invalid company name", "Select a valid company!")
    delayFocus(createProductCompanyName)
    return
  }

  if (generic_id === "0") {
    showMessege("Invalid generic name", "Select a valid generic!")
    delayFocus(createProductGenericName)
    return
  }

  if (type_id === "0") {
    showMessege("Invalid type name", "Select a valid type!")
    delayFocus(createProductTypeName)
    return
  }

  insertInto(tableName, fieldNames, [
    name,
    company_id,
    generic_id,
    type_id,
    min_stock,
  ])
  showMessege("Successfully Created", `Username: ${createProductName.value}`)

  createProductName.value = ""
  createProductCompanyName.value = ""
  createProductGenericName.value = ""
  createProductTypeName.value = ""
  createProductMinStock.value = ""

  render()
  delayFocus(createProductName)
  createProductId.value = nextRowId(tableName)
})

navbars.forEach(navbar => {
  navbar.addEventListener("click", () => {
    createProduct.showModal()
    createProductId.value = nextRowId(tableName)
    delayFocus(createProductName)
  })
})

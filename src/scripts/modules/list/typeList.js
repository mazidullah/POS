import { padZero } from "../../utils/utils.js"
import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { updateInto } from "../../utils/database.js"
import { nextRowId } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getTypes(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name")
    stmt = db.prepare(`SELECT * from Types ORDER BY UPPER(name)`)
  else if (sortBy === "name_des")
    stmt = db.prepare(`SELECT * from Types ORDER BY UPPER(name) DESC`)
  else if (sortBy === "id") stmt = db.prepare(`SELECT * from Types ORDER BY id`)
  else if (sortBy === "id_des")
    stmt = db.prepare(`SELECT * from Types ORDER BY id DESC`)

  const types = stmt.all()
  db.close()

  return types
}

function sanitize(searchTerm, types) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  types.forEach(type => {
    if (type.id === Number(searchTerm)) {
      exactMatch.add(type)
      return
    }

    if (type.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(type)
      return
    }

    if (niddle.test(type.name)) {
      possibleNameMatch.add(type)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleNameMatch]
}

export function render() {
  let searchTerm = typeListSearch.value.trim()
  let display_per_page = Number(typeListDisplayPerPage.value)
  let sortBy = typeListSortBy.value

  const allSortedData = sanitize(searchTerm, getTypes(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  typeListPossiblePage.innerHTML = possiblePage
  typeListGotoPage.value > possiblePage
    ? (typeListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(typeListGotoPage.value) || 1
  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""

  toRenderData.forEach(list => {
    htmlString += `
        <tr data-id="${list.id}">
          <td>${padZero(list.id)}</td>
          <td>${list.name}</td>
        </tr>
      `
  })

  typeList.querySelector("tbody").innerHTML = ""
  typeList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([typeListSearch, typeListGotoPage, typeListSearch])

enterToNextInput([editTypeListName, editTypeListSave])

intInput(typeListGotoPage, 1)

document
  .querySelector("nav li[data-navitem='typeList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(typeListSearch)
    render()
  })

typeListSearch.addEventListener("input", () => {
  typeListGotoPage.value = 1
  render()
})

typeListSortBy.addEventListener("input", render)

typeListDisplayPerPage.addEventListener("input", () => {
  typeListGotoPage.value = 1
  render()
})

typeListGotoPage.addEventListener("keyup", render)

typeListGotoPage.addEventListener("blur", () => {
  typeListGotoPage.value > 0 ? "" : (typeListGotoPage.value = 1)
})

typeListCreate.addEventListener("click", () => {
  createType.classList.remove("hidden")
  createTypeId.value = nextRowId("Generics")
  delayFocus(createTypeName)
})

typeListTbody.addEventListener("click", e => {
  let tr = e.target.closest("tr")
  let id = Number(tr.dataset["id"])
  let tdatas = tr.querySelectorAll("td")

  let name = tdatas[1].innerHTML

  editTypeListId.value = id
  editTypeListName.value = name

  editTypeList.classList.remove("hidden")
})

editTypeListClose.addEventListener("click", () => {
  editTypeList.close()
})

editTypeListCancel.addEventListener("click", () => {
  editTypeList.close()
})

editTypeListSave.addEventListener("click", () => {
  updateInto(
    "Types",
    ["name"],
    [editTypeListName.value.trim()],
    `Where id = ${editTypeListId.value.trim()}`
  )

  showMessege(
    "Successfully Updated",
    `Types Id: ${Number(editTypeListId.value)}`
  )

  editTypeList.close()
  render()
})

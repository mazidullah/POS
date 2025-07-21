import { padZero } from "../../utils/utils.js"
import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { updateInto } from "../../utils/database.js"
import { nextRowId } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getGenerics(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name")
    stmt = db.prepare(`SELECT * from Generics ORDER BY UPPER(name)`)
  else if (sortBy === "name_des")
    stmt = db.prepare(`SELECT * from Generics ORDER BY UPPER(name) DESC`)
  else if (sortBy === "id")
    stmt = db.prepare(`SELECT * from Generics ORDER BY id`)
  else if (sortBy === "id_des")
    stmt = db.prepare(`SELECT * from Generics ORDER BY id DESC`)

  const generics = stmt.all()
  db.close()

  return generics
}

function sanitize(searchTerm, generics) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  generics.forEach(generic => {
    if (generic.id === Number(searchTerm)) {
      exactMatch.add(generic)
      return
    }

    if (generic.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(generic)
      return
    }

    if (niddle.test(generic.name)) {
      possibleNameMatch.add(generic)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleNameMatch]
}

export function render() {
  let searchTerm = genericListSearch.value.trim()
  let display_per_page = Number(genericListDisplayPerPage.value)
  let sortBy = genericListSortBy.value

  const allSortedData = sanitize(searchTerm, getGenerics(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  genericListPossiblePage.innerHTML = possiblePage
  genericListGotoPage.value > possiblePage
    ? (genericListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(genericListGotoPage.value) || 1
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

  genericList.querySelector("tbody").innerHTML = ""
  genericList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([genericListSearch, genericListGotoPage, genericListSearch])

enterToNextInput([editGenericListName, editGenericListOk])

intInput(genericListGotoPage, 1)

document
  .querySelector("nav li[data-navitem='genericList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(genericListSearch)
    render()
  })

genericListSearch.addEventListener("input", () => {
  genericListGotoPage.value = 1
  render()
})

genericListSortBy.addEventListener("input", render)

genericListDisplayPerPage.addEventListener("input", () => {
  genericListGotoPage.value = 1
  render()
})

genericListGotoPage.addEventListener("keyup", render)

genericListGotoPage.addEventListener("blur", () => {
  genericListGotoPage.value > 0 ? "" : (genericListGotoPage.value = 1)
})

genericListCreate.addEventListener("click", () => {
  createGeneric.showModal()
  createGenericId.value = nextRowId("Generics")
  delayFocus(createGenericName)
})

genericListTbody.addEventListener("click", e => {
  let tr = e.target.closest("tr")
  let id = Number(tr.dataset["id"])
  let tdatas = tr.querySelectorAll("td")

  let name = tdatas[1].innerHTML

  editGenericListId.value = id
  editGenericListName.value = name

  editGenericList.showModal()
})

editGenericListCancel.addEventListener("click", () => {
  editGenericList.close()
})

editGenericListOk.addEventListener("click", () => {
  try {
    updateInto(
      "Generics",
      ["name"],
      [editGenericListName.value.trim()],
      `Where id = ${editGenericListId.value.trim()}`
    )

    showMessege(
      "Successfully Updated",
      `Generic Id: ${Number(editGenericListId.value)}`
    )

    editGenericList.close()
    render()
  } catch (err) {
    showMessege("Cannot Updated", `One or Multiple value are Invalid`)
  }
})

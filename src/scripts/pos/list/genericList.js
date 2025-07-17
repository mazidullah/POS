import { delayFocus, intInput, enterToNextInput } from "../../utils/utils.js"
import { updateInto } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getGenerics(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name_asc")
    stmt = db.prepare(`SELECT * from Generics ORDER BY UPPER(name)`)
  else if (sortBy === "name_des")
    stmt = db.prepare(`SELECT * from Generics ORDER BY UPPER(name) DESC`)
  else if (sortBy === "id_asc")
    stmt = db.prepare(`SELECT * from Generics ORDER BY id`)
  else if (sortBy === "id_des")
    stmt = db.prepare(`SELECT * from Generics ORDER BY id DESC`)

  const generics = stmt.all()
  db.close()
  return generics
}

function sanitize(searchTerm, generics) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  generics.forEach(generic => {
    if (generic.id == searchTerm) {
      startsWith.add(generic)
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

  const sanitized = [...startsWith, ...possibleNameMatch]

  return sanitized
}

function render() {
  let searchTerm = genericListSearch.value.trim()
  let display_per_page = Number(genericListDisplayPerPage.value) || 100
  let goto_page = Number(genericListGotoPage.value) || 1
  let sortBy = genericListSortBy.value

  const allSortedData = sanitize(searchTerm, getGenerics(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)
  genericListPossiblePage.innerHTML = possiblePage

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
          <td>${list.name}</td>
        </tr>
      `
  })

  genericList.querySelector("tbody").innerHTML = ""
  genericList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([genericListSearch, genericListGotoPage, genericListSearch])
enterToNextInput([editGenericListName, editGenericListOk])

intInput(genericListDisplayPerPage)
intInput(genericListGotoPage)

document
  .querySelector("nav li[data-navitem='genericList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(genericListSearch)
    render()
  })

genericListSearch.addEventListener("input", render)
genericListSortBy.addEventListener("input", render)
genericListDisplayPerPage.addEventListener("keyup", render)
genericListGotoPage.addEventListener("keyup", render)
genericListDisplayPerPage.addEventListener("blur", () => {
  genericListDisplayPerPage.value > 0
    ? ""
    : (genericListDisplayPerPage.value = 100)
})
genericListGotoPage.addEventListener("blur", () => {
  genericListGotoPage.value > 0 ? "" : (genericListGotoPage.value = 1)
})

genericListTbody.addEventListener("click", e => {
  let tdatas = e.target.closest("tr").querySelectorAll("td")
  let id = Number(tdatas[0].innerHTML)
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

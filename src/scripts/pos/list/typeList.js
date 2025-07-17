import { delayFocus, intInput, enterToNextInput } from "../../utils/utils.js"
import { updateInto } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getTypes(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name_asc")
    stmt = db.prepare(`SELECT * from Types ORDER BY UPPER(name)`)
  else if (sortBy === "name_des")
    stmt = db.prepare(`SELECT * from Types ORDER BY UPPER(name) DESC`)
  else if (sortBy === "id_asc")
    stmt = db.prepare(`SELECT * from Types ORDER BY id`)
  else if (sortBy === "id_des")
    stmt = db.prepare(`SELECT * from Types ORDER BY if DESC`)

  const types = stmt.all()
  db.close()
  return types
}

function sanitize(searchTerm, types) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  types.forEach(type => {
    if (type.id == searchTerm) {
      startsWith.add(type)
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

  const sanitized = [...startsWith, ...possibleNameMatch]

  return sanitized
}

function render() {
  let searchTerm = typeListSearch.value.trim()
  let display_per_page = Number(typeListDisplayPerPage.value) || 100
  let goto_page = Number(typeListGotoPage.value) || 1
  let sortBy = typeListSortBy.value

  const allSortedData = sanitize(searchTerm, getTypes(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)
  typeListPossiblePage.innerHTML = possiblePage

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

  typeList.querySelector("tbody").innerHTML = ""
  typeList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([typeListSearch, typeListGotoPage, typeListSearch])
enterToNextInput([editTypeListName, editTypeListOk])

intInput(typeListDisplayPerPage)
intInput(typeListGotoPage)

document
  .querySelector("nav li[data-navitem='typeList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(typeListSearch)
    render()
  })

typeListSearch.addEventListener("input", render)
typeListSortBy.addEventListener("input", render)
typeListDisplayPerPage.addEventListener("keyup", render)
typeListGotoPage.addEventListener("keyup", render)
typeListDisplayPerPage.addEventListener("blur", () => {
  typeListDisplayPerPage.value > 0 ? "" : (typeListDisplayPerPage.value = 100)
})
typeListGotoPage.addEventListener("blur", () => {
  typeListGotoPage.value > 0 ? "" : (typeListGotoPage.value = 1)
})

typeListTbody.addEventListener("click", e => {
  let tdatas = e.target.closest("tr").querySelectorAll("td")
  let id = Number(tdatas[0].innerHTML)
  let name = tdatas[1].innerHTML

  editTypeListId.value = id
  editTypeListName.value = name

  editTypeList.showModal()
})

editTypeListCancel.addEventListener("click", () => {
  editTypeList.close()
})

editTypeListOk.addEventListener("click", () => {
  try {
    updateInto(
      "Types",
      ["name"],
      [editTypeListName.value.trim()],
      `Where id = ${editTypeListId.value.trim()}`
    )

    showMessege(
      "Successfully Updated",
      `Type Id: ${Number(editTypeListId.value)}`
    )

    editTypeList.close()
    render()
  } catch (err) {
    showMessege("Cannot Updated", `One or Multiple value are Invalid`)
  }
})

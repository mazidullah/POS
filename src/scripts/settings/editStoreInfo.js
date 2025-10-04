import { getData, updateInto } from "../utils/database.js"
import { showMessege } from "../utils/messege.js"
import { delayFocus, enterToNextInput, mobileInput } from "../utils/utils.js"

enterToNextInput([
  editStoreInfoName,
  editStoreInfoAddress,
  editStoreInfoMobile,
  editStoreInfoSave,
])
mobileInput(editStoreInfoMobile)

function clearStoreInfo() {
  editStoreInfoName.value = ""
  editStoreInfoAddress.value = ""
  editStoreInfoMobile.value = ""
}

function updateStoreInfo() {
  let store = getData("StoreInfo", "Where id = 1")
  clearStoreInfo()
  editStoreInfoName.value = store.name
  editStoreInfoAddress.value = store.address
  editStoreInfoMobile.value = store.mobile

  let file = new File([store.logo], "logo.png")

  let url = URL.createObjectURL(file)
  editStoreInfoImageViewer.src = url
}

editStoreInfoLogo.addEventListener("input", async e => {
  let file = e.target.files[0]
  let url = URL.createObjectURL(file)
  editStoreInfoImageViewer.src = url
})

openStoreInfo.addEventListener("click", () => {
  editStoreInfo.classList.remove("hidden")
  updateStoreInfo()
  delayFocus(editStoreInfoName)
})

closeStoreInfo.addEventListener("click", () => {
  clearStoreInfo()
  editStoreInfo.classList.add("hidden")
})

editStoreInfoClear.addEventListener("click", () => {
  updateStoreInfo()
  delayFocus(editStoreInfoName)
})

editStoreInfoSave.addEventListener("click", async () => {
  let name = editStoreInfoName.value.trim()
  let address = editStoreInfoAddress.value.trim()
  let mobile = editStoreInfoMobile.value.trim()
  let file = await editStoreInfoLogo.files[0]

  if (name.length === 0) {
    showMessege("Invalid store name", "Name must not empty")
    delayFocus(editStoreInfoName)
    return
  }

  if (address.length === 0) {
    showMessege("Invalid store address", "Address must not empty")
    delayFocus(editStoreInfoAddress)
    return
  }

  if (mobile.length < 12) {
    showMessege("Invalid store mobile", "Mobile is not valid")
    delayFocus(editStoreInfoMobile)
    return
  }

  if (file) {
    let buffer = await file.arrayBuffer()
    let intArray = new Uint8Array(buffer)

    updateInto("StoreInfo", ["logo"], [intArray], "where id = 1")
  }

  updateInto(
    "StoreInfo",
    ["name", "address", "mobile"],
    [name, address, mobile],
    "where id = 1"
  )

  clearStoreInfo()
  editStoreInfo.classList.add("hidden")
})

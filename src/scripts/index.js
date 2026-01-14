import { navigator } from "./utils/navigator.js"
import { getData } from "./utils/database.js"
import { moveable } from "./utils/utils.js"

import "./sell.js"
import "./purchase.js"

import "./create/createCustomer.js"
import "./create/createProduct.js"
import "./create/createType.js"
import "./create/createGeneric.js"
import "./create/createCompany.js"

import "./list/customerList.js"
import "./list/productList.js"
import "./list/companyList.js"
import "./list/genericList.js"
import "./list/typeList.js"
import "./list/purchaseList.js"
import "./list/customerReturnList.js"
import "./list/companyReturnList.js"
import "./list/stockList.js"
import "./list/expenseList.js"

import "./settings/investCash.js"
import "./settings/withdrawCash.js"
import "./settings/editStoreInfo.js"
import "./settings/editAdminInfo.js"

navigator(document.querySelector("nav"), document.querySelector("main"))

document.querySelectorAll("nav li div").forEach(div => {
  div.addEventListener("click", e => {
    if (e.target.closest("li").classList.contains("expended"))
      e.target.closest("li").classList.remove("expended")
    else e.target.closest("li").classList.add("expended")
  })
})

document.querySelectorAll("input").forEach(element => {
  element.addEventListener("focus", () => {
    let type = element.type

    if ("date" === type) element.focus()
    else if ("file" === type) element.focus()
    else if ("checkbox" === type) element.focus()
    else if ("radio" === type) element.focus()
    else {
      element.selectionStart = 0
      element.selectionEnd = element.value.length
      element.focus()
    }
  })
})

document.querySelectorAll(".opener").forEach(opener => {
  opener.addEventListener("click", () => {
    let id = opener.dataset["id"]
    let win = document.querySelector(`#${id}`)
    let wrapper = document.querySelector(`#${id} > .wrapper`)

    win.classList.remove("hidden")
    let boundedRect = wrapper.getBoundingClientRect()

    if (boundedRect.height <= window.innerHeight * 0.5) {
      wrapper.style.top = `${window.innerHeight * 0.3}px`
    } else
      wrapper.style.top = `${(window.innerHeight - boundedRect.height) / 2}px`

    wrapper.style.left = `${(window.innerWidth - boundedRect.width) / 2}px`
  })
})

document.querySelectorAll(".closer").forEach(closer => {
  closer.addEventListener("click", () => {
    let id = closer.dataset["id"]
    let win = document.querySelector(`#${id}`)

    win.classList.add("hidden")
  })
})

document.querySelectorAll(".dialog").forEach(dia => {
  moveable(
    dia.querySelector(".wrapper  header  span:nth-child(1)"),
    dia.querySelector(".wrapper")
  )
})

let storeInfo = getData("StoreInfo", "where id = 1")
displayCash.innerHTML = `Cash: ${storeInfo.cash}`

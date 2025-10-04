import { navigator } from "./utils/navigator.js"
import { getData } from "./utils/database.js"

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
import "./settings/editStoreInfo.js"
import "./settings/editAdminInfo.js"
;(() => {
  let { ipcRenderer } = require("electron")

  ipcRenderer.on("user:id", (ev, id) => {
    window.__pos__ = {}
    window.__pos__.userId = id

    let userInfo = getData("Users", `where id = ${id}`)
    let name = userInfo.name
    let accessModule = userInfo.access_modules
    let isAdmin = userInfo.role === "admin"

    document.title = `Awesome PoS [${name} as ${isAdmin ? "admin" : "user"}]`
  })
})()

document.querySelectorAll("nav li div").forEach(div => {
  div.addEventListener("click", e => {
    if (e.target.closest("li").classList.contains("expended"))
      e.target.closest("li").classList.remove("expended")
    else e.target.closest("li").classList.add("expended")
  })
})

navigator(document.querySelector("nav"), document.querySelector("main"))

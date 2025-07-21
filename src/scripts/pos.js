import { navigator } from "./utils/navigator.js"

import "./pos/purchase.js"

import "./pos/create/createCustomer.js"
import "./pos/create/createProduct.js"
import "./pos/create/createType.js"
import "./pos/create/createGeneric.js"
import "./pos/create/createCompany.js"

import "./pos/list/customerList.js"
import "./pos/list/productList.js"
import "./pos/list/companyList.js"
import "./pos/list/genericList.js"
import "./pos/list/typeList.js"
import "./pos/list/purchaseList.js"
import "./pos/list/customerReturnList.js"
import "./pos/list/companyReturnList.js"
import "./pos/list/stockList.js"
import "./pos/list/expenseList.js"

document.querySelectorAll("nav li div").forEach(div => {
  div.addEventListener("click", e => {
    if (e.target.closest("li").classList.contains("expended"))
      e.target.closest("li").classList.remove("expended")
    else e.target.closest("li").classList.add("expended")
  })
})

navigator(document.querySelector("nav"), document.querySelector("main"))

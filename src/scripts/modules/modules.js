import { navigator } from "../utils/navigator.js"

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

document.querySelectorAll("nav li div").forEach(div => {
  div.addEventListener("click", e => {
    if (e.target.closest("li").classList.contains("expended"))
      e.target.closest("li").classList.remove("expended")
    else e.target.closest("li").classList.add("expended")
  })
})

navigator(document.querySelector("nav"), document.querySelector("main"))

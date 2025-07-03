import { navigator } from "./utils/navigator.js"

import "./pos/createCustomer.js"
import "./pos/createProduct.js"
import "./pos/createType.js"
import "./pos/createGeneric.js"
import "./pos/createCompany.js"

document.querySelectorAll("nav li div").forEach(div => {
  div.addEventListener("click", e => {
    if (e.target.closest("li").classList.contains("expended"))
      e.target.closest("li").classList.remove("expended")
    else e.target.closest("li").classList.add("expended")
  })
})

navigator(document.querySelector("nav"), document.querySelector("main"))

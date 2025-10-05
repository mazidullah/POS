import { delayFocus, enterToNextInput, intInput } from "../utils/utils.js"
import { getDateTime, setDate, getSetableDate } from "../utils/dateTime.js"
import {
  getData,
  getAllData,
  insertInto,
  updateInto,
} from "../utils/database.js"

import { showMessege } from "../utils/messege.js"

let startDate = ""
let endDate = ""
let totalInvest = 0

intInput(investCashAmount, 1)
enterToNextInput([investCashAmount, investCashSave])

function clearInvestCash(sd = new Date(), ed = new Date()) {
  totalInvest = 0

  startDate = getSetableDate(sd)
  endDate = getSetableDate(ed)

  investCashAmount.value = ""
  investCashTbody.innerHTML = ""
  setDate(investCashStartDate, sd)
  setDate(investCashEndDate, ed)
  investCashTotal.value = totalInvest
}

function renderInvestCashTbody() {
  let sd, ed
  totalInvest = 0

  if (new Date(startDate) <= new Date(endDate)) {
    sd = new Date(startDate).getTime()
    ed = new Date(endDate).getTime()
  } else {
    sd = new Date(endDate).getTime()
    ed = new Date(startDate).getTime()
  }

  ed += 3600000 * 24

  let invests = getAllData(
    "Invests",
    `where date >= ${sd} and date <= ${ed} order by date desc`
  )

  let htmlText = ""
  invests.forEach((invest, i) => {
    totalInvest += invest.amount

    htmlText += `
      <tr>
        <td>${i + 1}</td>
        <td>${getDateTime(new Date(invest.date))}</td>
        <td>${invest.amount}</td>
      </tr>
    `
  })

  investCashTbody.innerHTML = htmlText
  investCashTotal.value = totalInvest
}

openInvestCash.addEventListener("click", () => {
  let date = new Date()
  clearInvestCash(date, date)
  renderInvestCashTbody()

  investCash.classList.remove("hidden")
  delayFocus(investCashAmount)
})

closeInvestCash.addEventListener("click", () => {
  clearInvestCash()
  investCash.classList.add("hidden")
})

investCashClear.addEventListener("click", () => {
  clearInvestCash()
  renderInvestCashTbody()
  delayFocus(investCashAmount)
})

investCashStartDate.addEventListener("input", () => {
  startDate = getSetableDate(new Date(investCashStartDate.value))
  renderInvestCashTbody()
})
investCashEndDate.addEventListener("input", () => {
  endDate = getSetableDate(new Date(investCashEndDate.value))
  renderInvestCashTbody()
})

investCashSave.addEventListener("click", e => {
  let amount = Number(investCashAmount.value.trim())

  if (amount > 0) {
    insertInto("Invests", ["date", "amount"], [new Date().getTime(), amount])
    updateInto(
      "StoreInfo",
      ["cash"],
      [getData("StoreInfo", "Where id = 1").cash + amount],
      "where id = 1"
    )

    clearInvestCash()
    renderInvestCashTbody()
  } else showMessege("Invalid amount", "Enter some valid amount!")

  delayFocus(investCashAmount)
})

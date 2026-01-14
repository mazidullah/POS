import { delayFocus, enterToNextInput, intInput } from "../utils/utils.js"
import { getDateTime, setDate } from "../utils/dateTime.js"
import {
  getData,
  getAllData,
  insertInto,
  getCash,
  updateCash,
} from "../utils/database.js"
import { showMessege } from "../utils/messege.js"

intInput(investCashAmount, 0)
intInput(investCashGotoPage, 1)
enterToNextInput([investCashAmount, investCashRemark, investCashSave])

function clearInvestCash() {
  let storeInfo = getData("StoreInfo", "WHERE id = 1")
  let startDate = new Date(storeInfo.create_date)
  let endDate = new Date()

  investCashAmount.value = ""
  investCashRemark.value = ""
  investCashTbody.innerHTML = ""

  setDate(investCashStartDate, startDate)
  setDate(investCashEndDate, endDate)
}

function renderInvestCashTbody() {
  let totalCash = 0

  let startDate = new Date(investCashStartDate.value)
  let endDate = new Date(investCashEndDate.value)
  let displayPerPage = Number(investCashDisplayPerPage.value.trim())
  let possiblePage = 1
  let gotoPage = Number(investCashGotoPage.value.trim())

  if (startDate > endDate) {
    let temp = startDate
    startDate = endDate
    endDate = temp
  }

  let startDateYear = startDate.getFullYear()
  let startDateMonth = startDate.getMonth()
  let startDateDate = startDate.getDate()

  let endDateYear = endDate.getFullYear()
  let endDateMonth = endDate.getMonth()
  let endDateDate = endDate.getDate()

  startDate = new Date(startDateYear, startDateMonth, startDateDate).getTime()
  endDate = new Date(endDateYear, endDateMonth, endDateDate + 1).getTime() - 1

  let allData = getAllData(
    "Invests",
    `WHERE date >= ${startDate} and date <= ${endDate}`
  )

  possiblePage = Math.floor(allData.length / displayPerPage) + 1
  investCashPossiblePage.innerHTML = possiblePage

  if (gotoPage > possiblePage) {
    gotoPage = possiblePage
    investCashGotoPage.value = gotoPage
  }

  let renderData = allData.slice(
    (gotoPage - 1) * displayPerPage,
    gotoPage * displayPerPage
  )

  let html = ""
  let thisPageTotal = 0

  renderData.forEach(invest => {
    let dateTime = getDateTime(new Date(invest.date))
    thisPageTotal += invest.amount
    html += `
      <tr data-id=${invest.id}>
        <td>${invest.id}</td>
        <td>${invest.remark}</td>
        <td>${dateTime}</td>
        <td>${invest.amount}</td>
      </tr>
    `
  })

  html += `
    <tr class="summary">
      <td colspan="3">Total</td>
      <td>${thisPageTotal}</td>
    </tr>
  `

  investCashTbody.innerHTML = html

  allData.forEach(invest => {
    totalCash += invest.amount
  })

  investCashTotal.value = totalCash
}

openInvestCash.addEventListener("click", () => {
  clearInvestCash()
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
  setDate(new Date(investCashStartDate.value))
  renderInvestCashTbody()
})

investCashEndDate.addEventListener("input", () => {
  setDate(new Date(investCashEndDate.value))
  renderInvestCashTbody()
})

investCashDisplayPerPage.addEventListener("input", () => {
  renderInvestCashTbody()
})

investCashGotoPage.addEventListener("input", () => {
  renderInvestCashTbody()
})

investCashSave.addEventListener("click", e => {
  let date = Date.now()
  let amount = Number(investCashAmount.value.trim())
  let remark = investCashRemark.value.trim()

  if (amount > 0) {
    insertInto("Invests", ["date", "amount", "remark"], [date, amount, remark])
    updateCash(amount)
    clearInvestCash()
    renderInvestCashTbody()

    displayCash.innerHTML = `Cash: ${getCash()}`
    showMessege("Successfully invested", `Amount: ${amount}`)
  } else showMessege("Invalid amount", "Enter some valid amount!")

  delayFocus(investCashAmount)
})

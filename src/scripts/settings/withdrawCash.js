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

intInput(withdrawCashAmount, 0)
intInput(withdrawCashGotoPage, 1)
enterToNextInput([withdrawCashAmount, withdrawCashRemark, withdrawCashSave])

function clearWithdrawCash() {
  let storeInfo = getData("StoreInfo", "WHERE id = 1")
  let startDate = new Date(storeInfo.create_date)
  let endDate = new Date()

  withdrawCashAmount.value = ""
  withdrawCashRemark.value = ""
  withdrawCashTbody.innerHTML = ""

  setDate(withdrawCashStartDate, startDate)
  setDate(withdrawCashEndDate, endDate)
}

function renderWithdrawCashTbody() {
  let totalCash = 0

  let startDate = new Date(withdrawCashStartDate.value)
  let endDate = new Date(withdrawCashEndDate.value)
  let displayPerPage = Number(withdrawCashDisplayPerPage.value.trim())
  let possiblePage = 1
  let gotoPage = Number(withdrawCashGotoPage.value.trim())

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
    "Withdraws",
    `WHERE date >= ${startDate} and date <= ${endDate}`
  )

  possiblePage = Math.floor(allData.length / displayPerPage) + 1
  withdrawCashPossiblePage.innerHTML = possiblePage

  if (gotoPage > possiblePage) {
    gotoPage = possiblePage
    withdrawCashGotoPage.value = gotoPage
  }

  let renderData = allData.slice(
    (gotoPage - 1) * displayPerPage,
    gotoPage * displayPerPage
  )

  let html = ""
  let thisPageTotal = 0

  renderData.forEach(withdraw => {
    let dateTime = getDateTime(new Date(withdraw.date))
    thisPageTotal += withdraw.amount
    html += `
      <tr data-id=${withdraw.id}>
        <td>${withdraw.id}</td>
        <td>${withdraw.remark}</td>
        <td>${dateTime}</td>
        <td>${withdraw.amount}</td>
      </tr>
    `
  })

  html += `
    <tr class="summary">
      <td colspan="3">Total</td>
      <td>${thisPageTotal}</td>
    </tr>
  `

  withdrawCashTbody.innerHTML = html

  allData.forEach(withdraw => {
    totalCash += withdraw.amount
  })

  withdrawCashTotal.value = totalCash
}

openWithdrawCash.addEventListener("click", () => {
  clearWithdrawCash()
  renderWithdrawCashTbody()
  withdrawCash.classList.remove("hidden")
  delayFocus(withdrawCashAmount)
})

closeWithdrawCash.addEventListener("click", () => {
  clearWithdrawCash()
  withdrawCash.classList.add("hidden")
})

withdrawCashClear.addEventListener("click", () => {
  clearWithdrawCash()
  renderWithdrawCashTbody()
  delayFocus(withdrawCashAmount)
})

withdrawCashStartDate.addEventListener("input", () => {
  setDate(new Date(withdrawCashStartDate.value))
  renderWithdrawCashTbody()
})

withdrawCashEndDate.addEventListener("input", () => {
  setDate(new Date(withdrawCashEndDate.value))
  renderWithdrawCashTbody()
})

withdrawCashDisplayPerPage.addEventListener("input", () => {
  renderWithdrawCashTbody()
})

withdrawCashGotoPage.addEventListener("input", () => {
  renderWithdrawCashTbody()
})

withdrawCashSave.addEventListener("click", e => {
  let date = Date.now()
  let amount = Number(withdrawCashAmount.value.trim())
  let remark = withdrawCashRemark.value.trim()

  if (amount > 0) {
    if (amount > getCash()) {
      showMessege("Invalid amount", "Have not sufficcient amount!")
      delayFocus(withdrawCashAmount)
      return
    }

    insertInto(
      "Withdraws",
      ["date", "amount", "remark"],
      [date, amount, remark]
    )
    updateCash(-amount)
    clearWithdrawCash()
    renderWithdrawCashTbody()

    displayCash.innerHTML = `Cash: ${getCash()}`
    showMessege("Successfully withdrawed", `Amount: ${amount}`)
  } else showMessege("Invalid amount", "Enter some valid amount!")

  delayFocus(withdrawCashAmount)
})

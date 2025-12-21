import { delayFocus, enterToNextInput, intInput } from "../utils/utils.js"
import { getDateTime, setDate, getSetableDate } from "../utils/dateTime.js"
import {
  getAllData,
  insertInto,
  updateCash,
  getCash,
} from "../utils/database.js"

import { showMessege } from "../utils/messege.js"

let startDate = ""
let endDate = ""
let totalWithdraw = 0

intInput(withdrawCashAmount, 1)
enterToNextInput([withdrawCashAmount, withdrawCashSave])

function clearWithdrawCash(sd = new Date(), ed = new Date()) {
  totalWithdraw = 0

  startDate = getSetableDate(sd)
  endDate = getSetableDate(ed)

  withdrawCashAmount.value = ""
  withdrawCashTbody.innerHTML = ""
  setDate(withdrawCashStartDate, sd)
  setDate(withdrawCashEndDate, ed)
  withdrawCashTotal.value = totalWithdraw
}

function renderWithdrawCashTbody() {
  let sd, ed
  totalWithdraw = 0

  if (new Date(startDate) <= new Date(endDate)) {
    sd = new Date(startDate).getTime()
    ed = new Date(endDate).getTime()
  } else {
    sd = new Date(endDate).getTime()
    ed = new Date(startDate).getTime()
  }

  ed += 3600000 * 24

  let withdraws = getAllData(
    "Withdraws",
    `where date >= ${sd} and date <= ${ed} order by date desc`
  )

  let htmlText = ""
  withdraws.forEach((withdraw, i) => {
    totalWithdraw += withdraw.amount

    htmlText += `
      <tr>
        <td>${i + 1}</td>
        <td>${getDateTime(new Date(withdraw.date))}</td>
        <td>${withdraw.amount}</td>
      </tr>
    `
  })

  withdrawCashTbody.innerHTML = htmlText
  withdrawCashTotal.value = totalWithdraw
}

openWithdrawCash.addEventListener("click", () => {
  let date = new Date()
  clearWithdrawCash(date, date)
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
  startDate = getSetableDate(new Date(withdrawCashStartDate.value))
  renderWithdrawCashTbody()
})

withdrawCashEndDate.addEventListener("input", () => {
  endDate = getSetableDate(new Date(withdrawCashEndDate.value))
  renderWithdrawCashTbody()
})

withdrawCashSave.addEventListener("click", e => {
  let amount = Number(withdrawCashAmount.value.trim())
  let cash = getCash()

  if (amount > 0 && amount <= cash) {
    insertInto("Withdraws", ["date", "amount"], [new Date().getTime(), amount])
    updateCash(-amount)
    clearWithdrawCash()
    renderWithdrawCashTbody()

    displayCash.innerHTML = `Cash: ${getCash()}`
    showMessege("Successfully withdrawed", `Amount: ${amount}`)
  } else showMessege("Invalid amount", "Have not sufficent balance!")

  delayFocus(withdrawCashAmount)
})

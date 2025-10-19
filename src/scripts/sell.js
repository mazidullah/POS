import { getDate } from "./utils/dateTime.js"
import { enterToNextInput, intInput, floatInput } from "./utils/utils.js"

enterToNextInput([sellName, sellSearch])
enterToNextInput([sellSearch, sellQnt, sellSearch])
enterToNextInput([sellDiscountAmount, sellPaid, sellSave])
enterToNextInput([sellDiscountPercentage, sellPaid, sellSave])

intInput(sellQnt, 1)
intInput(sellDue)
intInput(sellPaid)
floatInput(sellDiscountAmount)
floatInput(sellDiscountPercentage, 0, 100)

function clear() {
  sellId.value = 0
  sellPrevDue.value = 0
  sellTotalCost.value = 0
  sellDate.value = getDate(new Date())
  sellName.value = ""
  sellAddress.value = ""
  sellMobile.value = ""
  sellSearch.value = ""
  sellQnt.value = 0

  sellTbody.innerHTML = ""

  sellTotalBill.value = 0
  sellDiscountAmount.value = 0
  sellDiscountPercentage.value = 0
  sellPayable.value = 0
  sellDue.value = 0
  sellPaid.value = 0
}

sellDate.value = getDate(new Date())
sellClear.addEventListener("click", clear)

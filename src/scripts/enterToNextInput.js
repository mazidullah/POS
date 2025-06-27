export default function enterToNextInput(inputList) {
  for(let i = 0; i < inputList.length - 1; i++) {
    inputList[i].addEventListener("keyup", e => {
      if(e.target.value.length > 0 && e.key === "Enter") inputList[i + 1].focus() 
    })
  } 
}
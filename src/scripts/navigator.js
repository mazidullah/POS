export default function navigator(navHolder, windowHolder, datasetName, activeName) {
  const navItems = navHolder.querySelectorAll(`[data-${datasetName}]`)
  const windowItems = windowHolder.querySelectorAll(`[data-${datasetName}]`)

  navItems.forEach(navItem => {
    navItem.addEventListener("click", (e) => {
      let activeNav = navHolder.querySelector(`.${activeName}`)
      let activeWindow = windowHolder.querySelector(`.${activeName}`)

      if(e.target === activeNav) return

      let nextActiveName = e.target.closest(`[data-${datasetName}]`).dataset[datasetName]

      activeNav.classList.remove(activeName)
      activeWindow.classList.remove(activeName)

      navHolder.querySelector(`[data-${datasetName}="${nextActiveName}"]`).classList.add(activeName)

      windowHolder.querySelector(`[data-${datasetName}="${nextActiveName}"]`).classList.add(activeName)
    })
  })
}
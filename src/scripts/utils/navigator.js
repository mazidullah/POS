export function navigator(navbar, main) {
  const navItems = navbar.querySelectorAll(`[data-navitem]`)

  navItems.forEach(navItem => {
    navItem.addEventListener("click", e => {
      let activeNav = navbar.querySelector(".active")
      let activeWindow = main.querySelector(".active")

      if (e.target === activeNav) return

      let nextActiveWindowId =
        e.target.closest(`[data-navitem]`).dataset["navitem"]

      activeNav.classList.remove("active")
      activeWindow.classList.remove("active")

      navbar
        .querySelector(`[data-navitem="${nextActiveWindowId}"]`)
        .classList.add("active")
      main.querySelector(`#${nextActiveWindowId}`).classList.add("active")

      document
        .querySelector(`#${nextActiveWindowId}`)
        .querySelector("[data-default-focus]")
        ?.focus()
    })
  })
}

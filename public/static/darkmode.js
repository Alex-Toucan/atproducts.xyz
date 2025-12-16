(() => {
  'use strict'

  const storedTheme = localStorage.getItem('theme')

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = (theme) => {
    if (theme === 'auto') {
      document.documentElement.setAttribute(
        'data-bs-theme',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')
    if (!themeSwitcher) return

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active i')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)

    if (!btnToActive) return // prevent null errors

    const svgOfActiveBtn = btnToActive.querySelector('i').getAttribute('class')

    for (const element of document.querySelectorAll('[data-bs-theme-value]')) {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    }

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('class', svgOfActiveBtn)

    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) themeSwitcher.focus()
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
      showActiveTheme(getPreferredTheme())
    }
  })

  window.addEventListener('load', () => {
    showActiveTheme(getPreferredTheme())

    for (const toggle of document.querySelectorAll('[data-bs-theme-value]')) {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value')
        localStorage.setItem('theme', theme)
        setTheme(theme)
        showActiveTheme(theme, true)
      })
    }
  })
})()

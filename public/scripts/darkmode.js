(() => {
  'use strict'

  const storedTheme = localStorage.getItem('theme')

  const getPreferredTheme = () => {
    if (storedTheme) return storedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    if (theme === 'auto') {
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-bs-theme', system)
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const swapIcon = (activeIcon, sourceIcon) => {
    const newIconClass = [...sourceIcon.classList].find(cls => cls.startsWith('bi-'))
    if (!newIconClass) return

    activeIcon.classList.forEach(cls => {
      if (cls.startsWith('bi-')) activeIcon.classList.remove(cls)
    })

    activeIcon.classList.add(newIconClass)
  }

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')
    if (!themeSwitcher) return

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active i')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const btnIcon = btnToActive.querySelector('i')

    swapIcon(activeThemeIcon, btnIcon)

    for (const el of document.querySelectorAll('[data-bs-theme-value]')) {
      el.classList.remove('active')
      el.setAttribute('aria-pressed', 'false')
    }

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')

    const label = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', label)

    if (focus) themeSwitcher.focus()
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
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

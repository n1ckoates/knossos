export const useTheme = () =>
  useState('theme', () => {
    const colorMode = useCookie('color-mode', {
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: 'lax',
      secure: true,
      httpOnly: false,
      path: '/',
    })

    if (!colorMode.value) {
      colorMode.value = {
        value: 'dark',
        preference: 'system',
      }
    }

    if (colorMode.value.preference !== 'system') {
      colorMode.value.value = colorMode.value.preference
    }

    return colorMode.value
  })

export const updateTheme = (value, updatePreference = false) => {
  const theme = useTheme()

  const themeCookie = useCookie('color-mode', {
    maxAge: 60 * 60 * 24 * 365 * 10,
    sameSite: 'lax',
    secure: true,
    httpOnly: false,
    path: '/',
  })

  if (value === 'system') {
    theme.value.preference = 'system'

    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: light)')
    if (colorSchemeQueryList.matches) {
      theme.value.value = 'light'
    } else {
      theme.value.value = 'dark'
    }
  } else {
    theme.value.value = value
    if (updatePreference) theme.value.preference = value
  }

  if (process.client) {
    const css = document.createElement('style')
    css.appendChild(document.createTextNode('*,*::after,*::before{transition:none!important}'))
    document.head.appendChild(css)

    document.documentElement.className = `${theme.value.value}-mode`

    setTimeout(() => document.head.removeChild(css), 1)
  }

  themeCookie.value = theme.value
}

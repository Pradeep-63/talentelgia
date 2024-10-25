import config from "../config/config"
import { theme } from "../helpers/common.enums"
import { getLocalStorageData, setLocalStorageData } from "../utils/localStorage"

class ThemeService {
  getCurrentTheme (): theme {
    const currentTheme = getLocalStorageData(config.theme_key as string) ?? 'light'
    return currentTheme
  }

  setCurrentTheme (theme: theme) {
    setLocalStorageData(config.theme_key as string, theme)
    return
  }
}

export const themeService = new ThemeService()
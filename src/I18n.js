import I18n from "i18n-js";
import vi from '~/src/locales/vi'
import en from '~/src/locales/en'
const lang = 'vi'
I18n.fallbacks = true
I18n.defaultLocale = lang
I18n.locale = lang
I18n.translations = {
    'vi': vi,
    'vi-VN': vi,
    'en-GB': en,
    'en': en
}

export default I18n
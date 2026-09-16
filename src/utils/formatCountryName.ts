import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en);

export const formatCountryName = (code?: string): string => {
    if(!code) return '';
  return countries.getName(code.toUpperCase(), 'en') || code;
};
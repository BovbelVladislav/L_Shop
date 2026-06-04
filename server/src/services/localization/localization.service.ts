import fs from "fs";
import path from "path";
import type { SupportedLanguage, LocaleFile } from "../../types/localization";

const localesDir = path.join(process.cwd(), "server", "src", "locales");

export class LocalizationService {
  static getAvailableLanguages(): SupportedLanguage[] {
    return ['ru', 'en', 'es'];
  }

  static getLocaleFile(language: SupportedLanguage): LocaleFile {
    const filePath = path.join(localesDir, `${language}.json`);

    if (!fs.existsSync(filePath)) {
      return this.getDefaultLocale();
    }

    const data = fs.readFileSync(filePath, "utf-8");
    try {
      return JSON.parse(data) as LocaleFile;
    } catch {
      return this.getDefaultLocale();
    }
  }

  private static getDefaultLocale(): LocaleFile {
    return {
      'common.title': 'Shop',
      'common.search': 'Search...',
      'common.add': 'Add',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.save': 'Save',
      'common.cancel': 'Cancel'
    };
  }

  static detectLanguageFromGeo(countryCode?: string): SupportedLanguage {
    if (!countryCode) return 'en';
    
    const countryToLang: Record<string, SupportedLanguage> = {
      'RU': 'ru',
      'BY': 'ru',
      'KZ': 'ru',
      'ES': 'es',
      'MX': 'es',
      'AR': 'es'
    };

    return countryToLang[countryCode.toUpperCase()] || 'en';
  }
}

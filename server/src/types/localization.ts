export type SupportedLanguage = 'ru' | 'en' | 'es';

export interface LocaleFile {
  [key: string]: string;
}

export interface UserLocale {
  userId: number;
  language: SupportedLanguage;
  timestamp: number;
}

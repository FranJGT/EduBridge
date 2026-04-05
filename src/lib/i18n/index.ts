import en from "./locales/en.json";
import es from "./locales/es.json";
import hi from "./locales/hi.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import sw from "./locales/sw.json";

const locales: Record<string, Record<string, string>> = { en, es, hi, fr, ar, sw };

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "es", name: "Espanol", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "hi", name: "\u0939\u093F\u0928\u094D\u0926\u0940", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "fr", name: "Francais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "sw", name: "Kiswahili", flag: "\u{1F1F0}\u{1F1EA}" },
] as const;

export function t(key: string, lang: string = "en"): string {
  const strings = locales[lang] ?? locales["en"];
  return strings[key] ?? locales["en"][key] ?? key;
}

export function getLanguageName(code: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

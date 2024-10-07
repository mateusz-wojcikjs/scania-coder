import pl from "./locales/pl/translation.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        translation: pl,
      },
    },
    lng: "pl",
    debug: true,
    returnNull: false,
  });

export default i18next;

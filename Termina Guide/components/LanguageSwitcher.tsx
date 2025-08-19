import React from "react";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { useLanguage, useTranslation } from "../helpers/useTranslation";
import styles from "./LanguageSwitcher.module.css";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (value: string) => {
    if (value === "en" || value === "fr") {
      changeLanguage(value);
    }
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <Select onValueChange={handleLanguageChange} value={language}>
        <SelectTrigger className={styles.trigger}>
          <Globe className={styles.icon} />
          <SelectValue placeholder={t("language")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("english")}</SelectItem>
          <SelectItem value="fr">{t("french")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
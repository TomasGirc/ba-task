"use client";
import { useLanguage } from "@/providers/languageProviders";
import styles from "../styling/languageToggle.module.css";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const isEn = language === "en";

  const handleToggle = () => {
    setLanguage(isEn ? "lt" : "en");
  };

  return (
    <div className={styles.languageSwitch}>
      <div onClick={handleToggle} className={styles.toggleWrapper}>
        <div className={`${styles.toggle} ${isEn ? "" : styles.toggleOn}`}>
          <div
            className={`${styles.toggleKnob} ${
              isEn ? "" : styles.toggleKnobOn
            }`}
          >
            {isEn ? "EN" : "LT"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;

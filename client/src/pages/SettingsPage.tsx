import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ReactComponent as ChevronSVG } from "../assets/chevron.svg";
import styled, { color } from "../config/styles";
import { AppHeader, AppContainer, SROnly } from "../components/common";
import ThemePicker from "../components/settings/ThemePicker";
import LanguagePicker from "../components/settings/LanguagePicker";
import DeleteAccountButton from "../components/settings/DeleteAccountButton";

const SettingsRoute: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <AppHeader>
        <Link to="/">
          <BackIcon />
          <SROnly>{t("common.back")}</SROnly>
        </Link>
      </AppHeader>
      <AppContainer>
        <h1>{t("settings.title")}</h1>
        <h2>{t("settings.theme")}</h2>
        <ThemePicker />

        <hr />
        <h2>{t("settings.language")}</h2>
        <LanguagePicker />

        <hr />
        <h2>{t("account.delete.title")}</h2>
        <p>{t("account.delete.disclaimer")}</p>
        <DeleteAccountButton />
      </AppContainer>
    </>
  );
};

const BackIcon = styled(ChevronSVG)`
  fill: ${color("text")};
  height: 1rem;
  transform: translateY(3px);
`;

export default SettingsRoute;

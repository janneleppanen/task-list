import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { AuthContext } from "../components/login";

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext);
  let to = "login";

  if (user) {
    const firstProject =
      user.projects.length > 0 ? user.projects[0].id : "no-projects";
    to = `project/${firstProject}`;
  }

  return <Redirect to={to} />;
};

export default HomePage;

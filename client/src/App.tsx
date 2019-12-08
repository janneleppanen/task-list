import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import Routes from "./config/routes";
import ThemeProvider from "./utils/ThemeProvider";
import { AuthContext } from "./components/login";
import { useMeQuery } from "./components/login/login.requests";
import { client } from "./config/apollo";
import { SideMenuProvider } from "./utils/SideMenuProvider";
import "./config/i18n";
import ErrorBoundary from "./utils/ErrorBoundary";

const App: React.FC = () => {
  const { data, refetch, loading } = useMeQuery(client);
  const user = data ? data.me : null;

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthContext.Provider value={{ user, loading, refetchUser: refetch }}>
          <ThemeProvider>
            <SideMenuProvider>
              <Routes />
            </SideMenuProvider>
          </ThemeProvider>
        </AuthContext.Provider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;

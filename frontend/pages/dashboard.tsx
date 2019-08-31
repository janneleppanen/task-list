import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import RedirectAfterUnauth from "../components/login/RedirectAfterUnauth";
import Logout from "../components/login/Logout";
import Me, { IMeQueryResult } from "../components/login/Me";
import { ME_QUERY } from "../components/login/Me";
import { MainContainer, Sidebar, Main } from "../components/common";
import { ProjectList, ProjectListItem } from "../components/project";
import { TopPanel } from "../components/menu";
import { ADD_PROJECT_MUTATION } from "../components/project/AddProject";
import { DELETE_PROJECT_MUTATION } from "../components/project/DeleteProject";

function App() {
  const [addProject] = useMutation(ADD_PROJECT_MUTATION);
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION);
  const [projectName, setProjectName] = useState("");

  return (
    <RedirectAfterUnauth to="/login">
      <Me>
        {({ data, loading, error }: IMeQueryResult) => {
          if (loading) return "...";
          if (!data || !data.me) return "...";
          if (error) return "Error";
          return (
            <>
              <TopPanel align="right">
                <Logout refetchQueries={[{ query: ME_QUERY }]}>
                  {(logout: Function) => (
                    <a onClick={() => logout()}>Kirjaudu ulos</a>
                  )}
                </Logout>
              </TopPanel>
              <MainContainer flex>
                <Sidebar>
                  <div>
                    <ProjectList>
                      {data.me.projects.map(
                        p =>
                          p.tasks && (
                            <ProjectListItem key={p.id}>
                              {p.name}{" "}
                              <span className="text-small text-light">
                                {p.tasks.length}
                              </span>
                              <button
                                onClick={() => {
                                  deleteProject({
                                    variables: { id: p.id },
                                    refetchQueries: [{ query: ME_QUERY }]
                                  });
                                }}
                              >
                                &times;
                              </button>
                            </ProjectListItem>
                          )
                      )}
                    </ProjectList>
                    <hr />
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        addProject({
                          variables: { name: projectName },
                          refetchQueries: [{ query: ME_QUERY }]
                        });
                        setProjectName("");
                      }}
                    >
                      <h3>Create a project</h3>
                      <input
                        type="text"
                        placeholder="Buy a car"
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                      />
                      <button>Create</button>
                    </form>
                  </div>
                </Sidebar>
                <Main>
                  <p>Heya, {data.me.name}!</p>
                </Main>
              </MainContainer>
            </>
          );
        }}
      </Me>
    </RedirectAfterUnauth>
  );
}

export default App;

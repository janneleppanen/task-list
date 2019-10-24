import React, { useState } from "react";
import { Link } from "react-router-dom";

import styled, { mq } from "../../config/styles";
import { Button, Modal } from "../common";
import { Project } from "./project.model";
import CreateProjectForm from "./CreateProjectForm";
import DeleteProjectButton from "./DeleteProjectButton";
import { useProjectsQuery } from "./project.requests";
import { useSideMenu } from "./SideMenuProvider";

const ProjectList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ProjectNumber = styled.small`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.6;
`;

const ProjectListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  a {
    text-decoration: none;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0.5rem;
  border: none;
  font-size: 2rem;
  padding: 0.2rem;
  line-height: 1;
  color: ${props => props.theme.colors.text};
  &:hover {
    background: transparent;
    color: ${props => props.theme.colors.primary};
  }
  ${mq("medium")} {
    display: none;
  }
`;

const Overlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9;
  display: ${props => (props.visible ? "block" : "none")};
`;

interface WrapperProps {
  open: boolean;
  menuTranslateX: number;
  isTouching: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  transition: all ${props => (props.isTouching ? `0s` : `0.4s`)};
  padding: 4rem 1rem 1rem 1rem;
  background: ${props => props.theme.colors.background};
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 70vw;
  z-index: 10;
  transform: ${props =>
    props.open ? `translateX(${props.menuTranslateX}%)` : `translateX(-100%)`};

  ${mq("medium")} {
    margin-top: 1rem;
    padding: 1rem;
    background: transparent;
    transform: translate(0);
    position: static;
    width: 220px;
    margin-right: 2rem;
  }
`;

const Sidebar: React.FC = () => {
  const { loading, error, data } = useProjectsQuery();
  const [modalIsOpen, setModalOpen] = useState(false);
  const { isSideMenuOpen, setSideMenuOpen } = useSideMenu();

  const [touchX, setTouchX] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTouching, setTouching] = useState(false);

  let menuTranslateX = ((touchX - touchStartX) * 100) / window.innerWidth;
  menuTranslateX = Math.min(menuTranslateX, 0);

  if (loading) return null;
  if (error) return <div>Error!</div>;

  return (
    <>
      <Overlay
        visible={isSideMenuOpen}
        onTouchStart={() => {
          setSideMenuOpen(false);
        }}
      />
      <Wrapper
        menuTranslateX={menuTranslateX}
        isTouching={isTouching}
        open={isSideMenuOpen}
        onTouchStart={e => {
          setTouching(true);
          setTouchStartX(e.targetTouches[0].clientX);
          setTouchX(e.targetTouches[0].clientX);
        }}
        onTouchMove={e => {
          setTouchX(e.targetTouches[0].clientX);
        }}
        onTouchEnd={() => {
          setTouching(false);
          if (menuTranslateX < -25) {
            setSideMenuOpen(false);
          }
          setTouchStartX(0);
          setTouchX(0);
        }}
      >
        <CloseButton
          onClick={() => {
            setSideMenuOpen(false);
          }}
        >
          &times;
        </CloseButton>
        <ProjectList>
          {data.projects.map((project: Project) => (
            <ProjectListItem
              key={project.id}
              data-testid={`project-${project.id}`}
              style={{ opacity: project.id === "optimistic" ? 0.2 : 1 }}
            >
              <Link
                to={`/project/${project.id}`}
                onClick={() => {
                  setSideMenuOpen(false);
                }}
              >
                {project.name}
                <ProjectNumber>{project.tasks.length}</ProjectNumber>
              </Link>
              <DeleteProjectButton projectId={project.id} />
            </ProjectListItem>
          ))}
        </ProjectList>

        <Button
          onClick={() => setModalOpen(true)}
          data-testid="open-new-project-input"
        >
          Add Project
        </Button>

        <Modal open={modalIsOpen} onClose={() => setModalOpen(false)}>
          <CreateProjectForm onSubmit={() => setModalOpen(false)} />
        </Modal>
      </Wrapper>
    </>
  );
};

export default Sidebar;

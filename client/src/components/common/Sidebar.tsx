import React, { useState } from "react";

import styled, { color, mq } from "../../config/styles";
import Button from "./Button";
import { useSideMenu } from "../../utils/SideMenuProvider";

interface WrapperProps {
  open: boolean;
  menuTranslateX: number;
  isTouching: boolean;
}

const Sidebar: React.FC = ({ children }) => {
  const { isSideMenuOpen, setSideMenuOpen } = useSideMenu();
  const [touchX, setTouchX] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTouching, setTouching] = useState(false);

  let menuTranslateX = ((touchX - touchStartX) * 100) / window.innerWidth;
  menuTranslateX = Math.min(menuTranslateX, 0);

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
        {children}
      </Wrapper>
    </>
  );
};

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0.5rem;
  border: none;
  font-size: 2rem;
  padding: 0.2rem;
  line-height: 1;
  color: ${color("text")};
  &:hover {
    background: transparent;
    color: ${color("primary")};
  }
  ${mq("medium")} {
    display: none;
  }
`;

const Overlay = styled.div<{ visible: boolean }>`
  transition: all 0.4s;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9;
  opacity: ${props => (props.visible ? "1.0" : "0")};
  pointer-events: ${props => (props.visible ? "auto" : "none")};
`;

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  transition: all ${props => (props.isTouching ? `0s` : `0.4s`)};
  padding: 4rem 1rem 1rem 1rem;
  background: ${color("background")};
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
    z-index: 1;
  }
`;

export default Sidebar;

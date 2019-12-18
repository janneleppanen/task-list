import React from "react";

import styled from "../../../config/styles";

interface Props {
  label?: string;
  children: React.ReactNode;
}

const FormItem: React.FC<Props> = props => {
  return (
    <Wrapper>
      {props.label ? (
        <Label>
          <LabelText>{props.label}</LabelText> {props.children}
        </Label>
      ) : (
        props.children
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
`;

const LabelText = styled.span`
  display: block;
`;

export default FormItem;

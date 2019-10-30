import styled from "../../config/styles";

const Input = styled.input`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: transparent;
  width: 100%;
  max-width: 225px;
`;

export default Input;

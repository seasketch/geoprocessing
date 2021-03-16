//@ts-nocheck
import React from "react";
import styled from "styled-components";

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: black;
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${(props) => "lightgray"}
  border-radius: 3px;
  transition: all 150ms;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 0px;
  }
  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")}
  }
`;

//@ts-ignore
const CheckboxRender = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />

    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChangeCallback: string;
}
export default class Checkbox extends React.Component {
  state: { checked: false };
  constructor(props: CheckboxProps) {
    super(props);
    this.state = props;
  }

  handleCheckboxChange(event: any) {
    console.log("checked!!");
    this.setState({ checked: event.target.checked });
    if (this.state.onChangeCallback) {
      this.state.onChangeCallback(event.target.checked);
    }
  }

  render() {
    return (
      <div>
        <label>
          <CheckboxRender
            checked={this.state.checked}
            onChange={this.handleCheckboxChange.bind(this)}
          />
          <span style={{ marginLeft: 8 }}>{this.state.label}</span>
        </label>
      </div>
    );
  }
}

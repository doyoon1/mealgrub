import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownLabel = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #aaa;
  justify-content: space-between;
  &:hover {
    color: #fff;
  }
`;


const DropdownLink = styled(Link)`
  text-decoration: none;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;

  svg {
    width: 15px;
    height: 15px;
  }
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  background-color: #111;
  min-width: 160px;
  z-index: 1;
  border: 1px solid #111;
`;

const DropdownItem = styled.a`
  color: #aaa;
  text-decoration: none;
  display: block;
  padding: 10px;

  &:hover {
    background-color: #333;
    color: #fff;
    transition: all 0.3s ease;
  }
`;

const NavDropdown = ({ categories, label }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = (show) => {
    setDropdownVisible(show);
  };

  categories.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DropdownContainer
      onMouseEnter={() => toggleDropdown(true)}
      onMouseLeave={() => toggleDropdown(false)}
    >
      <DropdownLabel>
        {label}
        <Icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </Icon>
      </DropdownLabel>
      <DropdownContent visible={dropdownVisible}>
        {categories.map((category) => {
          const categoryURL = `/category/${category._id}`;
          return (
            <DropdownLink href={categoryURL} key={category._id}>
              <DropdownItem>{category.name}</DropdownItem>
            </DropdownLink>
          );
        })}
      </DropdownContent>
    </DropdownContainer>
  );
};

export default NavDropdown;

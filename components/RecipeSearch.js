import styled from "styled-components";
import Center from "./Center";
import { useState } from "react";
import { useRouter } from "next/router";

const StyledBg = styled.header`
  background-color: #F0F2F5;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  @media screen and (max-width: 768px) {
    padding: 10px 0;
  }
`;

const SearchInput = styled.input`
  padding: 10px 20px;
  width: 100%;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  outline: none;
  font-family: "Poppins", sans-serif;

  @media screen and (max-width: 768px) {
    padding: 10px;
    font-size: 1rem;
  }
`;

const SearchButton = styled.button`
  background-color: #222;
  color: #fff;
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  border: 1px solid #222;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
  cursor: pointer;
  outline: none;

  @media screen and (max-width: 768px) {
    padding: 10px;
    font-size: 1rem;
  }
`;

const SearchIcon = styled.svg`
  width: 24px;
  height: 24px;
`;

export default function RecipeSearch({ initialValue }) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const router = useRouter();

  // Handle real-time search
  const handleSearch = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    // Perform the search and update the URL
    router.push(`/recipes?query=${newSearchQuery}`);
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <StyledBg>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for recipes or ingredient..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <SearchButton onClick={() => handleSearch({ target: { value: searchQuery } })}>
            <SearchIcon
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </SearchIcon>
          </SearchButton>
        </SearchContainer>
      </StyledBg>
    </div>
  );
}

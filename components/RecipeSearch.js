import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const StyledBg = styled.header`
  background-color: #F0F2F5;
`;

const SearchContainer = styled.div`
  position: relative;
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
  border-bottom-left-radius: ${(props) => (props.isFocused && props.hasRecentSearches ? '0' : '32px')};
  outline: none;
  font-family: "Poppins", sans-serif;
  z-index: 999;

  @media screen and (max-width: 768px) {
    padding: 10px;
    font-size: 1rem;
  }
`;

const SearchButton = styled.button`
  background-color: #222;
  color: #fff;
  padding: 8px 20px;
  font-size: 1.2rem;
  border: none;
  border: 1px solid #222;

  border-top-right-radius: 32px;
  border-bottom-right-radius: ${(props) => (props.isFocused && props.hasRecentSearches ? '0' : '32px')};
  cursor: pointer;
  outline: none;
  z-index: 999;

  @media screen and (max-width: 768px) {
    padding: 6px 10px;
    font-size: 1rem;
  }
`;

const SearchIcon = styled.svg`
  width: 24px;
  height: 24px;
`;

const RecentSearchDropdown = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  padding-top: 20px;
  padding-bottom: 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 5px 5px;
  max-height: auto;
  overflow-y: auto;
  border-bottom-right-radius: 32px;
  border-bottom-left-radius: 32px;
  z-index: 998;
`;

const RecentSearchItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function RecipeSearch({ initialValue }) {
  const [searchQuery, setSearchQuery] = useState(initialValue || "");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedRecentSearches = localStorage.getItem("recentSearches");
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  // Handle real-time search
  const handleSearch = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
  };

  const performSearch = () => {
    // Check if the search query is not empty
    if (searchQuery.trim() === "") {
      // Optionally, you can handle this case differently, e.g., show a message to the user
      return;
    }

    // Check if the search query is already in recent searches
    if (!recentSearches.includes(searchQuery)) {
      const updatedRecentSearches = [searchQuery, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
    }

    // Construct the new URL based on the search query
    const newUrl = `/recipes?query=${searchQuery}`;

    // Update the router with the new URL
    router.push(newUrl);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleRecentSearchClick = (recentSearch) => {
    setSearchQuery(recentSearch);
    performSearch();
  };

  return (
    <div>
      <StyledBg>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for recipes or ingredient..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onMouseDown={() => setIsInputFocused(true)}
            onKeyDown={handleKeyDown}
            isFocused={isInputFocused}
            hasRecentSearches={recentSearches.length > 0}
          />
          <SearchButton onClick={performSearch} isFocused={isInputFocused}>
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
          {isInputFocused && recentSearches.length > 0 && (
            <RecentSearchDropdown>
              {recentSearches.map((recentSearch, index) => (
                <RecentSearchItem key={index} onMouseDown={() => handleRecentSearchClick(recentSearch)}>
                  {recentSearch}
                </RecentSearchItem>
              ))}
            </RecentSearchDropdown>
          )}
        </SearchContainer>
      </StyledBg>
    </div>
  );
}
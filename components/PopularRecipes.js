import styled from "styled-components";
import RecipesGrid from "./RecipesGrid";
import Link from "next/link";

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 20px 0 20px;
  font-weight: 500;
`;

const SeeMore = styled(Link)`
  text-decoration: none;
  margin-top: 8px;
`;

const SeeMoreLink = styled.div`
  font-size: 1rem;
  color: #0070f3;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function PopularRecipes({ popularRecipes, session }) {
  return (
    <div>
      <TitleContainer>
        <Title>Top Rated</Title>
      </TitleContainer>
      <RecipesGrid recipes={popularRecipes} session={session} />
    </div>
  );
}
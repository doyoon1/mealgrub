import styled from "styled-components";
import Center from "./Center";
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

export default function NewRecipes({ recipes, session }) {
  return (
    <div>
      <TitleContainer>
        <Title>New Arrivals</Title>
        <SeeMore href="/recipes" passHref>
          <SeeMoreLink>See All</SeeMoreLink>
        </SeeMore>
      </TitleContainer>
      <RecipesGrid recipes={recipes} session={session}/>
    </div>
  );
}
import styled from "styled-components";
import RecipeBox from "./RecipeBox";
import React, { useState } from "react";
import RecipeModal from "./RecipeDetails";

const StyledRecipesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media screen and (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export default function RecipesGrid({ recipes, session }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    openModal();
  };

  return (
    <div>
      <StyledRecipesGrid>
        {recipes?.length > 0 &&
          recipes.map((recipe) => (
            <RecipeBox
              key={recipe._id}
              {...recipe}
              openModal={() => handleRecipeClick(recipe)}
            />
          ))}
      </StyledRecipesGrid>
      <RecipeModal isOpen={modalIsOpen} closeModal={closeModal} recipe={selectedRecipe} session={session} />
    </div>
  );
}
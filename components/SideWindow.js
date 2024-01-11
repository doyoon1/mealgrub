import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { BagContext } from "@/components/BagContext";
import axios from "axios";

const WindowContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-390px")};
  width: 390px;
  height: 100%;
  background-color: #f7f7f7;
  transition: right 0.5s;
  box-shadow: ${(props) => (props.isOpen ? "5px 0 20px rgba(0, 0, 0, 0.5)" : "none")};
  z-index: 999;
  padding-bottom: 2rem;
  overflow-y: scroll;
`;

const RecipeWrapper = styled.div`
  margin-bottom: 10px;
  margin: 0 1rem;
  background-color: #fff;
  box-shadow: 0 2px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
`;

const BagTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  font-family: 'League Spartan', sans-serif;
`;

const TitleLabel = styled.h2`
  padding: 8px 10px;
  font-weight: 500;
  color: #222;
  font-size: 14px;
  background-color: #CDDDC9;
  text-transform: uppercase;
`;

const RecipeItem = styled.div`
  border-bottom: 1px solid #cdddc9;
  padding: 4px 0;
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
`;

const RecipeLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
`;

const RecipeImage = styled.img`
  width: 60px;
  height: 50px; 
  object-fit: cover;
  margin: 0 10px;
`;

const RecipeTitle = styled.p`
  font-size: 12px;
  margin: 0;
  color: #111;
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  white-space: normal;
`;

const RecipeServings = styled.p`
  font-size: 10px;
  margin: 0;
  color: #555;
  font-weight: 400;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
  margin-right: 1px;
  display: flex;
`;

const RemoveButtonIcon = styled.svg`
  fill: #e53935;
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

const EmptyBagMessage = styled.div`
  font-size: 14px;
  margin: 0;
  color: #111;
  font-weight: 500;
  white-space: normal;
  padding: 4px 10px;
  padding-bottom: 10px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const EmptyIcon = styled.div`
  margin-right: 4px;
  color: #aaa;
  height: 24px;
  width: 24px;
  text-align: center;
  align-items: center;
  justify-content: center;
  align-content: center;
`;


const SideWindow = ({ isOpen }) => {
  const { bagRecipes, removeRecipe } = useContext(BagContext);
  const [recipeDetails, setRecipeDetails] = useState([]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const details = await Promise.all(
        bagRecipes.map(async (recipeId) => {
          const response = await axios.post("/api/bagRecipes", { ids: [recipeId] });
          return response.data[0];
        })
      );
      setRecipeDetails(details);
    };

    fetchRecipeDetails();
  }, [bagRecipes]);

  const handleRemoveRecipe = (recipeId) => {
    removeRecipe(recipeId);
  };

  return (
    <WindowContainer isOpen={isOpen}>
      <BagTitle>My Bag</BagTitle>
      <RecipeWrapper>
      <TitleLabel>Recipe Name</TitleLabel>
        {bagRecipes.length === 0 && (
          <EmptyBagMessage>
          <EmptyIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </EmptyIcon>
            Your bag is empty!
          </EmptyBagMessage>
        )}
        {recipeDetails.map((recipe) => (
          <RecipeItem key={recipe._id}>
            <RecipeLink href={`/recipe/${recipe._id}`} target="_blank" rel="noopener noreferrer">
              <RecipeImage src={recipe.images?.[0]} alt={recipe.title} />
              <div>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeServings>Servings: {recipe.servings}</RecipeServings>
              </div>
            </RecipeLink>
            <RemoveButton onClick={() => handleRemoveRecipe(recipe._id)}>
              <RemoveButtonIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </RemoveButtonIcon>
            </RemoveButton>
          </RecipeItem>
        ))}
      </RecipeWrapper>
    </WindowContainer>
  );
};


export default SideWindow;
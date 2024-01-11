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

  @media screen and (max-width: 768px) {
    width: 100%;
    right: ${(props) => (props.isOpen ? "0" : "-100%")};
  }
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
  @media screen and (max-width: 768px) {
    text-align: left;
    margin-left: 20px;
    margin-bottom: 0;
  }
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

const CloseIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  display: block;

  svg {
    height: 18px;
    width: 18px;
    fill: #222;
  }
`;

const SideWindow = ({ isOpen, onClose }) => {
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
      <CloseIcon onClick={onClose}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.3956 7.75734C16.7862 8.14786 16.7862 8.78103 16.3956 9.17155L13.4142 12.153L16.0896 14.8284C16.4802 15.2189 16.4802 15.8521 16.0896 16.2426C15.6991 16.6331 15.0659 16.6331 14.6754 16.2426L12 13.5672L9.32458 16.2426C8.93405 16.6331 8.30089 16.6331 7.91036 16.2426C7.51984 15.8521 7.51984 15.2189 7.91036 14.8284L10.5858 12.153L7.60436 9.17155C7.21383 8.78103 7.21383 8.14786 7.60436 7.75734C7.99488 7.36681 8.62805 7.36681 9.01857 7.75734L12 10.7388L14.9814 7.75734C15.372 7.36681 16.0051 7.36681 16.3956 7.75734Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4 1C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4C23 2.34315 21.6569 1 20 1H4ZM20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3Z"
          fill="currentColor"
        />
      </svg>
      </CloseIcon>
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
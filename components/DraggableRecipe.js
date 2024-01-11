import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { useContext } from 'react';
import { BagContext } from './BagContext';

const DraggableRecipeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 24px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  width: auto;
  padding: 4px 8px;
  margin-bottom: 10px;
`;

const RecipeImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
`;

const RemoveIcon = styled.svg`
  width: 20px;
  height: 20px;
  margin: 0 10px;
`;

const RecipeTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  padding: 0;
  display: flex;
`;

const RemoveButtonIcon = styled.svg`
  fill: #e53935;
  width: 16px;
  height: 16px;
`;


const DraggableRecipe = ({ recipe, session }) => {
  const { bagRecipes, removeRecipe } = useContext(BagContext);
  const [{ isDragging }, drag] = useDrag({
    type: 'RECIPE',
    item: { recipe },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleRemoveRecipe = (recipeId) => {
    removeRecipe(recipeId);
  };

  return (
    <DraggableRecipeContainer
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      <RecipeImage src={recipe.images?.[0]} alt={recipe.title} />
      <RecipeTitle>{recipe.title}</RecipeTitle>
      <RemoveButton onClick={() => handleRemoveRecipe(recipe._id)}>
        <RemoveButtonIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </RemoveButtonIcon>
      </RemoveButton>
    </DraggableRecipeContainer>
  );
};

export default DraggableRecipe;
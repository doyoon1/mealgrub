import { BagContext } from "@/components/BagContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import PlannerModal from "@/components/PlannerModal";
import { PlannerContext } from "@/components/PlannerContext";
import Link from 'next/link';
import ScrollToTopButton from "@/components/ScrollToTop";

const RecipeContainer = styled.div`
  display: flex;
  gap: 20px;
  background-color: #fff;
  padding: 1rem 1rem;
  border-radius: 8px;
  margin-bottom: 20px;
  height: 160px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const RecipeContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipeItem = styled.div`
  display: flex;
  align-items: flex-start;
`;

const RecipeImage = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
`;

const RecipeTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 88px;
`;

const TitleLink = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 88px;
  text-decoration: none;
  color: #222;
  &:hover{
    text-decoration: underline;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px; 
  align-items: center; 
`;

const ButtonCommonStyles = `
  background-color: #E4E6EB;
  color: #111;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  &:hover {
    background-color: #D8DADF;
  }
`;

const AddToPlannerButton = styled.button`
  ${ButtonCommonStyles}
  width: 200px;
`;

const UnsaveButton = styled.button`
  ${ButtonCommonStyles}
  width: 50px;
  display: flex;
  align-items: center;
  svg {
    height: 24px;
    width: 24px;
    fill: currentColor;
  }
`;

export default function BagPage() {
  const { bagRecipes, removeRecipe } = useContext(BagContext);
  const [recipes, setRecipes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { addRecipeToDay } = useContext(PlannerContext);

  useEffect(() => {
    if (bagRecipes === null || bagRecipes.length === 0) {
      // No need to fetch recipes if the bag is empty or still being initialized
      return;
    }

    axios.post('/api/bag', { ids: bagRecipes })
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setRecipes([]); // Handle the error by setting recipes to an empty array
      });
  }, [bagRecipes]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddToPlanner = () => {
    if (selectedRecipe) {
      addRecipeToDay(selectedDay, selectedRecipe);
      closeModal();
    }
  };

  useEffect(() => {
    // Check if bag is empty, and set recipes to an empty array
    if (bagRecipes.length === 0) {
      setRecipes([]);
    }
  }, [bagRecipes]);

  if (bagRecipes === null) {
    // Add a loading indicator while the data is being initialized
    return <div>Loading...</div>;
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
      <Header />
      <Center>
      <h2>My Bag</h2>
        {!bagRecipes?.length && (
          <div>Your bag is empty.</div>
        )}
        {recipes?.length > 0 && (
        <>
          {recipes.map(recipe => (
            <RecipeContainer key={recipe._id}>
              <RecipeItem>
                <RecipeImage src={recipe.images?.[0]} alt={recipe.title} />
                <RecipeContent>
                  <TitleLink href={`/recipe/${recipe._id}`} passHref>
                    <RecipeTitle as="a">{recipe.title}</RecipeTitle>
                  </TitleLink>
                  <ButtonsWrapper>
                    <AddToPlannerButton onClick={() => {
                      setSelectedRecipe(recipe);
                      openModal();
                    }}>
                      Add to Planner
                    </AddToPlannerButton>
                    <UnsaveButton onClick={() => removeRecipe(recipe._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93zM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 013.75 21z" />
                      </svg>
                    </UnsaveButton>
                  </ButtonsWrapper>
                </RecipeContent>
              </RecipeItem>
            </RecipeContainer>
          ))}
        </>
      )}

      <PlannerModal
        recipe={selectedRecipe}
        isOpen={modalIsOpen}
        closeModal={closeModal}
        handleAddToPlanner={handleAddToPlanner}
      />
      <ScrollToTopButton />
      </Center>
    </>
  );
}
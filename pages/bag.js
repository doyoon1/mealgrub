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

const PageContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  margin-bottom: 50px;
`;

const BagTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
`;

const EmptyBagMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-bottom: 40px;
  a{
    color: #0070f3;
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
`;

const RecipeContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
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

const RecipeContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipeDescription = styled.p`
  font-size: 12px;
  color: #555;
  margin-bottom: 10px;
`;

const RecipeDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipeDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #777;
  margin-bottom: 5px;

  svg {
    height: 18px;
    width: 18px;
    fill: currentColor;
    margin-right: 5px;
  }
`;

const RecipeTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: #222;
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
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
  const MAX_DESCRIPTION_WORDS = 40;

  useEffect(() => {
    if (bagRecipes === null || bagRecipes.length === 0) {
      return;
    }

    axios.post('/api/bagRecipes', { ids: bagRecipes })
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
    return <div>Loading...</div>;
  }

  function truncateDescription(description) {
    const words = description.split(' ');
    if (words.length <= MAX_DESCRIPTION_WORDS) {
      return description;
    } else {
      return words.slice(0, MAX_DESCRIPTION_WORDS).join(' ') + '...';
    }
  }

  return (
    <PageContainer>
      <Header />
      <Center>
        <BagTitle>My Bag</BagTitle>
        {!bagRecipes?.length && (
          <EmptyBagMessage>Your bag is empty. <a href="/recipes">Browse recipes.</a></EmptyBagMessage>
        )}
        <RecipesGrid>
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
                      <RecipeDescription>{truncateDescription(recipe.description)}</RecipeDescription>
                      <RecipeDetails>
                        <RecipeDetail>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-1v7a1 1 0 01-1 1H8a1 1 0 01-1-1V2H6a1 1 0 00-1 1v18a1 1 0 001 1h11a1 1 0 001-1v-9h1a1 1 0 010 2h-1v1a3 3 0 01-3 3H8a3 3 0 01-3-3V3a3 3 0 013-3h7a3 3 0 013 3v1h1a1 1 0 010-2zm-5 8h1V5h-1v5zm-2-5h1v8H8V5zM7 18a1 1 0 100-2 1 1 0 000 2zm10-1a1 1 0 100-2 1 1 0 000 2z" />
                          </svg>
                          Cooking Time: {recipe.cookingTime}
                        </RecipeDetail>
                        <RecipeDetail>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 5a3 3 0 013-3h8a3 3 0 013 3v5.586a1 1 0 01-.293.707l-5.147 5.146a1 1 0 01-1.414 0L5.293 11.293A1 1 0 015 10.586V5zm1 0v5.586L12 17.172 18 10.586V5a1 1 0 00-1-1H6a1 1 0 00-1 1z" />
                          </svg>
                          Servings: {recipe.servings}
                        </RecipeDetail>
                      </RecipeDetails>
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
        </RecipesGrid>

        <PlannerModal
          recipe={selectedRecipe}
          isOpen={modalIsOpen}
          closeModal={closeModal}
          handleAddToPlanner={handleAddToPlanner}
        />
        <ScrollToTopButton />
      </Center>
    </PageContainer>
  );
}
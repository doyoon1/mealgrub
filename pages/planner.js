import { useContext, useEffect, useState } from "react";
import { BagContext } from "@/components/BagContext";
import axios from "axios";
import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import WeekCalendar from '@/components/Planner';
import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableRecipe from '@/components/DraggableRecipe';
import { useSession } from "next-auth/react";

const Title = styled.h1`
  font-family: 'League Spartan', sans-serif;
  margin: 50px 0;
`;

const RecipeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  user-select: none;
`;

const MessageContainer = styled.div`
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`;

export default function PlannerPage() {
  const { bagRecipes } = useContext(BagContext);
  const [recipes, setRecipes] = useState([]);
  const { data:session } = useSession();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (bagRecipes.length === 0) {
      // No need to fetch recipes if the bag is empty
      return;
    }

    axios
      .post('/api/bagRecipes', { ids: bagRecipes })
      .then(response => {
        console.log('Fetched recipes:', response.data);
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setRecipes([]); // Handle the error by setting recipes to an empty array
      });
  }, [bagRecipes]);

  const [, drop] = useDrop({
    accept: 'RECIPE',
    drop: (item, monitor) => {
      // Handle the drop event, e.g., update the planner state
      const { recipe } = item;
      console.log(`Dropped recipe ${recipe.title} into planner!`);
    },
  });

  return (
    <>
      <Header />
      <Center>
        {screenWidth >= 960 ? (
          <>
            <Title>My Planner</Title>
            {recipes.length > 0 ? (
              <div>
                <RecipeContainer ref={drop}>
                  {bagRecipes.map(recipeId => {
                    const recipe = recipes.find(r => r._id === recipeId);
                    return recipe ? (
                      <DraggableRecipe key={recipe._id} recipe={recipe} session={session} />
                    ) : null;
                  })}
                </RecipeContainer>
                <WeekCalendar />
              </div>
            ) : (
              <div>Your bag is empty.</div>
            )}
          </>
        ) : (
          <MessageContainer>
            Planner is only available for desktop.
          </MessageContainer>
        )}
      </Center>
    </>
  );
}
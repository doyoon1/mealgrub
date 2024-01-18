import { useContext, useEffect, useState } from "react";
import { BagContext } from "@/components/BagContext";
import axios from "axios";
import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import Planner from '@/components/Planner';
import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableRecipe from '@/components/DraggableRecipe';
import { useSession } from "next-auth/react";
import html2canvas from 'html2canvas';
import { useRef } from "react";

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

const DesktopContainer = styled.div`
  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  @media screen and (min-width: 961px) {
    display: none;
  }
`;

const Download = styled.button`
  background-color: #CDDDC9;
  border: 1px solid #ccc;
  margin: 10px 0 0 0;
  padding: 6px 16px;
  font-weight: 500;
  cursor: pointer;
`;

export default function PlannerPage() {
  const { bagRecipes } = useContext(BagContext);
  const [recipes, setRecipes] = useState([]);
  const { data: session } = useSession();
  const containerRef = useRef();

  useEffect(() => {
    if (bagRecipes.length === 0) {
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
        setRecipes([]);
      });
  }, [bagRecipes]);

  const [, drop] = useDrop({
    accept: 'RECIPE',
    drop: (item, monitor) => {
      const { recipe } = item;
      console.log(`Dropped recipe ${recipe.title} into planner!`);
    },
  });

  const handleDownloadClick = async () => {
    const container = containerRef.current;

    if (container) {
      // Use html2canvas to convert HTML to an image
      const canvas = await html2canvas(container);

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'Planner-image.png';
      link.click();
    }
  };

  return (
    <>
      <Header />
      <Center>
        <DesktopContainer>
          <Title>My Planner</Title>
          {recipes.length > 0 && (
          <div>
            <RecipeContainer ref={drop}>
              {bagRecipes?.map(recipeId => {
                const recipe = recipes.find(r => r._id === recipeId);
                return recipe ? (
                  <DraggableRecipe key={recipe._id} recipe={recipe} session={session} />
                ) : null;
              })}
            </RecipeContainer>
          </div>
        )}
        <Download onClick={handleDownloadClick}>Download Planner</Download>
        <div ref={containerRef}>
          <Planner />
        </div>
        </DesktopContainer>
        <MobileContainer>
          <MessageContainer>
            Planner is only available for desktop.
          </MessageContainer>
        </MobileContainer>
      </Center>
    </>
  );
}

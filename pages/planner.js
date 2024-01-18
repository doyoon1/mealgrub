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

const DownloadContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 0 0 0;
  padding-right: 4px;
`;

const PlannerContainer = styled.div`
  padding: 4px;
`;

const Download = styled.button`
  background-color: #CDDDC9;
  border: 1px solid #ccc;
  padding: 2px 12px;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
`;

const EditableText = styled.span`
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
  user-select: none;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const EditableInput = styled.input`
  font-size: 14px;
  margin-right: 10px;
  width: 300px;
`;

export default function PlannerPage() {
  const { bagRecipes } = useContext(BagContext);
  const [recipes, setRecipes] = useState([]);
  const { data: session } = useSession();
  const containerRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState("double click to add title or notes");

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
      const canvas = await html2canvas(container, {
        scale: 2,
      });
  
      const dataUrl = canvas.toDataURL('image/png');
  
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'MealGrub-Planner.png';
      link.click();
    }
  };
  
  const handleDoubleClick = () => {
    setEditMode(true);
  };

  const handleInputBlur = () => {
    if (editableText.trim() === '') {
      setEditableText("double click to add title or notes");
    }
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    setEditableText(e.target.value);
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
        <DownloadContainer>
          <Download onClick={handleDownloadClick}>Download Planner</Download>
        </DownloadContainer>
        <PlannerContainer ref={containerRef}>
          {editMode ? (
              <EditableInput
                type="text"
                value={editableText}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                autoFocus
              />
            ) : (
              <EditableText onDoubleClick={handleDoubleClick}>
                {editableText}
              </EditableText>
            )}
          <Planner />
        </PlannerContainer>
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

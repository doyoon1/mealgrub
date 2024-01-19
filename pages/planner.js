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
import { useRouter } from "next/router";

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
  width: 400px;
`;

const EditableTitle = styled.h2`
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
  user-select: none;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const TitleInput = styled.input`
  font-size: 14px;
  margin-right: 10px;
  width: 300px;
`;

const EditableContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function PlannerPage() {
  const { bagRecipes } = useContext(BagContext);
  const [recipes, setRecipes] = useState([]);
  const { data: session } = useSession();
  const containerRef = useRef();
  const [editModeDate, setEditModeDate] = useState(false);
  const [editableTextDate, setEditableTextDate] = useState("");
  const [editModeNotes, setEditModeNotes] = useState(false);
  const [editableTextNotes, setEditableTextNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (bagRecipes.length === 0) {
      return;
    }

    const currentDate = new Date();
    const currentWeekMonday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + 1
    );

    const nextWeekMonday = new Date(
      currentWeekMonday.getFullYear(),
      currentWeekMonday.getMonth(),
      currentWeekMonday.getDate() + 7
    );

    const currentWeekSunday = new Date(nextWeekMonday.getTime() - 1);

    const formattedDateRange = `${currentWeekMonday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} - ${currentWeekSunday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`;

    setEditableTextDate(formattedDateRange);

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
  
  const handleSingleClickDate = () => {
    setEditModeDate(true);
  };

  const handleInputBlurDate = () => {
    if (editableTextDate.trim() === '') {
      const currentDate = new Date();
      const currentWeekMonday = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay() + 1
      );

      const nextWeekMonday = new Date(
        currentWeekMonday.getFullYear(),
        currentWeekMonday.getMonth(),
        currentWeekMonday.getDate() + 7
      );

      const currentWeekSunday = new Date(nextWeekMonday.getTime() - 1);

      const formattedDateRange = `${currentWeekMonday.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })} - ${currentWeekSunday.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`;

      setEditableTextDate(formattedDateRange);
    }
    setEditModeDate(false);
  };

  const handleInputChangeDate = (e) => {
    setEditableTextDate(e.target.value);
  };

  const handleSingleClickNotes = () => {
    setEditModeNotes(true);
  };

  const handleInputBlurNotes = () => {
    setEditModeNotes(false);
  };

  const handleInputChangeNotes = (e) => {
    setEditableTextNotes(e.target.value);
  };

  const handleLoginLinkClick = () => {
    router.push("/login");
  };

  return (
    <>
      <Header />
      <Center>
        {session ? (
          <DesktopContainer>
            <Title>My Planner</Title>
            {recipes.length > 0 && (
              <div>
                <RecipeContainer ref={drop}>
                  {bagRecipes?.map((recipeId) => {
                    const recipe = recipes.find((r) => r._id === recipeId);
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
              <EditableContainer>
                <EditableTitle onClick={handleSingleClickNotes}>
                  {editableTextNotes || "Click to add title..."}
                </EditableTitle>
                {editModeNotes ? (
                  <TitleInput
                    type="text"
                    value={editableTextNotes}
                    onChange={handleInputChangeNotes}
                    onBlur={handleInputBlurNotes}
                    autoFocus
                  />
                ) : (
                  <></>
                )}
                <EditableText onClick={handleSingleClickDate}>
                  {editableTextDate}
                </EditableText>
                {editModeDate ? (
                  <EditableInput
                    type="text"
                    value={editableTextDate}
                    onChange={handleInputChangeDate}
                    onBlur={handleInputBlurDate}
                    autoFocus
                  />
                ) : (
                  <></>
                )}
              </EditableContainer>
              <Planner session={session} />
            </PlannerContainer>
          </DesktopContainer>
        ) : (
          <MessageContainer>
            Please login to use the planner.{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer", color: "#0070f3" }} onClick={handleLoginLinkClick}>
              Click here.
            </span>
          </MessageContainer>
        )}
          <MobileContainer>
            <MessageContainer>Planner is only available for desktop.</MessageContainer>
          </MobileContainer>
      </Center>
    </>
  );
};
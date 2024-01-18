import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import { PlannerContext } from './PlannerContext';

const Bg = styled.div`
  margin-top: 8px;
  border-top: 1px solid #cdddc9;
  border-left: 1px solid #cdddc9;
  border-right: 1px solid #cdddc9;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const PlannerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  &:nth-child(even) {
    background-color: #FFF;
    border-bottom: 1px solid #cdddc9;
  }
  &:nth-child(odd) {
    background-color: #fff;
    border-bottom: 1px solid #cdddc9;
  }
`;

const DayContainer = styled.div`
  display: flex;
  text-transform: uppercase;
  font-size: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  background-color: inherit;
  border-right: 1px solid #cdddc9;
`;

const ContentContainer = styled.div`
  text-align: left;
  font-size: 12px;
  padding: 4px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const LabelContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  text-align: center;
`;

const DayLabel = styled.div`
  font-weight: 500;
  background-color: #FFF;
  text-transform: uppercase;
  font-size: 14px;
  color: #ff0000;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #cdddc9;
  border-bottom: 1px solid #cdddc9;
`;

const Label = styled.div`
  width: 100%;
  color: #222;
  text-transform: uppercase;
`;

const MealLabel = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  text-align: left;
  justify-content: center;
  align-items: center;
  background-color: #CDDDC9;
  border-bottom: 1px solid #cdddc9;
  padding-left: 10px;
`;

const RecipeContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0 12px 0px;
  user-select: none;
  width: 180px;
  position: relative;
`;

const Bullet = styled.span`
  width: 10px;
  margin: 0 2px;
  position: absolute;
  top: 3px;
  font-weight: bold;
  color: #ff0000;
`;

const RecipeTitle = styled.div`
  font-size: 12px;
  margin: 0;
  margin-left: 12px;
  color: #111;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  white-space: normal;
  cursor: pointer;
`;

const CloseButton = styled.span`
  color: #ff3040;
  height: 12px;
  width: 12px;
  display: flex;
  cursor: pointer;
`;

const TitleButtonWrapper = styled.div`
  display: flex;
  width: 200px;
  align-items: center;
  justify-content: space-between;

  ${CloseButton} {
    display: none;
  }

  &:hover ${CloseButton} {
    display: flex;
  }
`;

const Planner = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MealCategory = ['Breakfast', 'Lunch', 'Dinner', 'Other'];
  const { planner, addRecipeToDay, removeRecipeFromDay } = useContext(PlannerContext);
  const [isClient, setIsClient] = useState(false);
  const [clickedTitles, setClickedTitles] = useState([]);

  useEffect(() => {
    console.log('Planner state:', planner);
  }, [planner]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [, drop] = useDrop({
    accept: 'RECIPE',
    drop: (item, monitor) => {
      const { recipe } = item;
      const dropResult = monitor.getDropResult();
      console.log('Dropped item:', item);

      if (dropResult) {
        const { day, meal } = dropResult;
        addRecipeToDay(day, meal, recipe);
        console.log(`Dropped recipe ${recipe.title} into ${day}'s ${meal}!`);
      }
    },
  });

  const DropTarget = ({ day, meal }) => {
    const [, drop] = useDrop({
      accept: 'RECIPE',
      drop: (item, monitor) => {
        return {
          day,
          meal,
          recipe: item.recipe,
        };
      },
    });

    const handleRemoveRecipe = (recipeId) => {
      removeRecipeFromDay(day, meal, recipeId);
    };

    const handleTitleClick = (day, meal, recipeId) => {
      setClickedTitles((prevTitles) => {
        const dayMealKey = `${day}-${meal}`;
        const isClicked = prevTitles[dayMealKey]?.[recipeId];
        return {
          ...prevTitles,
          [dayMealKey]: {
            ...(prevTitles[dayMealKey] || {}),
            [recipeId]: !isClicked,
          },
        };
      });
    };

    return (
      <div ref={drop} style={{ height: '100%' }}>
        {planner[day]?.[meal]?.map((recipe) => (
          <RecipeContainer key={recipe._id}>
            {/* <RecipeImage src={recipe.images?.[0]} alt={recipe.title} /> */}
            <Bullet>•</Bullet>
            <TitleButtonWrapper>
              <RecipeTitle
                onClick={() => handleTitleClick(day, meal, recipe._id)}
                style={{ 
                  textDecoration: clickedTitles[`${day}-${meal}`]?.[recipe._id] ? 'line-through' : 'none',
                  color: clickedTitles[`${day}-${meal}`]?.[recipe._id] ? '#ff0000' : '#111'
                }}
              >
                {recipe.title}
              </RecipeTitle>
              <CloseButton onClick={() => handleRemoveRecipe(recipe._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              </CloseButton>
            </TitleButtonWrapper>
          </RecipeContainer>
        ))}
      </div>
    );
  };

  const collectedProps = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  }));

  return (
    <Bg ref={drop}>
      <LabelContainer>
        <DayLabel>Day</DayLabel>
        <MealLabel>
          {MealCategory.map((meal) => (
            <Label key={meal}>{meal}</Label>
          ))}
        </MealLabel>
      </LabelContainer>
      {isClient &&
        daysOfWeek.map((day, index) => (
          <PlannerContainer key={day} index={index + 1}>
            <DayContainer>{day}</DayContainer>
            <ContentContainer>
              {MealCategory.map((meal) => (
                <DropTarget key={`${day}-${meal}`} day={day} meal={meal} collectedProps={collectedProps} />
              ))}
            </ContentContainer>
          </PlannerContainer>
        ))}
    </Bg>
  );
};

export default Planner;
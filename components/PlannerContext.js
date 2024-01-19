import React, { createContext, useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export const PlannerContext = createContext();

const PlannerContextProvider = (props) => {
  const { data: session } = useSession();
  const initialPlanner = JSON.parse(
    typeof window !== 'undefined' ? localStorage.getItem('planner') : null
  ) || {};

  const [planner, setPlanner] = useState(initialPlanner);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('planner', JSON.stringify(planner));
    }
  }, [planner]);

  const addRecipeToDay = (day, meals, recipe) => {
    if (!session) {
      // Display a message if the user is not logged in
      toast.error('Please log in to use the planner', {
        position: 'top-center',
      });
      return;
    }

    const mealsArray = Array.isArray(meals) ? meals : [meals];
  
    console.log(`Adding recipe ${recipe.title} to ${day}'s ${mealsArray.join(', ')}`);
  
    const updatedPlanner = { ...planner };
  
    if (!updatedPlanner[day]) {
      updatedPlanner[day] = {};
    }
  
    mealsArray.forEach((meal) => {
      if (!updatedPlanner[day][meal]) {
        updatedPlanner[day][meal] = [];
      }
  
      const recipeExists = updatedPlanner[day][meal].some((r) => r.title === recipe.title);
  
      if (recipeExists) {
        // Display a toast message if the recipe already exists
        toast.error('Recipe already added to the planner', {
          position: 'top-center',
        });
        return;
      }
  
      updatedPlanner[day][meal].push(recipe);

      // Display a success toast message when a recipe is added
      toast.success('Recipe added to the planner', {
        position: 'top-center',
      });
    });
  
    setPlanner(updatedPlanner);
  };
  
  const removeRecipeFromDay = (day, meal, recipeId) => {
    if (!session) {
      // Display a message if the user is not logged in
      toast.error('Please log in to use the planner', {
        position: 'top-center',
      });
      return;
    }

    const updatedPlanner = { ...planner };

    if (updatedPlanner[day] && updatedPlanner[day][meal]) {
      updatedPlanner[day][meal] = updatedPlanner[day][meal].filter((recipe) => recipe._id !== recipeId);

      if (updatedPlanner[day][meal].length === 0) {
        delete updatedPlanner[day][meal];

        if (Object.keys(updatedPlanner[day]).length === 0) {
          delete updatedPlanner[day];
        }
      }

      toast.success('Recipe removed from the planner', {
        position: 'top-center',
      });

      setPlanner(updatedPlanner);
    }
  };

  return (
    <PlannerContext.Provider value={{ planner, addRecipeToDay, removeRecipeFromDay }}>
      {props.children}
    </PlannerContext.Provider>
  );
};

export default PlannerContextProvider;
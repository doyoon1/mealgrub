import React, { createContext, useState, useEffect } from "react";

export const PlannerContext = createContext();

const PlannerContextProvider = (props) => {
  // Load planner data from localStorage or set an empty object
  const initialPlanner = JSON.parse(
    typeof window !== 'undefined' ? localStorage.getItem('planner') : null
  ) || {};

  const [planner, setPlanner] = useState(initialPlanner);

  useEffect(() => {
    // Check if localStorage is available before using it
    if (typeof window !== 'undefined') {
      // Save planner data to localStorage whenever it changes
      localStorage.setItem('planner', JSON.stringify(planner));
    }
  }, [planner]);

  // Inside the PlannerContext.js file, within the addRecipeToDay function
  const addRecipeToDay = (day, meals, recipe) => {
    // Ensure meals is always an array
    const mealsArray = Array.isArray(meals) ? meals : [meals];
  
    console.log(`Adding recipe ${recipe.title} to ${day}'s ${mealsArray.join(', ')}`);
  
    // Create a copy of the planner to avoid mutating state directly
    const updatedPlanner = { ...planner };
  
    // Check if the day exists in the planner
    if (!updatedPlanner[day]) {
      // If the day doesn't exist, create a new entry with the recipe
      updatedPlanner[day] = {};
    }
  
    // Loop through the selected meals and update the recipes array for each meal
    mealsArray.forEach((meal) => {
      // Check if the meal exists for the selected day
      if (!updatedPlanner[day][meal]) {
        // If the meal doesn't exist, create a new array for recipes
        updatedPlanner[day][meal] = [];
      }
  
      // Check if the recipe already exists for the selected day and meal
      const recipeExists = updatedPlanner[day][meal].some((r) => r.title === recipe.title);
  
      // If the recipe exists, return without adding it again
      if (recipeExists) {
        return;
      }
  
      // If the recipe doesn't exist, update the recipes array for that day and meal
      updatedPlanner[day][meal].push(recipe);
    });
  
    // Update the planner state
    setPlanner(updatedPlanner);
  };
  
  const removeRecipeFromDay = (day, meal, recipeId) => {
    // Create a copy of the planner to avoid mutating state directly
    const updatedPlanner = { ...planner };

    // Check if the day exists in the planner
    if (updatedPlanner[day] && updatedPlanner[day][meal]) {
      // Remove the recipe with the specified recipeId from the day and meal
      updatedPlanner[day][meal] = updatedPlanner[day][meal].filter((recipe) => recipe._id !== recipeId);

      // If there are no recipes left for the day and meal, remove the meal
      if (updatedPlanner[day][meal].length === 0) {
        delete updatedPlanner[day][meal];

        // If there are no meals left for the day, remove the day
        if (Object.keys(updatedPlanner[day]).length === 0) {
          delete updatedPlanner[day];
        }
      }

      // Update the planner state
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
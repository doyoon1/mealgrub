import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const Label = styled.p`
  font-size: 16px;
  margin-bottom: 0px;
  margin-top: 8px;
`;

const SearchButton = styled.button`
  border: 0;
  background-color: #111;
  color: #fff;
  font-size: 16px;
  margin-top: 16px;
  padding: 8px 16px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
`;

export default function FilterWindow({ onFilterChange }) {
  const [mainCourses, setMainCourses] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [dietaryOptions, setDietaryOptions] = useState([]);
  const [others, setOthers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    mainCourses: [],
    localities: [],
    ingredients: [],
    dietaryOptions: [],
    others: [],
  });

  useEffect(() => {
    const parentCategoryIds = {
      MainCourses: '6581153849e5aa1bbc820d9b',
      Locality: '653cc03f21d56720298228be',
      Dietary: '653e62ebec031412f6316fb6',
      Other: '653e5850ec031412f6316f77',
    };

    // Fetch categories and ingredients from your database
    Promise.all([
      fetch('/api/categories').then((response) => response.json()),
      fetch('/api/ingredients').then((response) => response.json()),
    ])
      .then(([categoriesData, ingredientsData]) => {
        const mainCourses = categoriesData.filter((category) => category.parent === parentCategoryIds.MainCourses);
        const localityCategories = categoriesData.filter((category) => category.parent === parentCategoryIds.Locality);
        const dietaryCategories = categoriesData.filter((category) => category.parent === parentCategoryIds.Dietary);
        const otherCategories = categoriesData.filter((category) => category.parent === parentCategoryIds.Other);

        const mainCoursesOptions = mainCourses.map((category) => ({ value: category._id, label: category.name }));
        const localityOptions = localityCategories.map((category) => ({ value: category._id, label: category.name }));
        const dietaryOptions = dietaryCategories.map((category) => ({ value: category._id, label: category.name }));
        const otherOptions = otherCategories.map((category) => ({ value: category._id, label: category.name }));

        const uniqueIngredientsOptions = ingredientsData.ingredients.map((ingredient) => ({
          value: ingredient,
          label: ingredient,
        }));

        setMainCourses(mainCoursesOptions);
        setLocalities(localityOptions);
        setDietaryOptions(dietaryOptions);
        setIngredients(uniqueIngredientsOptions);
        setOthers(otherOptions);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Run this effect only once when the component mounts

  const handleSearch = () => {
    // Assuming the options have a property like `isSelected`, adjust accordingly
    const selectedMainCourses = mainCourses.filter((course) => course.isSelected).map((course) => course.value);
    const selectedLocalities = localities.filter((locality) => locality.isSelected).map((locality) => locality.value);
    const selectedIngredients = ingredients.filter((ingredient) => ingredient.isSelected).map((ingredient) => ingredient.value);
    const selectedDietaryOptions = dietaryOptions.filter((option) => option.isSelected).map((option) => option.value);
    const selectedOthers = others.filter((other) => other.isSelected).map((other) => other.value);
  
    // Update the object with default values
    const selectedFilters = {
      mainCourses: selectedMainCourses || [],
      localities: selectedLocalities || [],
      ingredients: selectedIngredients || [],
      dietaryOptions: selectedDietaryOptions || [],
      others: selectedOthers || [],
    };
  
    // Call the onFilterChange function with the selected filters
    onFilterChange('search', selectedFilters);
  };

  return (
    <div>
      <h1>Filter Window</h1>
      <Label>Main Courses</Label>
      <Select 
        isMulti 
        options={mainCourses}
        />
      <Label>Locality</Label>
      <Select 
        isMulti 
        options={localities}
        />
      <Label>Ingredients</Label>
      <Select 
        isMulti 
        options={ingredients}
        />
      <Label>Dietary</Label>
      <Select 
        isMulti 
        options={dietaryOptions}
        />
      <Label>Other</Label>
      <Select 
        isMulti 
        options={others}
        />
      <SearchButton onClick={handleSearch}>Search</SearchButton>
    </div>
  );
}
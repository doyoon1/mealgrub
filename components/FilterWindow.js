import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const FilterContainer = styled.div`
  margin: 20px 0 10px 0;
  transition: margin-top 1s;
`;

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

const FilterWindow = ({
  ingredients,
  categories,
  selectedIngredients,
  selectedCategories,
  selectedRating,
  onIngredientChange,
  onCategoryChange,
  onRatingChange,
  onSearch,
}) => {
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedRatingOption, setSelectedRatingOption] = useState(null);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      const fetchIngredients = async () => {
        try {
          const response = await fetch('/api/ingredients');
          const data = await response.json();
          const sortedIngredients = data.ingredients
            .map((ingredient) => ({ value: ingredient, label: ingredient }))
            .sort((a, b) => a.label.localeCompare(b.label));
          setIngredientOptions(sortedIngredients);
        } catch (error) {
          console.error('Error fetching ingredients:', error);
        }
      };

      fetchIngredients();
    }

    if (!categories || categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          const data = await response.json();
    
          const filteredCategories = data
            .filter((category) => category.parent !== null)
            .map((category) => ({ value: category.name, label: category.name }))
            .sort((a, b) => a.label.localeCompare(b.label));
    
          setCategoryOptions(filteredCategories);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
    
      fetchCategories();
    }
  }, [ingredients, categories]);

  return (
    <FilterContainer>
      <h1>Filter Window</h1>
      <Label>Ingredients</Label>
      <Select
        isMulti
        options={ingredientOptions}
        value={selectedIngredients}
        onChange={onIngredientChange}
      />
      <Label>Categories</Label>
      <Select
        isMulti
        options={categoryOptions}
        value={selectedCategories}
        onChange={onCategoryChange}
      />
      <Label>Average Rating</Label>
      <Select
        options={[
          { value: 1, label: '⭐' },
          { value: 2, label: '⭐⭐' },
          { value: 3, label: '⭐⭐⭐' },
          { value: 4, label: '⭐⭐⭐⭐' },
          { value: 5, label: '⭐⭐⭐⭐⭐' },
        ]}
        value={selectedRatingOption}
        onChange={(selectedOption) => {
          setSelectedRatingOption(selectedOption);
          onRatingChange(selectedOption);
        }}
        isClearable={true}
      />
      <SearchButton onClick={onSearch}>Search</SearchButton>
    </FilterContainer>
  );
};

export default FilterWindow;

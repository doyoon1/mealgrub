import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const FilterWindowContainer = styled.div`
  margin-top: 10px;
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


export default function FilterWindow({ ingredients, selectedIngredients, onIngredientChange, onSearch }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      const fetchIngredients = async () => {
        try {
          const response = await fetch('/api/ingredients');
          const data = await response.json();

          // Use a Set to filter out duplicate ingredients, ignoring case
          const uniqueIngredientsSet = new Set();
          const uniqueIngredientsMap = new Map();

          data.ingredients.forEach((ingredient) => {
            const trimmedLowercaseIngredient = ingredient.trim().toLowerCase();

            if (!uniqueIngredientsSet.has(trimmedLowercaseIngredient)) {
              uniqueIngredientsSet.add(trimmedLowercaseIngredient);
              uniqueIngredientsMap.set(trimmedLowercaseIngredient, ingredient);
            }
          });

          // Convert the unique ingredients back to their original cases
          const sortedUniqueIngredients = Array.from(uniqueIngredientsSet)
            .sort((a, b) => a.localeCompare(b))
            .map((trimmedLowercaseIngredient) => ({ value: trimmedLowercaseIngredient, label: uniqueIngredientsMap.get(trimmedLowercaseIngredient) }));

          setOptions(sortedUniqueIngredients);
        } catch (error) {
          console.error('Error fetching ingredients:', error);
        }
      };

      fetchIngredients();
    }
  }, [ingredients]);

  return (
    <>
      <FilterWindowContainer>
        <h1>Filter Window</h1>
        <Label>Ingredients</Label>
        <Select
          isMulti
          options={options}
          value={selectedIngredients}
          onChange={onIngredientChange}
        />
        <SearchButton onClick={onSearch}>Search</SearchButton>
      </FilterWindowContainer>
    </>
  );
}
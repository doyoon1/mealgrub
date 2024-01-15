import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import Center from './Center';

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
  const [options, setOptions] = useState(ingredients);


  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      const fetchIngredients = async () => {
        try {
          const response = await fetch('/api/ingredients');
          const data = await response.json();
          setOptions(data.ingredients.map((ingredient) => ({ value: ingredient, label: ingredient })));
        } catch (error) {
          console.error('Error fetching ingredients:', error);
        }
      };

      fetchIngredients();
    }
  }, [ingredients]);

  return (
    <>
      <h1>Filter Window</h1>
      <Label>Ingredients</Label>
      <Select
        isMulti
        options={options}
        value={selectedIngredients}
        onChange={onIngredientChange}
      />
      <SearchButton onClick={onSearch}>Search</SearchButton>
    </>
  );
}
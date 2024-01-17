import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { BagContext } from "@/components/BagContext";
import axios from "axios";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import Fraction from "fraction.js";
import "./fonts/Poppins-Light-normal"
import "./fonts/Poppins-Medium-normal"
import "./fonts/OpenSans_Condensed-Regular-normal"
import "./fonts/Inter-Regular-normal"
import "./fonts/Inter-Bold-normal"
import "./fonts/RobotoSlab-Medium-bold"

const WindowContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-390px")};
  width: 390px;
  height: 100%;
  background-color: #f7f7f7;
  transition: right 0.5s;
  box-shadow: ${(props) => (props.isOpen ? "5px 0 20px rgba(0, 0, 0, 0.5)" : "none")};
  z-index: 999;
  padding-bottom: 2rem;
  overflow-y: scroll;

  @media screen and (max-width: 768px) {
    width: 100%;
    right: ${(props) => (props.isOpen ? "0" : "-100%")};
  }
`;

const RecipeWrapper = styled.div`
  margin-bottom: 10px;
  margin: 0 1rem;
  background-color: #fff;
  box-shadow: 0 2px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
`;

const BagTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  font-family: 'League Spartan', sans-serif;
  @media screen and (max-width: 768px) {
    text-align: left;
    margin-left: 20px;
    margin-bottom: 0;
  }
`;

const TitleLabel = styled.h2`
  padding: 8px 10px;
  font-weight: 500;
  color: #222;
  font-size: 14px;
  background-color: #CDDDC9;
  text-transform: uppercase;
`;

const RecipeItem = styled.div`
  border-bottom: 1px solid #cdddc9;
  padding: 4px 0;
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
`;

const RecipeLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
`;

const RecipeImage = styled.img`
  width: 60px;
  height: 50px; 
  object-fit: cover;
  margin: 0 10px;
`;

const RecipeTitle = styled.p`
  font-size: 12px;
  margin: 0;
  color: #111;
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  white-space: normal;
`;

const RecipeServings = styled.p`
  font-size: 10px;
  margin: 0;
  color: #555;
  font-weight: 400;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
  margin-right: 1px;
  display: flex;
`;

const RemoveButtonIcon = styled.svg`
  fill: #e53935;
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

const EmptyBagMessage = styled.div`
  font-size: 14px;
  margin: 0;
  color: #111;
  font-weight: 500;
  white-space: normal;
  padding: 4px 10px;
  padding-bottom: 10px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const EmptyIcon = styled.div`
  margin-right: 4px;
  color: #aaa;
  height: 24px;
  width: 24px;
  text-align: center;
  align-items: center;
  justify-content: center;
  align-content: center;
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  display: block;

  svg {
    height: 18px;
    width: 18px;
    fill: #222;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin: 20px 0 40px 0;
`;


const WindowButton = styled.button`
  border: none;
  width: 140px;
  cursor: pointer;
  background-color: #CDDDC9;
  font-size: 12px;
  padding: 4px 14px;
  text-align: center;
  color: #222;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  svg{
    width: 14px;
    height: 14px;
  }
`;

const SideWindow = ({ isOpen, onClose }) => {
  const { bagRecipes, removeRecipe } = useContext(BagContext);
  const [recipeDetails, setRecipeDetails] = useState([]);
  const router = useRouter();

  const handlePlannerClick = () => {
    router.push('/planner');
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const details = await Promise.all(
        bagRecipes.map(async (recipeId) => {
          const response = await axios.post("/api/bagRecipes", { ids: [recipeId] });
          return response.data[0];
        })
      );
      setRecipeDetails(details);
    };

    fetchRecipeDetails();
  }, [bagRecipes]);

  const handleRemoveRecipe = (recipeId) => {
    removeRecipe(recipeId);
  };

  const generatePDF = (recipeDetails) => {
    const doc = new jsPDF();
    const maxLinesPerPage = 40;
    let currentLine = 0;
    let currentPage = 1;
    const columnWidth = 100; // Adjust this value based on your needs
    const today = new Date();
  
    const ingredientMap = {};
  
    // Initialize y-coordinate for recipe titles
    let recipeTitlesY = 30;
  
    // Function to add a new page and set the title
    const addNewPage = () => {
      doc.addPage();
      doc.setFont('Poppins-Medium', 'normal');
      doc.setFontSize(18);
      const originLink = window.location.origin; // Get the origin of the page
      doc.setTextColor(86, 130, 3);
  
      // Make the title clickable and set the link to the origin
      doc.textWithLink("MealGrub", 10, 10, { url: originLink });
  
      doc.setFontSize(12);
      doc.setTextColor(64, 64, 64);
  
      // Set the font family for the ingredients
      doc.setFont('RobotoSlab-Medium', 'bold');
      doc.setFontSize(10);
      currentLine = 0;
      currentPage += 1;
    };
  
    // Set the font style and size for the title
    doc.setFont('Poppins-Medium', 'normal');
    doc.setFontSize(18);
  
    // Make the title on the first page clickable
    const originLink = window.location.origin;
    doc.setTextColor(86, 130, 3);
    doc.textWithLink("MealGrub", 10, 10, { url: originLink });
  
    doc.setTextColor(17, 17, 17);
    doc.setFont('Inter-Regular', 'normal');
    doc.setFontSize(10);
  
    // Add a title text with an underline
    doc.text("Grocery List:", 10, 20);

    // Add Date label
    doc.setFont('Inter-Regular', 'normal');
    doc.text("Date:", 161, 20);
        
    doc.setFont('Inter-Bold', 'normal');
    // Add the current date
    doc.text(today.toDateString(), 171, 20);
  
    // Loop through each recipe in the SideWindow
    recipeDetails.forEach((recipe) => {
      // Add recipe name
      doc.setFont('Inter-Bold', 'normal');
      // Make the recipe name clickable
      const recipeLink = `${window.location.origin}/recipe/${recipe._id}`;
      doc.setTextColor(4, 30, 66);
      doc.textWithLink(`${recipe.title}`, 10, recipeTitlesY, { url: recipeLink });
      doc.setTextColor(64, 64, 64); // Reset the color to dark gray for subsequent text
      recipeTitlesY += 5;
  
      // Loop through ingredients for the current recipe
      recipe.ingredients.forEach((ingredient) => {
        // Check if the ingredient already exists in the map
        if (ingredientMap[ingredient.name]) {
          // If it exists, add the quantity to the existing value
          ingredientMap[ingredient.name].quantity += parseFloat(ingredient.quantity);
        } else {
          // If it doesn't exist, add a new entry to the map
          ingredientMap[ingredient.name] = {
            quantity: parseFloat(ingredient.quantity),
            measurement: ingredient.measurement,
          };
        }
      });
    });
  
    // Set the font size for the ingredients
    doc.setFontSize(10);
    doc.setTextColor(64, 64, 64); // RGB values for dark gray
  
    // Set the font family for the ingredients
    doc.setFont('RobotoSlab-Medium', 'bold');
  
    // Set the y-coordinate for the "Ingredients:" title based on recipeTitlesY
    doc.setTextColor(17, 17, 17);
    const ingredientsTitleY = recipeTitlesY + 5;
    doc.text("Ingredients:", 10, ingredientsTitleY);
  
    // Set the y-coordinate for the separator line based on ingredientsTitleY
    const separatorY = ingredientsTitleY + 3;
    doc.line(10, separatorY, 200, separatorY);
  
    doc.setTextColor(64, 64, 64);
    // Create a string with combined ingredients
    const ingredientsString = Object.entries(ingredientMap)
      .map(([name, info]) => {
        const quantity = new Fraction(info.quantity).toFraction(true);
        return `${quantity} ${info.measurement} - ${name}`;
      })
      .join('\n');
  
    // Add ingredients to the column based on available space
    const ingredientsLines = doc.splitTextToSize(ingredientsString, columnWidth);
    ingredientsLines.forEach((line) => {
      // Check if we need to add a new page
      if (currentLine >= maxLinesPerPage) {
        addNewPage();
      }
  
      // Adjust the y-coordinate on the new page
      const yCoordinate = currentPage === 1 ? separatorY + 6 + currentLine * 5 : 20 + currentLine * 5;
  
      // Add the line to the current column
      doc.text(line, 10, yCoordinate);
      currentLine += 1;
    });
  
    // Get the current date for the PDF file name
    const dateFormatted = `${today.toLocaleString('default', { month: 'long' })}_${today.getDate()}_${today.getFullYear()}`;
  
    // Save the PDF with a unique name (e.g., recipe details + timestamp)
    const pdfFileName = `MealGrub-RecipeDetails_${dateFormatted}.pdf`;
    doc.save(pdfFileName);
  };

  return (
    <WindowContainer isOpen={isOpen}>
      <CloseIcon onClick={onClose}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.3956 7.75734C16.7862 8.14786 16.7862 8.78103 16.3956 9.17155L13.4142 12.153L16.0896 14.8284C16.4802 15.2189 16.4802 15.8521 16.0896 16.2426C15.6991 16.6331 15.0659 16.6331 14.6754 16.2426L12 13.5672L9.32458 16.2426C8.93405 16.6331 8.30089 16.6331 7.91036 16.2426C7.51984 15.8521 7.51984 15.2189 7.91036 14.8284L10.5858 12.153L7.60436 9.17155C7.21383 8.78103 7.21383 8.14786 7.60436 7.75734C7.99488 7.36681 8.62805 7.36681 9.01857 7.75734L12 10.7388L14.9814 7.75734C15.372 7.36681 16.0051 7.36681 16.3956 7.75734Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4 1C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4C23 2.34315 21.6569 1 20 1H4ZM20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3Z"
          fill="currentColor"
        />
      </svg>
      </CloseIcon>
      <BagTitle>My Bag</BagTitle>
      <RecipeWrapper>
      <TitleLabel>Recipe Name</TitleLabel>
        {bagRecipes.length === 0 && (
          <EmptyBagMessage>
          <EmptyIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </EmptyIcon>
            Your bag is empty!
          </EmptyBagMessage>
        )}
        {recipeDetails.map((recipe) => (
          <RecipeItem key={recipe._id}>
            <RecipeLink href={`/recipe/${recipe._id}`} target="_blank" rel="noopener noreferrer">
              <RecipeImage src={recipe.images?.[0]} alt={recipe.title} />
              <div>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeServings>Servings: {recipe.servings}</RecipeServings>
              </div>
            </RecipeLink>
            <RemoveButton onClick={() => handleRemoveRecipe(recipe._id)}>
              <RemoveButtonIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </RemoveButtonIcon>
            </RemoveButton>
          </RecipeItem>
        ))}
      </RecipeWrapper>
      <ButtonsWrapper>
        <WindowButton onClick={() => generatePDF(recipeDetails)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z" clipRule="evenodd" />
          </svg>
          Print PDF
        </WindowButton>
        <WindowButton>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
          Recipe List
        </WindowButton>
        <WindowButton onClick={handlePlannerClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
          </svg>
          Go to Planner
        </WindowButton>
      </ButtonsWrapper>
    </WindowContainer>
  );
};


export default SideWindow;
import styled from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext, useState } from "react";
import { BagContext } from "./BagContext";
import { useEffect } from "react";
import axios from "axios";

const RecipeWrapper = styled.div`
  height: 260px;
  background-color: #fff;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: scale(0.99);
    box-shadow: 0 2px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
  }
`;

const ImageWrapper = styled.div`
  padding: 0;
  height: 200px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: filter 0.5s ease-in-out;
  filter: brightness(90%);

  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;

  &:hover {
    filter: brightness(100%);
  }
`;

const NameWrapper = styled.div`
  color: #111;
  margin-left: 8px;
  margin-top: 8px;
  font-weight: 500;
  width: 85%;
`;

const ButtonWrapper = styled.div`
  margin: 0;
  padding: 0;
  height: 32px;
  width: 10%;
  margin-top: 4px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  color: #111;

  svg {
    height: 24px;
    width: 24px;
  }

  &:hover {
    color: #777;
    fill: #FF3040;
    transform: scale(1.1);
  }
`;

const NameButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Star = styled.div`
  background-color: #111;
  margin: 10px;
  width: 50px;
  padding: 2px 4px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  gap: 2px;

  svg {
    height: 16px;
    width: 16px; 
    fill: #FFC13B;
  }
`;

const Average = styled.p`
  color: #fff;
  font-size: 12px;
  margin: 0;
`;


const RecipeBox = ({ _id, title, images, openModal }) => {
  const { bagRecipes, addRecipe, removeRecipe } = useContext(BagContext);
  const url = "/recipe/" + _id;
  const isRecipeInBag = bagRecipes?.includes(_id);
  const [averageRating, setAverageRating] = useState(0);
  const [isFetchingRating, setIsFetchingRating] = useState(true);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`/api/getRecipeRatings?recipeId=${_id}`);
      const { average } = response.data;
      setAverageRating(average);
    } catch (error) {
      console.error("Error fetching recipe rating:", error);
    } finally {
      setIsFetchingRating(false);
    }
  };

  // Fetch average rating initially
  useEffect(() => {
    fetchAverageRating();
  }, [_id]);

  // Set up an interval to fetch the latest average rating every second
  useEffect(() => {
    const intervalId = setInterval(fetchAverageRating, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [_id]);

  const handleRecipeClick = () => {
    openModal();
  };

  const handleAddToBagClick = () => {
    if (isRecipeInBag) {
      removeRecipe(_id);
    } else {
      addRecipe(_id);
    }
  };

  return (
    <RecipeWrapper>
      <ImageWrapper image={images?.[0]} onClick={handleRecipeClick}>
        {!isFetchingRating && (
          <Star>
            <Average>{averageRating.toFixed(2)}</Average>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </Star>
        )}
      </ImageWrapper>
      <NameButtonWrapper>
        <NameWrapper onClick={handleRecipeClick}>{title}</NameWrapper>
        <ButtonWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isRecipeInBag ? "#222" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={isRecipeInBag ? "#222" : "currentColor"}
            className="w-6 h-6"
            onClick={handleAddToBagClick}
          >
            <path strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </ButtonWrapper>
      </NameButtonWrapper>
    </RecipeWrapper>
  );
};

export default RecipeBox;
import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";
import { Recipe } from "@/models/Recipe";
import CategorySchema from "@/models/Category";
import styled from "styled-components";
import { BagContext } from "@/components/BagContext";
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import Footer from "@/components/Footer";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import YouTube from 'react-youtube';
import jsPDF from "jspdf";
import ScrollToTopButton from "@/components/ScrollToTop";
import Fraction from 'fraction.js';
import { format } from 'date-fns';
import StarRatings from "react-star-ratings";
import { useEffect } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useSession } from "next-auth/react";
import "@/components/fonts/Poppins-Light-normal"
import "@/components/fonts/Poppins-Medium-normal"
import "@/components/fonts/OpenSans_Condensed-Regular-normal"
import "@/components/fonts/Inter-Regular-normal"
import "@/components/fonts/Inter-Bold-normal"
import "@/components/fonts/RobotoSlab-Medium-bold"

const PageWrapper = styled.div`
    background-color: #eee;
`;

const Title = styled.h1`
    font-size: 3em;
    font-weight: bold;
    margin: 18px 0;
    font-family: 'League Spartan', sans-serif;
`;

const Description = styled.p`
    font-size: 1.2em;
    font-weight: normal;
    text-align: justify;
    margin: 12px 0;
    font-family: 'League Spartan', sans-serif;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 4px;
`;

const Message = styled.p`
    color: #ff3333;
    font-size: 12px;
`;

const CategoryWrapper = styled.div`
    color: #666;
    margin: 0;
    font-size: 12px;
    a {
        color: #666;
        text-decoration: none;
        &:hover {
            color: #111;
            transition: all .3s ease;
        }
    }
`;

const VideoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    margin-top: 20px;
    &:before {
        content: '';
        display: block;
        height: 80px; // Adjust the height as needed
        margin-top: -80px; // Make sure to adjust this to match the height
        visibility: hidden;
    }
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    p {
        font-size: 16px;
        font-weight: bold;
    }
`;

const Feedback = styled.div`
    margin-top: 100px;
    background-color: #F7F7F7;
    padding: 4px 12px 12px 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    h2 {
        font-size: 24px;
        margin-bottom: 0;
        font-family: 'League Spartan', sans-serif;
    }
    p {
        margin-top: 4px;
    }
    button {
        margin-top: 10px;
        background: #333;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        text-align: center;
        align-items: center;
        font-family: 'League Spartan', sans-serif;
        font-size: 16px;
        cursor: pointer;
    }
`;

const CommentBox = styled.div`
    display: flex;
    flex-direction: column;
    h2 {
      font-family: 'League Spartan', sans-serif;
      margin-bottom: 0;
    }
    p {
        font-size: 16px;
        margin-bottom: 0;
    }
`;

const Comment = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: 4px solid #ddd;
    span {
        font-size: 18px;
        margin-bottom: 10px;
    }
`;

const FullName = styled.h4`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 0;
  font-family: 'League Spartan', sans-serif;
`;

const PostedDate = styled.h1`
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 12px;
`;

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    p {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 0;
    }
    textarea {
        height: 180px;
        resize: none;
        border: 1px solid #777;
        border-radius: 4px;
        padding: 12px;
    }
`;

const Label = styled.h2`
    font-size: 1.8rem;
    font-weight: normal;
    margin: 0;
    font-family: 'League Spartan', sans-serif;
`;


const Info = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin: 0 0 20px 0;
    gap: 0;
    p{
        font-size: 14px;
        margin: 0;
        font-weight: bold;
        font-style: italic;
    }
    span{
        font-weight: 500;
    }

`;

const TextLabel = styled.h2`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
    text-align: center;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
`;

const ListItem = styled.li`
    display: grid;
    margin-bottom: 8px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ccc;
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;
    &:last-child {
        border-bottom: none;
    }
`;

const Name = styled.span`
    font-size: 14px;
`;

const ProcedureContainer = styled.div`
    margin-top: 20px;
`;

const ProcedureStep = styled.div`
    margin-top: 10px;
    margin: 0 10px;
    display: flex;
    gap: 10px;
`;

const Step = styled.p`
    font-weight: bold;
    flex: 1;
    font-style: italic;
    font-family: 'League Spartan', sans-serif;

`;

const Steps = styled.p`
    font-weight: normal;
    text-align: justify;
    flex: 8;
    font-family: 'League Spartan', sans-serif;
`;


const IngredientsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 10px;
    background-color: #f7f7f7;
    padding: 16px 16px 2px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NutritionalValuesContainer = styled.div`
    margin-top: 20px;
    margin-top: 20px;
    background-color: #f7f7f7;
    padding: 16px 16px 2px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ServingsControls = styled.div`
    display: flex;
    margin: 12px 0;
    justify-content: space-between;
`;

const ServingsButton = styled.button`
    display: flex; 
    background-color: #555;
    color: #fff;
    align-items: center;
    padding: 2px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;

    svg {
        width: 14px;
        height: 14px;
    }

    &:hover {
        background-color: #111;
    }
`;

const ServingsLabel = styled.p`
    font-size: 14px;
    margin: 0px 16px 0px 0px;
    color: #333;
`;

const SetContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const SetLabel = styled.p`
    font-size: 14px;
    margin: 0px;
    color: #333;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  background-color: #444;
  font-size: 1rem;
  color: #fff;
  padding: 4px 12px;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.4s;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }

  &:hover {
    background-color: #111;
  }
`;

const CopyButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ColumnWrapper = styled.div`
  display: flex;
  margin: 20px 0;
`;

const LeftColumn = styled.div`
  flex: 2;
  padding: 16px 16px 0 0 ;
  position: relative;
`;

const RightColumn = styled.div`
  flex: 1;
  padding: 16px 0px;
`;

const RecipeImageContainer = styled.div`
  position: relative;
`;

const RecipeImage = styled.div`
  height: 400px;
  width: 100%;
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    height: 100%;
    width: auto; /* To maintain the aspect ratio */
    max-width: 100%; /* Ensure the image doesn't exceed the container width */
  }
`;


const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
`;

const PreviousButton = styled(NavigationButton)`
  left: 20px;
  height: 40px;
  width: 40px;
  color: #fff;
  background-color: #333;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.1s ease, left 0.3s ease; /* Combine transitions */
  svg {
    height: 24px;
    width: 24px;
  }
  &:hover {
    background-color: #111;
    left: 18px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: 20px;
  height: 40px;
  width: 40px;
  color: #fff;
  background-color: #333;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.1s ease, right 0.1s ease; /* Combine transitions */
  svg {
    height: 24px;
    width: 24px;
  }
  &:hover {
    background-color: #111;
    right: 18px;
  }
`;

const RatingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const AverageRating = styled.p`
  font-size: 16px;
  margin: 0 0 0px 8px;
  font-family: 'League Spartan', sans-serif;
`;

const Buttons = styled.div`
  margin: 0;
  font-family: 'League Spartan', sans-serif;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    width: 80px;
    font-family: 'League Spartan', sans-serif;
    font-size: 14px;
    padding: 4px;
    border-radius: 4px;
    border: solid .8px #ccc;
    cursor: pointer;
    background-color: #F7F7F7;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    svg {
        height: 18px;
        width: 18px;
    }
}
`;

const PreviousIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
    </svg>
);
  
const NextIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
    </svg>
);

export default function RecipePage({ recipe }) {
    const { addRecipe } = useContext(BagContext);
    const categoryArray = Array.isArray(recipe.category) ? recipe.category : [recipe.category];
    const [sets, setSets] = useState(1);
    const [servings, setServings] = useState(recipe.servings);
    const originalServings = recipe.servings;
    const originalIngredients = recipe.ingredients;
    const [servingsChanged, setServingsChanged] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const formattedCreatedAt = format(new Date(recipe.createdAt), 'MMMM dd, yyyy HH:mm:ss');
    const formattedUpdatedAt = format(new Date(recipe.updatedAt), 'MMMM dd, yyyy');
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [userRating, setUserRating] = useState(averageRating);
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');



    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comment?recipeId=${recipe._id}`);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [recipe._id]);

    const handleAddComment = async () => {
        const userId = session.user._id;
        const recipeId = recipe._id;
      
        if (newCommentText.trim() !== '') {
          try {
            const response = await fetch('/api/comment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                recipeId,
                userId,
                text: newCommentText,
                approved: false,
              }),
            });
      
            if (response.ok) {
              const data = await response.json();
              setComments([...comments, data.comment]);
              setNewCommentText('');
      
              // Display a success toast with bottom-left position
              toast.success("Thank you for submitting your comment. Wait for admin's approval.", {
                position: 'bottom-left',
              });
      
            } else {
              console.error('Failed to add comment:', response.statusText);
              // You may handle the error and display an error toast here
            }
          } catch (error) {
            console.error('Error adding comment:', error);
            // You may handle the error and display an error toast here
          }
        }
    };
    
    useEffect(() => {
      // Fetch the average and total ratings when the component mounts
      axios
        .get(`/api/getRecipeRatings?recipeId=${recipe._id}`)
        .then((response) => {
          const { average, total } = response.data;
          setAverageRating(average);
          setTotalRatings(total);
          // Update userRating to the averageRating
          setUserRating(average);
        })
        .catch((error) => {
          console.error('Error fetching recipe ratings:', error);
        });
    }, [recipe._id]);
  
    const handleRatingChange = (newRating) => {
      // Check if there is a valid session
      if (!session || !session.user || !session.user._id) {
        console.log('Unauthenticated');
        return;
      }
  
      setUserRating(newRating);
  
      // Save the rating to the database
      axios
        .post(
          '/api/rateRecipes',
          { userId: session.user._id, recipeId: recipe._id, value: newRating },
          { withCredentials: true }
        )
        .then((response) => {
          // Handle success if needed
  
          // Fetch and update the average rating
          axios
            .get(`/api/getRecipeRatings?recipeId=${recipe._id}`)
            .then((response) => {
              const { average, total } = response.data;
              setAverageRating(average);
              setTotalRatings(total);
            })
            .catch((error) => {
              console.error('Error fetching recipe ratings:', error);
            });
        })
        .catch((error) => {
          // Handle error if needed
          console.error('Error rating recipe:', error);
        });
    };

    const handlePrevImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + recipe.images.length) % recipe.images.length);
    };

    const handleNextImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % recipe.images.length);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const today = new Date();
      
        // Set the font style to Poppins
        doc.setFont('Poppins-Medium', 'normal');
      
        // Set the title of the PDF (not centered, but bold)
        doc.setFontSize(18);
      
        // Create a link to the recipe page
        const recipeLink = `${window.location.origin}/recipe/${recipe._id}`;
        const originLink = window.location.origin;
        doc.setTextColor(86, 130, 3);
        doc.textWithLink("MealGrub", 10, 10, { url: originLink });
      
        // Reset font size
        doc.setFontSize(16);
      
        doc.setFont('Inter-Regular', 'normal');
        doc.setTextColor(17, 17, 17);
        doc.setFontSize(10);
        doc.text("Title:", 10, 20);
        doc.text("Servings:", 10, 25);
        doc.setFont('Inter-Bold', 'normal');
      
        // Set the title as a hyperlink
        doc.textWithLink(recipe.title, 19, 20, { url: recipeLink });
      
        doc.text(`${servings}`, 26, 25);
      
        // Add Date label
        doc.setFont('Inter-Regular', 'normal');
        doc.text("Date:", 161, 20);
      
        doc.setFont('Inter-Bold', 'normal');
        // Add the current date
        doc.text(today.toDateString(), 171, 20);
      
        doc.setFontSize(10);
        doc.setTextColor(64, 64, 64); // RGB values for dark gray
      
        // Set the font family for the ingredients
        doc.setFont('RobotoSlab-Medium', 'bold');
      
        // Add a title before the separator line
        doc.text("Ingredients:", 10, 35); // Adjusted y-coordinate here
      
        // Add a separator line
        const separatorY = 38; // Adjusted y-coordinate here
        doc.line(10, separatorY, 200, separatorY);
      
        // Initialize the vertical position for ingredients
        let yPos = 44;
      
        // Loop through and add each ingredient to the PDF
        updatedIngredients.forEach((ingredient) => {
          doc.text(`${ingredient.quantity} ${ingredient.measurement} - ${ingredient.name}`, 10, yPos);
          yPos += 5;
        });
      
        // Save the PDF with a unique name (e.g., recipe name + timestamp)
        const pdfFileName = `MealGrub-${recipe.title}_Ingredients_${new Date().getTime()}.pdf`;
        doc.save(pdfFileName);
    };      
      
    const increaseSets = () => {
        setSets(sets + 1);
        const newServings = originalServings * (sets + 1);
        setServings(newServings);
        setServingsChanged(newServings !== originalServings);
    };

    const decreaseSets = () => {
        if (sets > 1) {
            setSets(sets - 1);
            const newServings = originalServings * (sets - 1);
            setServings(newServings);
            setServingsChanged(newServings !== originalServings);
        }
    };

    const servingsRatio = servings / originalServings;
    const updatedIngredients = originalIngredients.map((ingredient, index) => {    
        return {
            name: ingredient.name,
            quantity: new Fraction(ingredient.quantity.trim()).mul(servingsRatio).toFraction(true),
            measurement: ingredient.measurement,
        };
    });     

    const nutriValueList = recipe.nutriValue.map((nutriItem, index) => (
        <ListItem key={index}>
            <span>{nutriItem.name}</span>
            <span>{nutriItem.value}</span>
        </ListItem>
    ));

    const procedureSteps = recipe.procedure.map((step, index) => (
        <ProcedureStep key={index}>
          <Step>{`Step ${index + 1} `}</Step>
          <Steps>{step}</Steps>
        </ProcedureStep>
    ));

    return (
        <PageWrapper>
            <Header />
            <Center>
                <div>
                    <ColumnWrapper>
                        <LeftColumn>
                            <CategoryWrapper>
                                {categoryArray.map((cat, index) => (
                                    <span key={cat._id}>
                                        {index > 0 && ', '}
                                        <Link href="/category/[categoryId]" as={`/category/${cat._id}`}>
                                            {cat.name}
                                        </Link>
                                    </span>
                                ))}
                            </CategoryWrapper>
                            <Title>{recipe.title}</Title>
                            <RatingsWrapper>
                                <StarRatings
                                    rating={userRating}
                                    starRatedColor="#FFC13B"
                                    changeRating={handleRatingChange}
                                    numberOfStars={5}
                                    name="userRating"
                                    starDimension="20px"
                                    starSpacing="2px"
                                />
                                <AverageRating>
                                Average {parseFloat(averageRating).toFixed(1)} / 5 out of {totalRatings} ratings
                                </AverageRating>          
                            </RatingsWrapper>
                            <Buttons>
                                <button onClick={() => addRecipe(recipe._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                    </svg>
                                    Save
                                </button>
                                <ScrollLink to="videoContainer" smooth={true}>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                                        </svg>
                                        Video
                                    </button>
                                </ScrollLink>
                                <button onClick={generatePDF}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z" clipRule="evenodd" />
                                    </svg>
                                    Print
                                </button>
                            </Buttons>
                            <Info>
                                <p>By: <span>{recipe.citation}</span></p>
                                <p>Posted: <span>{formattedCreatedAt}</span></p>
                                {recipe.createdAt !== recipe.updatedAt && (
                                    <p>Updated: <span>{formattedUpdatedAt}</span></p>
                                )}
                            </Info>
                            <Description>{recipe.description}</Description>
                            <RecipeImageContainer>
                            <RecipeImage>
                                <img src={recipe.images?.[activeImageIndex]} alt="" />
                                {recipe.images.length > 1 && (
                                <div>
                                    <PreviousButton onClick={handlePrevImage}>{PreviousIcon}</PreviousButton>
                                    <NextButton onClick={handleNextImage}>{NextIcon}</NextButton>
                                </div>
                                )}
                            </RecipeImage>
                            </RecipeImageContainer>

                            {recipe.videoLink && (
                                <VideoContainer id="videoContainer">
                                    <TextLabel>How to Cook {recipe.title}</TextLabel>
                                    <YouTube
                                        videoId={recipe.videoLink}
                                        opts={{ width: '100%', height: '400' }}
                                    />
                                </VideoContainer>
                            )}
                            <div>
                                <ProcedureContainer>
                                    <TextLabel>Procedure</TextLabel>
                                    {procedureSteps}
                                </ProcedureContainer>
                            </div>
                            <Feedback>
                                <h2>Leave A Comment</h2>
                                <p>Submit your question or comment below.</p>
                                <CommentContainer>
                                    <p>Comment*</p>
                                    <textarea
                                    value={newCommentText}
                                    onChange={e => setNewCommentText(e.target.value)}
                                    placeholder="Add your comment..."
                                    />
                                </CommentContainer>
                                <button onClick={handleAddComment}>Submit Comment</button>
                            </Feedback>
                            <CommentBox>
                                <h2>Comments</h2>
                                {comments
                                    .filter(comment => comment.approved)
                                    .map((comment) => (
                                        <Comment key={comment._id}>
                                            <FullName>{comment.user.firstName} {comment.user.lastName}</FullName>
                                            <PostedDate>Posted on {format(new Date(comment.createdAt), 'MMMM dd, yyyy')}</PostedDate>
                                            <span>{comment.text}</span>
                                        </Comment>
                                    ))}
                            </CommentBox>
                        </LeftColumn>
                        <RightColumn>
                            <IngredientsContainer>
                            <Label>Ingredients</Label>
                            <ServingsControls>
                                <ServingsLabel>Servings: {servings}</ServingsLabel>
                                <SetContainer>
                                    <ServingsButton onClick={decreaseSets}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                        </svg>
                                        </ServingsButton>
                                        <SetLabel>{sets} {sets === 1 ? 'set' : 'sets'}</SetLabel>
                                        <ServingsButton onClick={increaseSets}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                        </svg>
                                    </ServingsButton>
                                </SetContainer>
                            </ServingsControls>
                            {servingsChanged && (
                                <Message>
                                    Please note that this recipe is originally designed for {originalServings} servings.
                                    Adjust quantities and cooking times as needed for {servings} servings.
                                </Message>
                            )}
                            <List>
                                    {updatedIngredients.map((ingredient, index) => (
                                        <ListItem key={index}>
                                            <Name>{ingredient.quantity} {ingredient.measurement}</Name>
                                            <Name>{ingredient.name}</Name>
                                        </ListItem>
                                    ))}
                            </List>
                            </IngredientsContainer>
                            
                            <NutritionalValuesContainer>
                            <Label>Nutritional Values</Label>
                            <List>
                                <Name>{nutriValueList}</Name>
                            </List>
                        </NutritionalValuesContainer>
                        </RightColumn>
                    </ColumnWrapper>
                </div>
                <ScrollToTopButton />
            </Center>
            <Footer />
        </PageWrapper>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;

    if (!mongoose.models.Category) {
        mongoose.model('Category', CategorySchema);
    }

    const recipe = await Recipe.findById(id).populate("category");

    recipe.category = Array.isArray(recipe.category) ? recipe.category : [recipe.category];

    return {
        props: {
            recipe: JSON.parse(JSON.stringify(recipe)),
        },
    };
}
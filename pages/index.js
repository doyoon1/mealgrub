import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Center from '@/components/Center';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';

const Hero = styled.div`
  margin-top: 65px;
  background-image: url("/pagebackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 605px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  button {
    font-family: 'Moon Dance', cursive;
    font-size: 32px;
    border: none;
    padding: 4px 12px;
    border-radius: 32px;
    width: 210px;
    cursor: pointer;
    background: rgba(255,255,255,0.8);
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    border: 1px solid rgba(255,255,255,0.425);
    margin-top: 10px;
    transition: all .4s;
    &:hover {
      background-color: #f7f7f7;
    }
  }

  @media screen and (max-width: 768px) {
    height: 185px;
    padding: 80px 0;

    button {
      font-size: 18px;
      padding: 4px 4px;
      width: 100px;
      cursor: pointer;
      margin-top: 16px;
    }
  }
`;

const HeroLogo = styled.h1`
  user-select: none;
  font-size: 150px;
  color: #fff;
  font-weight: bold;
  padding-top: 160px;
  margin: 0;
  transition: all .4s;

  @media screen and (max-width: 768px) {
    font-size: 60px;
    padding-top: 0px;
  }
`;

const HeroLabel1 = styled.p`
  color: #fff;
  font-size: 32px;
  margin: 0;
  margin-top: -20px;
  user-select: none;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const HeroLabel2 = styled.p`
  background: rgba(255,255,255,0.85);
  padding: 0 8px;
  border-radius: 8px;
  color: #111;
  font-size: 16px;
  margin-top: 20px;
  font-weight: 600;
  user-select: none;

  @media screen and (max-width: 768px) {
    font-size: 6px;
    margin: 0 20px;
    margin-top: 4px;
    padding: 4px 4px;
  }
`;

const CtaContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 200px;
  align-items: center;
  button{
    width: 250px;
    background-color: #111;
    border: none;
    color: #FFFFFF;
    text-transform: uppercase;
    font-size: 16px;
    padding: 8px 0;
    border-radius: 12px;
    font-weight: normal;
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    height: 80px;
    gap: 4px;
    justify-content: center;

    button{
      width: 140px;
      font-size: 8px;
      padding: 6px 0;
    }
  }
`;

const Adobo = styled.div`
  display: flex;
  flex-direction: column;
  postition: relative;
  height: 250px;
  background-color: #111;
  justify-content: center;
  color: #fff;
  padding: 0 300px 0 600px;

  h1{
    font-size: 36px;
  }

  p{
    text-align: justify;
  }

  img{
    position: absolute;
    height: 400px;
    width: auto;
    left: 100px;
  }

  @media screen and (max-width: 768px) {
    height: 100px;
    padding: 10px 40px 10px 160px;
    flex-direction: column;
    text-align: center;
    justify-content: center;

    h1{
      font-size: 18px;
    }
  
    p{
      font-size: 8px;
      text-align: justify;
    }

    img{
      left: 10px;
      height: 160px;
      width: 160px;
    }
  }
`;

const WhiteSpace = styled.div`
  height: 100px;
  @media screen and (max-width: 768px) {
    height: 20px;
  }
`;

const About = styled.div`
  display: flex;
  flex-direction: column;
  postition: relative;
  height: 450px;
  background-color: #111;
  justify-content: center;
  color: #fff;
  padding: 50px 400px 50px 150px;

  h1 {
    font-size: 48px;
  }

  p{
    text-align: justify;
    max-width: 700px;
  }

  img{
    position: absolute;
    height: 500px;
    width: auto;
    right: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 10px 120px 10px 40px;
    height: 250px;
    margin-botoom: 0;

    h1{
      font-size: 18px;
    }
  
    p{
      font-size: 8px;
      text-align: justify;
      margin-bottom: 0;
    }

    img{
      height: 160px;
      width: 140px;
      right: 0;
    }
  }
`;

const ChopSuey = styled.div`
  display: flex;
  flex-direction: column;
  postition: relative;
  height: 450px;
  background-color: #111;
  justify-content: center;
  color: #fff;
  padding: 0px 150px 0px 400px;

  h1{
    font-size: 36px;
  }

  p{
    text-align: justify;
    max-width: 700px;
  }

  img{
    position: absolute;
    height: 460px;
    width: auto;
    left: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 10px 40px 10px 120px;
    height: 140px;
    margin-top: 0;


    h1{
      font-size: 18px;
    }
  
    p{
      font-size: 8px;
      text-align: justify;
      margin-bottom: 0;
    }

    img{
      height: 160px;
      width: 140px;
      left: 0;
    }
  }
`;

const Features = styled.div`
  height: 380px;
  color: #111;
  padding: 50px 120px;
  display: flex;
  flex-direction: column;
  position: relative;

  h1{
    text-align: center;
    font-size: 48px;
    margin: 0;
    margin-bottom: 80px;
  }

  h2{
    font-size: 36px;
    margin: 0 150px 0 400px;
  }

  p{
    text-align: justify;
    margin: 0 150px 0 400px;
    font-weight: 500;
  }

  img{
    position: absolute;
    height: 400px;
    width: auto;
    left: 100px;
  }

  @media screen and (max-width: 768px) {
    padding: 30px 20px;
    position: static;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 0;
    height: 180px;  

    h1{
      font-size: 18px;
      margin: 0;
    }

    h2{
      font-size: 14px;
      margin: 0;
    }
  
    p{
      font-size: 8px;
      text-align: justify;
      margin: 0;
      padding: 0 50px;
    }

    img{
      margin: 0;
      position: static;
      height: 120px;
      width: 100px;
    }
  }
`;

export default function index() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleExploreClick = () => {
    window.open('/home', '_blank');
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleRecipesClick = () => {
    window.open('/recipes', '_blank');
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Moon+Dance&display=swap"
        rel="stylesheet"
      ></link>
      <NavBar session={session} />
      <Hero>
        <Center>
          <HeroLogo>MealGrub</HeroLogo>
          <HeroLabel1>Browse Over 500+ Filipino Recipes Nationwide!</HeroLabel1>
          <HeroLabel2>
            Countless delicious Filipino cuisines to try and cook for your Family and
            loved ones.
          </HeroLabel2>
          <button onClick={handleExploreClick}>Explore!</button>
        </Center>
      </Hero>
      <Center>
        <CtaContainer>
          <button onClick={handleRecipesClick}>Check Famous Recipes</button>
          <button onClick={handleRegisterClick}>Register | Login</button>
        </CtaContainer>
      </Center>
      <Adobo>
        <h1>Chicken Adobo</h1>
        <p>Philippine Adobo is a popular Filipino dish and cooking process in Philippine cuisine of, in its base form, meat, seafood, or vegetables first browned in oil, and then marinated and simmered vinegar, salt and/or soy sauce, and garlic.</p>
        <img src="adobo.png" alt="Chicken Adobo" />
      </Adobo>
      <WhiteSpace />
      <About id="about-section">
        <h1>About MealGrub</h1>
        <p>Welcome to MealGrub, where the rich tapestry of Filipino cuisine comes alive on your plate. At MealGrub, we curate a collection of delightful Filipino recipes, offering a journey through the heart and soul of the Philippines' diverse culinary landscape. From savory adobos to sweet leche flans, discover the authentic flavors that define Filipino home cooking.</p>
        <p>At the core of MealGrub is a mission to make Filipino recipes accessible to all. Whether you're a seasoned home cook or just starting your culinary adventure, our platform simplifies the cooking process, ensuring that every dish is a success. Print your favorite recipes, follow straightforward procedures, and bring the taste of the Philippines to your kitchen. Join MealGrub, where every meal is an exploration, and the warmth of Filipino hospitality is just a recipe away.</p>
        <img src="tinola.png" alt="Tinola" />
      </About>
      <ChopSuey>
        <h1>Chop Suey</h1>
        <p>Our healthy options extend beyond traditional dishes to include international flavors. For example, our menu features Chop Suy cuisine and other forms of overseas Chinese cuisine. These dishes are prepared by quickly cooking meat and eggs with an assortment of vegetables like bean sprouts, cabbage, and celery.</p>
        <img src="chopsuey.png" alt="Tinola" />
      </ChopSuey>
      <Features>
        <h1>Features</h1>
        <img src="grocery.png" alt="grocery" />
        <h2>Built In Grocery List</h2>
        <p>The website can generate grocery lists of the ingredients that your recipe needs so you don’t have to think about the exact measurements of each ingredient.</p>
      </Features>
      <Footer/>
    </>
  );
}

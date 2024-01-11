import React from 'react'
import styled from 'styled-components'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Center from '@/components/Center';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';

const Hero = styled.div`
  background-image: url("/pagebackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 605px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  button{
    font-family: 'Moon Dance', cursive;
    font-size: 32px;
    border: none;
    padding: 4px 12px;
    border-radius: 32px;
    width: 210px;
    cursor: pointer;
    background-color: #F7F7F7;
    margin-top: 10px;
  }
`;

const HeroLogo = styled.h1`
  font-size: 150px;
  color: #fff;
  font-weight: bold;
  padding-top: 160px;
  margin: 0;
`;

const HeroLabel1 = styled.p`
  color: #fff;
  font-size: 32px;
  margin: 0;
  margin-top: -20px;
  font-family: 'Libre Baskerville', serif;
`;

const HeroLabel2 = styled.p`
  background-color: #fff;
  padding: 0 8px;
  border-radius: 8px;
  color: #111;
  font-size: 16px;
  margin-top: 20px;
  font-family: 'Libre Baskerville', serif;
  font-weight: 600;
`;

export default function index() {
  const {data:session} = useSession();
  const router = useRouter();

  const handleExploreClick = () => {
    window.open('/home', '_blank');
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Moon+Dance&display=swap" rel="stylesheet"></link>
      <NavBar session={session} />
      <Hero>
        <Center>
          <HeroLogo>MealGrub</HeroLogo>
          <HeroLabel1>Browse Over 500+ Filipino Recipes Nationwide!</HeroLabel1>
          <HeroLabel2>Countless delicious Filipino cuisines to try and cook for your Family and loved ones.</HeroLabel2>
          <button onClick={handleExploreClick}>Explore!</button>
        </Center>
      </Hero>
      <Footer />
    </>
  )
}

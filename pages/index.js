import React from 'react';
import styled from 'styled-components';
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
  font-family: 'Libre Baskerville', serif;

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
  font-family: 'Libre Baskerville', serif;
  font-weight: 600;

  @media screen and (max-width: 768px) {
    font-size: 6px;
    margin: 0 20px;
    margin-top: 4px;
    padding: 4px 4px;
  }
`;

export default function index() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleExploreClick = () => {
    window.open('/home', '_blank');
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
      <Footer />
    </>
  );
}

import React, { useContext, useState } from "react";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";
import NewRecipes from "@/components/NewRecipes";
import SearchBar from "@/components/RecipeSearch";
import SideWindow from "@/components/SideWindow";
import styled from "styled-components";
import ScrollToTopButton from "@/components/ScrollToTop";
import { BagContext } from "@/components/BagContext";
import { getSession, useSession } from "next-auth/react";
import Center from "@/components/Center";
import { useRouter } from "next/router";

const IconButtons = styled.div`
  width: 40px;
  height: 40px;
  position: fixed;
  top: ${(props) => (props.isSideWindowOpen ? "300px" : "300px")};
  right: ${(props) => (props.isSideWindowOpen ? "405px" : "55px")};
  z-index: 999;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: top 0.5s, right 0.5s; 
`;

const Icon = styled.svg`
  width: 16px;
  height: 16px;
`;

const BagLength = styled.span`
  font-size: 10px;
  position: absolute;
  height: 8px;
  width: 8px;
  top: -5px;
  right: -5px;
  background-color: #FF0126;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function HomePage({ session, featuredRecipes, newRecipes }) {
  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);
  const { bagRecipes } = useContext(BagContext);
  const router = useRouter();

  const handleSearch = (searchQuery) => {
    router.push(`/recipes?query=${searchQuery}`);
  };

  const toggleSideWindow = () => {
    setIsSideWindowOpen(!isSideWindowOpen);
  };

  const mainContentStyle = {
    marginRight: isSideWindowOpen ? "400px" : "0",
    transition: "margin-right 0.5s",
  };  

  return (
    <div>
      <div style={mainContentStyle}>
        <Header />
        <Featured recipes={featuredRecipes} session={session} />
        <Center>
          <SearchBar onSearch={handleSearch} />
          <NewRecipes recipes={newRecipes} session={session} />
        </Center>
        <ScrollToTopButton session={session} />
        <Footer session={session} />
      </div>
      <SideWindow isOpen={isSideWindowOpen} onClose={toggleSideWindow} session={session} />
      <IconButtons
        className="icon-button"
        onClick={toggleSideWindow}
        isSideWindowOpen={isSideWindowOpen}
      >
        {isSideWindowOpen ? (
          <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </Icon>
          ) : (
          <>
              {bagRecipes?.length > 0 && (
                <BagLength>
                  {bagRecipes?.length}
                </BagLength>
              )}
            <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
            </Icon>
          </>
        )}
      </IconButtons>
    </div>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();

  // Fetch the session
  const session = await getSession(context);

  // Query MongoDB to find featured recipes with "featured" field set to true
  const featuredRecipes = await Recipe.find({ featured: true });

  if (!featuredRecipes || featuredRecipes.length === 0) {
    return {
      notFound: true,
    };
  }

  const newRecipes = await Recipe.find({}, null, { sort: { _id: -1 }, limit: 6 });

  return {
    props: {
      session,
      featuredRecipes: JSON.parse(JSON.stringify(featuredRecipes)),
      newRecipes: JSON.parse(JSON.stringify(newRecipes)),
    },
  };
}
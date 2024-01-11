import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Center from './Center';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import HamburgerIcon from './icons/Hamburger';
import CloseIcon from './icons/CloseIcon';

const StyledNav = styled.div`
  background-color: #111;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const LogoWrapper = styled.div`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  img {
    height: 64px;
    width: 64px;
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  ${(props) => props.isActive && `color: #fff;`}
  &:hover {
    color: #fff;
    transition: all .4s;
  }
`;

const LinksWrapper = styled.div`
  ${props => props.mobileNavActive ? `
  display: block;
  ` : `
  display: none;
  `}
  justify-content: center;
  gap: 30px;
  align-items: center;
  gap: 8px;
  position: fixed;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 20px 20px;
  background-color: #111;
  z-index: 1000;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 40px;
  height: 30px;
  border: 0;
  cursor: pointer;
  color: white;
  position: relative;
  z-index: 3;
  display: block;

  @media screen and (min-width: 768px) {
    display: none;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    svg {
    }
  }
`;



export default function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileNavActive, setMobileNavActive] = useState(false);

  useEffect(() => {
    // Check if there is an active session and if the user clicked the "Login" link
    if (session && router.pathname === '/login') {
      // Redirect to "/home" if there is a session and the user clicked the "Login" link
      router.push('/home');
    }
  }, [session, router]);

  return (
    <div>
      <StyledNav>
        <Center>
          <Wrapper>
            <LogoWrapper>
              MealGrub
            </LogoWrapper>
            <LinksWrapper mobileNavActive={mobileNavActive}>
              <NavLink href={"/"} isActive={router.pathname === "/"}>Home</NavLink>
              <NavLink href={"/"} isActive={router.pathname === "/"}>About Us</NavLink>
              <NavLink href={"/"} isActive={router.pathname === "/"}>Request Recipes</NavLink>
              <NavLink href={"/login"} isActive={router.pathname === "/login"}>Login</NavLink>
              <NavLink href={"/register"} isActive={router.pathname === "/register"}>Register</NavLink>
            </LinksWrapper>
            <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
              {mobileNavActive ? <CloseIcon /> : <HamburgerIcon />}
            </NavButton>
          </Wrapper>
        </Center>
      </StyledNav>
    </div>
  );
}

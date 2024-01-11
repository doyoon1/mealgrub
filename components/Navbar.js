import React, { useEffect } from 'react';
import styled from 'styled-components';
import Center from './Center';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding: 20px 0;
`;

const StyledNav = styled.div`
  background-color: #111;
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
	display: flex;
	justify-content: center;
	gap: 30px;
`;

export default function NavBar() {
	const router = useRouter();
  const {data:session} = useSession();

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
            <LinksWrapper>
              <NavLink href={"/"} isActive={router.pathname === "/"}>Home</NavLink>
              <NavLink href={"/"} isActive={router.pathname === "/"}>About Us</NavLink>
              <NavLink href={"/"} isActive={router.pathname === "/"}>Request Recipes</NavLink>
              <NavLink href={"/login"} isActive={router.pathname === "/login"}>Login</NavLink>
              <NavLink href={"/register"} isActive={router.pathname === "/register"}>Register</NavLink>
            </LinksWrapper>
          </Wrapper>
        </Center>
      </StyledNav>
    </div>
  );
}
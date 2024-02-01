import React, { useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import Center from './Center';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import HamburgerIcon from './icons/Hamburger';
import CloseIcon from './icons/CloseIcon';
import { BagContext } from './BagContext';
import Swal from 'sweetalert2';

const StyledNav = styled.div`
  background-color: #111;
  z-index: 1000;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const LogoWrapper = styled.div`
  user-select: none;
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
  display: flex;
  position: relative;
  align-items: center;
  color: #aaa;
  text-decoration: none;
  cursor: pointer;

  svg {
    height: 18px;
    width: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #fff;
    transition: all 0.4s;
  }

  @media screen and (max-width: 768px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'flex')};
  }
`;

const SubMenu = styled.div`
  display: none;
  position: static;
  top: 100%;
  left: 0;
  z-index: 1001;
  width: 100%;
  @media screen and (min-width: 768px) {
    position: absolute;
    background-color: #080808;
    width: 200px;
  }
`;

const MenuItem = styled.div`
  position: relative;
`;

const SubNavLink = styled(NavLink)`
  padding: 2px 10px;
  border: 1px solid #ccc;
  margin: 10px 0;

  @media screen and (min-width: 768px) {
    padding: 10px 14px;
    border: none;
    margin: 0;
    &:hover{
      background-color: #222;
    }
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
  gap: 20px;
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
  }
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

  .icon-container {
    transition: transform 0.5s ease;
    transform: ${props => (props.mobileNavActive ? 'rotate(90deg)' : 'rotate(0deg)')};
  }

  &:hover {
    .icon-container {
      transition: transform 0.5s ease;
    }
  }
`;

const CategoriesDiv = styled.div`
  color: ${props => (props.active ? '#fff' : '#aaa')};
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    height: 18px;
    width: 18px;
    transition: transform 0.3s ease;
    transform: ${props => (props.active ? 'rotate(180deg)' : 'rotate(0deg)')};
  }

  &:hover {
    color: #fff;
    transition: all 0.4s;
  }
`;

const NameDiv = styled.div`
  color: ${props => (props.active ? '#fff' : '#aaa')};
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #fff;
    transition: all 0.4s;
  }
`;

const UserSubMenu = styled.div`
  display: none;
  position: static;
  top: 100%;
  left: 0;
  z-index: 1001;
  width: 100%;

  @media screen and (min-width: 768px) {
    position: absolute;
    background-color: #080808;
    width: 200px;
  }
`;

const ProfileLink = styled.div`
  padding: 2px 10px;
  border: 1px solid #ccc;
  margin: 10px 0;
  color: #ccc;
  cursor: pointer;

  @media screen and (min-width: 768px) {
    padding: 10px 14px;
    border: none;
    margin: 0;
    &:hover{
      color: #fff;
      background-color: #222;
      transition: all 0.4s;
    }
  }
`;

const BagLength = styled.span`
  font-size: 10px;
  position: absolute;
  height: 4px;
  width: 4px;
  top: 0;
  right: -8px;
  background-color: #FF0126;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavBar = () => {
  const router = useRouter();
  const session = useSession();
  const status = session.status;
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [categoriesActive, setCategoriesActive] = useState(false);
  const [userSubMenuActive, setUserSubMenuActive] = useState(false);
  const categoriesRef = useRef(null);
  const userSubMenuRef = useRef(null);
  const { bagRecipes } = useContext(BagContext);

  const handleNameClick = () => {
    setUserSubMenuActive((prev) => !prev);
  };

  useEffect(() => {
    if (session && router.pathname === '/login') {
      router.push('/home');
    }

    const handleClickOutside = (event) => {
      if (userSubMenuRef.current && !userSubMenuRef.current.contains(event.target)) {
        setUserSubMenuActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [session, router]);

  useEffect(() => {
    // Add event listener for clicks outside CategoriesDiv
    document.addEventListener('click', handleOutsideClick);

    // Cleanup event listener on CategoriesDiv ref change
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [categoriesActive]);

  const handleCategoriesClick = () => {
    setCategoriesActive((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
      // Clicked outside CategoriesDiv, close submenu
      setCategoriesActive(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#222',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
    });
  
    if (result.isConfirmed) {
      await signOut({ redirect: false });
      router.push("/login");
    }
  };

  return (
    <div>
      <StyledNav>
        <Center>
          <Wrapper>
            <LogoWrapper>
              MealGrub
            </LogoWrapper>
            <LinksWrapper mobileNavActive={mobileNavActive}>
              <NavLink href={"/home"}>Home</NavLink>
              <MenuItem>
                <CategoriesDiv
                  ref={categoriesRef}
                  active={categoriesActive}
                  onClick={handleCategoriesClick}
                >
                  Categories
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                  </svg>
                </CategoriesDiv>
                <SubMenu style={{ display: categoriesActive ? 'block' : 'none' }}>
                  <SubNavLink href={"/category/653ced2310e14fa280c0d0a1"}>Breakfast</SubNavLink>
                  <SubNavLink href={"/category/653ced1810e14fa280c0d09e"}>Lunch</SubNavLink>
                  <SubNavLink href={"/category/651d4f6cfccc5b3b416d1454"}>Dinner</SubNavLink>
                  <SubNavLink href={"/categories"}>All Categories</SubNavLink>
                </SubMenu>
              </MenuItem>
              <NavLink href={"/recipes"}>All Recipes</NavLink>
              <NavLink href={"/planner"}>Planner</NavLink>
              <NavLink href={"/bag"} hideOnMobile>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                </svg>
                {bagRecipes?.length > 0 && (
                  <BagLength>
                    {bagRecipes?.length}
                  </BagLength>
                )}
              </NavLink>
                {status === 'authenticated' && (
                  <>
                    <MenuItem ref={userSubMenuRef}>
                      <NameDiv
                        active={userSubMenuActive}
                        onClick={handleNameClick}
                      >
                        {session.data.user.firstName} {session.data.user.lastName}
                      </NameDiv>
                      <UserSubMenu style={{ display: userSubMenuActive ? 'block' : 'none' }}>
                        <ProfileLink onClick={handleLogout}>Logout</ProfileLink>
                      </UserSubMenu>
                    </MenuItem>
                  </>
                )}
                {status === 'unauthenticated' && (
                  <>
                    <NavLink href={"/login"}>Login</NavLink>
                    <NavLink href={"/register"}>Register</NavLink>
                  </>
                )}
            </LinksWrapper>
            <NavButton mobileNavActive={mobileNavActive} onClick={() => setMobileNavActive((prev) => !prev)}>
              <div className="icon-container">
                {mobileNavActive ? <CloseIcon /> : <HamburgerIcon />}
              </div>
            </NavButton>
          </Wrapper>
        </Center>
      </StyledNav>
    </div>
  );
}

export default NavBar;
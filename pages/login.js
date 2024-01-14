import React from 'react';
import Header from '@/components/Header';
import Center from '@/components/Center';
import Footer from '@/components/Footer';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import NavBar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const StyledComponent = styled.div`
  position: relative;
  background-color: #F0F2F5;
  padding: 60px 0;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    padding: 40px 0;
    margin-bottom: 170px;
  }
`;


const Logo = styled.span`
  text-align: center;
  font-size: 30px;
  margin: 0;
  margin-top: 35px;
  color: #568203;
  font-weight: 500;

  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

const Title = styled.p`
  text-align: center;
  font-size: 14px;
  margin: 0;
  margin-bottom: 10px;
  @media screen and (max-width: 768px) {
    font-size: 8px
  }
`;

const Signin = styled(Link)`
  text-decoration: none;
  color: #0070f3;
`;

const FormContainer = styled.form`
  display: flex;
  padding: 10px 20px 80px 20px;
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;
  margin-top: 50px;

  @media screen and (max-width: 768px) {
    padding: 10px 10px;
    padding-bottom: 30px;
    width: 250px;
  }
`;

const Inputs = styled.input`
  padding: 8px 10px;
  border: 1px solid #9E9E9E;
  width: 220px;
  margin: 10px 0 4px 0;
  font-family: 'Poppins', sans-serif;
  user-select: none;
  transition: border-color 0.3s;

  @media screen and (max-width: 768px) {
    width: 160px;
    margin: 4px 0 4px 0;
    font-size: 8px;
  }

  &:focus {
    border-color: #222 !important; 
    outline: none;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  margin: 8px 0;
  padding: 10px;
  width: 240px;
  border: 1px solid #9E9E9E;
  background-color: #fff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: box-shadow 0.3s;

  @media screen and (max-width: 768px) {
    width: 182px;
    margin: 4px 0 4px 0;
    font-size: 8px;
    height: 35px
  }

  &:hover {
    box-shadow: 0px 0px 10px 0px #009688;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const ShowPassword = styled.label`
  position: absolute;
  right: 10px;
  top: 32px;
  transform: translateY(-50%);
  cursor: pointer;
  @media screen and (max-width: 768px) {
    top: 22px;
  }
`;

const EyeIcon = styled.svg`
  height: 20px;
  width: 20px;
  fill: #9E9E9E;
  transition: fill .4s ease;

  &:hover {
    fill: #222;
  }

  @media screen and (max-width: 768px) {
    height: 16px;
    width: 16px;
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const [loginInProgress, setLoginInProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();
    setLoginInProgress(true);
  
    // Validation check: Ensure email and password are not empty
    if (!email || !password) {
      toast.error('All fields are required', { position: 'top-center' });
      setLoginInProgress(false);
      return;
    }
  
    const currentHost = window.location.origin;
  
    const result = await signIn('credentials', { email, password, callbackUrl: `${currentHost}/home`, redirect: false });
  
    if (result.error) {
      // Display an error toast
      toast.error('Email or password is incorrect', { position: 'top-center' });
      setLoginInProgress(false);
      return;
    }
  
    // Fetch the session after a successful login
    const session = await getSession();
    if (session) {
      // User is logged in, you can redirect or perform other actions
      console.log('User is logged in:', session.user);
    }
  
    setLoginInProgress(false);
  };
  

  return (
    <>
      <NavBar />
      <StyledComponent>
        <Center>
          <FormContainer onSubmit={handleFormSubmit}>
            <Logo>Sign in</Logo>
            <Title>
              Don't have an account?{' '}
              <Signin href="/register">Sign up.</Signin>
            </Title>
            <Inputs 
              type='email' 
							name="email"
              placeholder='Email' 
              value={email}
							disabled={loginInProgress}
              onChange={ev => setEmail(ev.target.value)} />
            <PasswordContainer>
              <Inputs
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={password}
                disabled={loginInProgress}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <ShowPassword htmlFor="showPassword" onClick={handleTogglePassword}>
                <EyeIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                    </svg>
                  )}
                </EyeIcon>
              </ShowPassword>
            </PasswordContainer>
            <SubmitButton type='submit' disabled={loginInProgress}>Login</SubmitButton>
          </FormContainer>
        </Center>
      </StyledComponent>
      <Footer />
    </>
  );
}
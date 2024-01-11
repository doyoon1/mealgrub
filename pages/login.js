import React from 'react';
import Header from '@/components/Header';
import Center from '@/components/Center';
import Footer from '@/components/Footer';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import NavBar from '@/components/Navbar';
import toast from 'react-hot-toast';

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    // Validation check: Ensure email and password are not empty
    if (!email || !password) {
      toast.error('All fields are required', { position: 'bottom-left' });
      setLoginInProgress(false);
      return;
    }

    const currentHost = window.location.origin;

    const result = await signIn('credentials', { email, password, callbackUrl: `${currentHost}/home`, redirect: false });

    if (result.error) {
      // Display an error toast
      toast.error('Email or password is incorrect', { position: 'bottom-left' });
    }

    setLoginInProgress(false);
  }

  

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
            <Inputs 
              type='password' 
							name="password"
              placeholder='Password'
              value={password}
							disabled={loginInProgress}
              onChange={ev => setPassword(ev.target.value)} />
            <SubmitButton type='submit' disabled={loginInProgress}>Login</SubmitButton>
          </FormContainer>
        </Center>
      </StyledComponent>
      <Footer />
    </>
  );
}
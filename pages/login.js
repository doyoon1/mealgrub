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
  background-image: url('/loginbg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 60px 0;
`;

const Logo = styled.span`
  text-align: center;
  font-size: 30px;
  margin: 0;
  margin-top: 35px;
  color: #568203;
  font-weight: 500;
`;

const Title = styled.p`
  text-align: center;
  font-size: 14px;
  margin: 0;
  margin-bottom: 10px;
`;

const Signin = styled(Link)`
  text-decoration: none;
  color: #0070f3;
`;

const FormContainer = styled.form`
  display: flex;
  padding: 10px 40px 80px 40px;
  width: 340px;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: auto;
  margin-top: 50px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Inputs = styled.input`
  padding: 2px 10px;
  border: 1px solid #9E9E9E;
  width: 218px;
  height: 30px;
  margin: 10px 0 4px 0;
  font-family: 'Poppins', sans-serif;
  user-select: none;
  transition: border-color 0.3s ease-in-out;

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
  padding: 2px;
  width: 240px;
  height: 50px;
  border: 1px solid #9E9E9E;
  background-color: #fff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0px 0px 10px 0px #009688;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const FacebookButton = styled.button`
  display: flex;
  align-items: center;
  margin: 8px 0;
  padding: 2px;
  width: 240px;
  height: 50px;
  border: 1px solid #1A76F0;
  background-color: #fff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: box-shadow 0.3s;
  gap: 8px;
  justify-content: center;
  
  &:hover {
    box-shadow: 0px 0px 10px 0px #009688;
  }
`;

const OrText = styled.div`
  font-weight: bold;
  color: #222;
`;

const SuccessMessage = styled.div`
  text-align: center;
  font-size: 12px;
  margin: 0;
  color: #008000;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 12px;
  margin: 0;
  color: #FF0000;
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
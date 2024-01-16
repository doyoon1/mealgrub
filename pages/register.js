  import React from 'react';
  import Header from '@/components/Header';
  import Center from '@/components/Center';
  import Footer from '@/components/Footer';
  import styled from 'styled-components';
  import Image from 'next/image';
  import Link from 'next/link';
  import { useState } from 'react';
  import NavBar from '@/components/Navbar';
  import toast from 'react-hot-toast';

  const StyledComponent = styled.div`
    background-color: #F0F2F5;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 60px 0;
    @media screen and (max-width: 768px) {
      padding: 80px 0;
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
      font-size: 8px;
    }
  `;

  const Signin = styled(Link)`
    text-decoration: none;
    color: #0070f3;
  `;

  const FormContainer = styled.form`
    display: flex;
    padding: 10px 40px 40px 40px;
    width: 350px;
    flex-direction: column;
    background-color: #fff;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: auto;
    margin-top: 50px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 768px) {
      padding: 10px 10px;
      padding-bottom: 30px;
      width: 250px;
      margin-top: 100px;
      margin-bottom: 20px;
    }
  `;

  const NameContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
  `;

  const Inputs = styled.input`
    padding: 2px 10px;
    border: 1px solid #9E9E9E;
    width: 238px;
    height: 30px;
    margin: 10px 0 4px 0;
    font-family: 'Poppins', sans-serif;
    user-select: none;
    transition: border-color 0.3s ease-in-out;

    @media screen and (max-width: 768px) {
      width: 190px;
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

  const NameInputs = styled.input`
    padding: 2px 10px;
    border: 1px solid #9E9E9E;
    width: 104px;
    height: 30px;
    margin: 10px 0 4px 0;
    font-family: 'Poppins', sans-serif;
    user-select: none;
    transition: border-color 0.3s ease-in-out;

    @media screen and (max-width: 768px) {
      width: 80px;
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
    padding: 2px;
    width: 260px;
    height: 50px;
    border: 1px solid #9E9E9E;
    background-color: #fff;
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    transition: box-shadow 0.3s;

    @media screen and (max-width: 768px) {
      width: 212px;
      margin: 4px 0 4px 0;
      font-size: 8px;
      height: 35px;
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

  const ConfirmPasswordContainer = styled.div`
    position: relative;
  `;

  const ShowConfirmPassword = styled.label`
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

  export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
      setShowConfirmPassword(!showConfirmPassword);
    };

    const handleToggleConfirmPassword = () => {
      setShowPassword(!showPassword);
      setShowConfirmPassword(!showConfirmPassword);
    };

    async function handleFormSubmit(ev) {
      ev.preventDefault();
      setCreatingUser(true);
    
      try {
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    
        const response = await fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({
            firstName: capitalizedFirstName,
            lastName: capitalizedLastName,
            email,
            password,
            confirmPassword,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (response.ok) {
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
    
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);

          setTimeout(() => {
            toast.success('Account has been successfully created!', { position: 'top-center' });
          }, 500);
        } else {
          const data = await response.json();
          toast.error(data.error || 'An error has occurred. Please try again later', { position: 'top-center' });
        }
      } catch (error) {
        toast.error('An error has occurred. Please try again later', { position: 'top-center' });
      } finally {
        setCreatingUser(false);
      }
    }    

    return (
      <>
        <NavBar />
        <StyledComponent>
          <Center>
            <FormContainer onSubmit={handleFormSubmit}>
              <Logo>Create account</Logo>
              <Title>
                Already have an account?{' '}
                <Signin href="/login">Sign in.</Signin>
              </Title>
              <NameContainer>
                <NameInputs 
                  type='text' 
                  placeholder='First Name' 
                  value={firstName}
                  disabled={creatingUser}
                  onChange={ev => setFirstName(ev.target.value)} />
                <NameInputs 
                  type='text' 
                  placeholder='Last Name' 
                  value={lastName}
                  disabled={creatingUser}
                  onChange={ev => setLastName(ev.target.value)} />
              </NameContainer>
              <Inputs 
                type='email' 
                placeholder='Email' 
                value={email}
                disabled={creatingUser}
                onChange={ev => setEmail(ev.target.value)} />
              <PasswordContainer>
                <Inputs
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={password}
                  disabled={creatingUser}
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
              <ConfirmPasswordContainer>
                <Inputs 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  disabled={creatingUser}
                  onChange={ev => setConfirmPassword(ev.target.value)} />
                <ShowConfirmPassword htmlFor="showConfirmPassword" onClick={handleToggleConfirmPassword}>
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
                </ShowConfirmPassword>
              </ConfirmPasswordContainer>
              <SubmitButton type='submit' disabled={creatingUser}>
                Create account
              </SubmitButton>
            </FormContainer>
          </Center>
        </StyledComponent>
        <Footer />
      </>
    );
  }
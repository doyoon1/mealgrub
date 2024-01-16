import React, { useState } from 'react';
import NavBar from '@/components/Navbar';
import styled from 'styled-components';
import Center from '@/components/Center';
import Footer from '@/components/Footer';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const StyledComponent = styled.div`
  position: relative;
  background-color: #F0F2F5;
  padding: 60px 0;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    margin-bottom: 170px;
    padding: 80px 0;
  }
`;

const FormContainer = styled.form`
  display: flex;
  padding: 10px 20px 40px 20px;
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 50px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;
  margin-top: 50px;

  @media screen and (max-width: 768px) {
    padding: 10px 10px;
    padding-bottom: 30px;
    margin-top: 50px;
    margin-bottom: 0px;
    width: 320px;
  }
`;

const Inputs = styled.input`
  padding: 8px 10px;
  border: 1px solid #9E9E9E;
  width: 280px;
  margin: 10px 0 4px 0;
  font-family: 'Poppins', sans-serif;
  user-select: none;
  transition: border-color 0.3s;

  @media screen and (max-width: 768px) {
    width: 220px;
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

const Message = styled.textarea`
  padding: 8px 10px;
  border: 1px solid #9E9E9E;
  height: 100px;
  width: 280px;
  margin: 10px 0 4px 0;
  font-family: 'Poppins', sans-serif;
  user-select: none;
  transition: border-color 0.3s;
  resize: none;

  @media screen and (max-width: 768px) {
    width: 220px;
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
  width: 300px;
  border: 1px solid #9E9E9E;
  background-color: #fff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: box-shadow 0.3s;

  @media screen and (max-width: 768px) {
    width: 242px;
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

const Title = styled.p`
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

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      await emailjs.sendForm('service_9pnvyr3', 'template_53u9azm', e.target, 'W5Tb309rp33UNHtAL');
      toast.success('Message sent successfully!', { position: 'top-center' });
      // Clear the form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending message. Please try again later.', { position: 'top-center' });
    }
  };

  return (
    <>
      <NavBar />
      <StyledComponent>
        <Center>
          <FormContainer onSubmit={sendEmail}>
            <Title>Contact Us</Title>
            <Inputs
              type="text"
              name="user_name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Inputs
              type="email"
              name="user_email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Message
              type="textarea"
              name="message"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <SubmitButton type="submit">Submit</SubmitButton>
          </FormContainer>
        </Center>
      </StyledComponent>
      <Footer />
    </>
  );
}

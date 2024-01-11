import React from 'react';
import { getSession } from 'next-auth/react';
import Header from '@/components/Header';
import Center from '@/components/Center';
import Footer from '@/components/Footer';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: 'League Spartan', sans-serif;
  margin: 50px 0;
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 150px;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const RightColumn = styled.div`
  flex: 2;
`;

const UserProfileImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto; 
  background-color: #222;
  border-radius: 50%;
  border: solid .5px #ccc;
`;

const EditPic = styled.button`
  width: 80px;
  height: auto; 
  background-color: #FFFFFF;
  border-radius: 4px;
  padding: 4px;
  border: solid .5px #ccc;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
  }

  input,
  span {
    padding: 4px;
    font-size: 14px;
    border: solid .8px #ccc;
    border-radius: 4px;
    width: 400px;
  }

  span {
    pointer-events: none; 
  }

  button {
    padding: 2px;
    border: solid .8px #ccc;
    border-radius: 4px;
    font-weight: 500;
    width: 200px;
    background-color: #f7f7f7;
    margin-top: 10px;
    cursor: pointer;
  }
`;

export default function ProfilePage({ session }) {
  return (
    <>
      <Header />
      <Center>
        <Title>My Profile</Title>
        <ProfileContainer>
          <LeftColumn>
            <UserProfileImage src="profile.png" alt="User Profile" />
            <EditPic>Edit</EditPic>
          </LeftColumn>
          <RightColumn>
          <InfoContainer>
            <label>First name</label>
            <input type='text' value={session?.user?.firstName}/>
            <label>Last name</label>
            <input type='text' value={session?.user?.lastName} />
            <label id='email'>Email</label>
            <span>{session?.user?.email}</span>
            <button>Update profile</button>
          </InfoContainer>
          </RightColumn>
        </ProfileContainer>
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

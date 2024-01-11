import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    position: relative;
    width: 600px; /* Set your desired width */
    height: 400px; /* Set your desired height */
    background-color: white;
    overflow: hidden;
    border-radius: 8px;
`;

const ModalImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NavigationButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #333;
    background: none;
    border: none;
    cursor: pointer;
`;

const PreviousButton = styled(NavigationButton)`
    left: 20px;
    height: 40px;
    width: 40px;
    color: #fff;
    background-color: #333;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.1s ease;
    transition: left 0.3s ease;
    svg {
        height: 24px;
        width: 24px;
    }
    &:hover {
        background-color: #111;
        left: 18px;
    }
`;

const NextButton = styled(NavigationButton)`
    right: 20px;
    height: 40px;
    width: 40px;
    color: #fff;
    background-color: #333;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.1s ease;
    transition: right 0.1s ease;
    svg {
        height: 24px;
        width: 24px;
    }
    &:hover {
        background-color: #111;
        right: 18px;
    }
`;

const PreviousIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
    </svg>
);
  
const NextIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
    </svg>
);

const ImageModal = ({ isOpen, onClose, images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay onClick={handleClose}>
          <ModalContent>
            {images?.[activeIndex] && <ModalImage src={images?.[activeIndex]} alt="" />}
            {images.length > 1 && (
              <>
                <PreviousButton onClick={handlePrev}>{PreviousIcon}</PreviousButton>
                <NextButton onClick={handleNext}>{NextIcon}</NextButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ImageModal;

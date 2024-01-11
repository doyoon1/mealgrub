import React, { useState, useEffect } from 'react';
import ScrollToTopIcon from './icons/ScrollToTop';
import styled from 'styled-components';

const StyledButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  width: 32px;
  height: 32px;
  background-color: #777;
  color: white;
  border: none;
  border-radius: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #111;
  }
`;

function ScrollToTopButton() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return showScrollButton ? (
    <StyledButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <ScrollToTopIcon />
    </StyledButton>
  ) : null;
}

export default ScrollToTopButton;

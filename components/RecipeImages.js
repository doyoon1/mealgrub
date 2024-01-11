import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RecipeModal from './ImageModal';

const BigImage = styled.img`
  width: 100%;
  height: 34.12vw;
  object-fit: contain;
  background-position: center;
  background-color: #111;
`;

const RecipeImages = ({ images }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (activeImageIndex + 1) % images.length;
      setActiveImageIndex(nextIndex);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeImageIndex, images]);

  const openModal = (index) => {
    setModalOpen(true);
    setActiveImageIndex(index);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <BigImage src={images[activeImageIndex]} alt="" onClick={() => openModal(activeImageIndex)} />
      <RecipeModal isOpen={modalOpen} onClose={closeModal} images={images} initialIndex={activeImageIndex} />
    </>
  );
};

export default RecipeImages;
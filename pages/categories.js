import { mongooseConnect } from '@/lib/mongoose';
import Category from '@/models/Category';
import Header from '@/components/Header';
import Center from '@/components/Center';
import styled from 'styled-components';
import Link from 'next/link';

const Title = styled.h2`
    font-size: 2.5rem;
    margin: 10px 0 20px;
    font-weight: 500;
`;

const CategoryList = styled.ul`
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px; 
`;

const CategoryItem = styled.li`
    margin: 5px 0;
`;

const CategoryLink = styled(Link)`
    text-decoration: none;
    color: #777;
    &:hover {
        color: #222;
    }
`;

export default function CategoriesPage({ categories }) {
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
        <Header />
        <Center>
            <Title>Categories</Title>
            <CategoryList>
            {categories.map((category) => (
                <CategoryItem key={category._id}>
                <CategoryLink href={`/category/${category._id}`}>
                    {category.name}
                </CategoryLink>
                </CategoryItem>
            ))}
            </CategoryList>
        </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
  
    try {
      // Fetch categories that have a non-null parent field
      const categories = await Category.find({ parent: { $exists: true, $ne: null } });
  
      return {
        props: {
          categories: JSON.parse(JSON.stringify(categories)),
        },
      };
    } catch (error) {
      console.error(error);
      // Explicitly set an empty array in case of an error
      return {
        props: {
          categories: [],
        },
      };
    }
}

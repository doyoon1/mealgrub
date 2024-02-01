import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Recipe } from '@/models/Recipe';
import Header from '@/components/Header';
import Center from '@/components/Center';
import styled from 'styled-components';
import Link from 'next/link';

const PageContainer = styled.div`
  background-color: #f7f7f7;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin: 10px 0 20px;
  font-weight: 500;
  color: #333;
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const CategoryItem = styled.li`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const CategoryLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
`;

const RecipeCount = styled.span`
  color: #777;
  font-size: 0.8rem;
`;

export default function CategoriesPage({ categories }) {
  categories.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageContainer>
      <Header />
      <Center>
        <ContentContainer>
          <Title>All Categories</Title>
          <CategoryList>
            {categories.map((category) => (
              <CategoryItem key={category._id}>
                <CategoryLink href={`/category/${category._id}`}>
                  {category.name}
                  <RecipeCount>({category.recipeCount} recipes)</RecipeCount>
                </CategoryLink>
              </CategoryItem>
            ))}
          </CategoryList>
        </ContentContainer>
      </Center>
    </PageContainer>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  try {
    const categories = await Category.find({ parent: { $exists: true, $ne: null } });

    const categoriesWithCount = await Promise.all(categories.map(async (category) => {
      const recipeCount = await Recipe.countDocuments({ category: category._id });
      return { ...category.toObject(), recipeCount };
    }));

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categoriesWithCount)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        categories: [],
      },
    };
  }
}
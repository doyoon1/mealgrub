import Category from "@/models/Category";

export async function getCategoryData() {
  try {
    const parentCategoryID = '653e5850ec031412f6316f77';
    const categories = await Category.find({ parent: parentCategoryID }).lean();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
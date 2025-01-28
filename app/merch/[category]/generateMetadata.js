import { getProducts } from "@/app/firebase/firebaseConfig";

export async function generateStaticParams() {
  const products = await getProducts();
  const categories = [...new Set(products.map((product) => product.category))];

  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }) {
  const { category } = params;

  return {
    title: `${
      category.charAt(0).toUpperCase() + category.slice(1)
    } | Tu Tienda`,
    description: `Explora nuestra colección de ${category.toLowerCase()}`,
  };
}

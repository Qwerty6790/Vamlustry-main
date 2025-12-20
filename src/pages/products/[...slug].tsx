import { GetServerSideProps } from 'next';
import { BASE_URL } from '@/utils/constants';
import ProductDetail from '@/pages/products/[supplier]/[article]';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // slug будет массивом сегментов URL после /products/
  const { slug } = params as { slug: string[] };
  
  if (slug.length < 2) {
    return { notFound: true };
  }
  
  const supplier = slug[0];
  // Если артикул имеет форму "4870/5", объединяем все оставшиеся сегменты
  const article = slug.slice(1).join('/');
  
  try {
    // Сначала пробуем запросить с полным артикулом, включая все сегменты
    const encodedArticle = encodeURIComponent(article);
    const response = await fetch(
      `${BASE_URL}/api/product/${supplier}?productArticle=${encodedArticle}`
    );
    
    if (!response.ok) {
      // Если не найдено, пробуем с первой частью артикула (до первого слеша)
      const baseArticle = article.split('/')[0];
      const alternativeResponse = await fetch(
        `${BASE_URL}/api/product/${supplier}?productArticle=${baseArticle}`
      );
      
      if (!alternativeResponse.ok) {
        return { notFound: true };
      }
      
      const product = await alternativeResponse.json();
      if (!product) {
        return { notFound: true };
      }
      
      return {
        props: {
          product,
        }
      };
    }

    const product = await response.json();

    if (!product) {
      return { notFound: true };
    }

    return {
      props: {
        product,
      }
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
};

// Экспортируем тот же компонент, что и в [supplier]/[article].tsx
export default ProductDetail; 
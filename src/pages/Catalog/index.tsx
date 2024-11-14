import { useNavigate, useParams } from "react-router";
import styles from "./index.module.scss";
import ProductCard from "../../components/components/ProductCard";
import { useEffect, useState } from "react";
import Spinner from "../../components/components/Spinner";
import GoToTop from "../../components/components/GoToTop";
import Button from "../../components/components/Button";
import { MdArrowBack } from "react-icons/md";
import { ROUTES } from "../../constants/Route";
import axios from "axios"; 
import { navData } from "../../data/navItems";

const Catalog = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]); // Local state for products
  const [isLoading, setIsLoading] = useState(true); // Local loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let fetchUrl = '';

        if (!id) {
          const newUrl = window.location.pathname + "/All";
          window.history.pushState({ path: newUrl }, "", newUrl);
          fetchUrl = 'http://localhost:3005/api/inventory/products'; // Default API endpoint for all products
        } else {
          const category = navData.find((item) => item.name === id?.toString());

          if (category && category.value.toLowerCase() !== 'all') {
            const pathUrl = ROUTES.find((item) => item.name.toLowerCase() === category.value.toLowerCase());
            fetchUrl = pathUrl ? pathUrl.url.toLowerCase() : ''; // Category-specific URL
          } else {
            fetchUrl = 'http://localhost:3005/api/inventory/products'; // Fetch all products if 'all'
          }
        }

        if (fetchUrl) {
          const response = await axios.get(fetchUrl);
          console.log("Fetched Products:", response.data); // Log the response data
          
          // Check if response data is an array
          if (Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            console.error("Products is not an array:", response.data);
            setProducts([]); // Fallback to an empty array if not
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, [id]);

  const convertedString = id
    ?.split("-")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ") || "All Products"; // Default title

  if (isLoading) return <Spinner />; // Show spinner while loading

  return (
    <div className={`${styles.container} main-container`}>
      <div className={styles.titleContainer}>
        <Button className={styles.iconContainer} onClick={() => navigate(-1)}>
          <MdArrowBack className={styles.icon} />
        </Button>
        <div className={styles.title}>{convertedString}</div>
      </div>
      <div className={styles.productList}>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              id={product.id}
              key={index}
              title={product.title}
              price={product.price}
              category={product.category}
              description={product.description}
              image={product.image}
            />
          ))
        ) : (
          <div className={styles.noProducts}>No products available in this category.</div>
        )}
      </div>
      <GoToTop />
    </div>
  );
};

export default Catalog;

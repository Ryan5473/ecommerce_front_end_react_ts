import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./index.module.scss";
import Button from "../../components/components/Button";
import {
  cartReset,
  incrementItemFromCart,
  reduceItemFromCart,
  removeItemFromCart,
} from "../../features/cart/cartSlice";
import { MdArrowBack, MdCheck, MdDelete } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import { TbTruckReturn } from "react-icons/tb";
import Spinner from "../../components/components/Spinner";

const Cart = () => {
  const { cartItems, isLoading } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  const handlePlaceOrder = async () => {
    const orderData = {
      products: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      })),
      customerEmail: "johndoe@example.com", // Replace with actual customer email input
    };

    try {
      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please try again.");
      }

      const responseData = await response.json();
      console.log("Order placed successfully:", responseData);
      dispatch(cartReset()); // Reset the cart after placing the order
      navigate("/confirmation"); // Navigate to a confirmation page
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(error.message); // Provide user feedback on error
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <section className={styles.section}>
      <div className={`${styles.container} main-container`}>
        <div className={styles.titleContainer}>
          <Button className={styles.iconContainer} onClick={() => navigate(-1)}>
            <MdArrowBack className={styles.icon} />
          </Button>
          <div className={styles.title}>Shopping Bag</div>
        </div>
        {cartItems.length ? (
          <div className={styles.content}>
            <div className={styles.cartLeft}>
              <div
                className={styles.emptyCart}
                onClick={() => dispatch(cartReset())}
              >
                Empty Cart
              </div>
              {cartItems.map((item) => (
                <div className={styles.cartCardWrapper} key={item.product.id}>
                  <Link
                    to={`/products/${item.product.id}`}
                    className={styles.cartCardContainer}
                  >
                    <img
                      src={item.product.image}
                      className={styles.cartCardImage}
                      alt={item.product.title}
                    />
                    <div className={styles.cartCardDetails}>
                      <div className={styles.cartCardLeft}>
                        <div className={styles.title}>{item.product.title}</div>
                        <div className={styles.size}>Size: 36</div>
                        <div className={styles.price}>
                          $ {item.product.price.toFixed(2)}
                        </div>
                        <div className={styles.return}>
                          <div className={styles.iconContainer}>
                            <TbTruckReturn className={styles.icon} />
                          </div>
                          <div className={styles.title}>
                            14 days return available
                          </div>
                        </div>
                        <div className={styles.delivery}>
                          <div className={styles.iconContainer}>
                            <MdCheck className={styles.icon} />
                          </div>
                          <div className={styles.title}>
                            Delivery by 2 days
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className={styles.cartCardRight}>
                    <div className={styles.cartCardRightWrapper}>
                      <Button
                        className={styles.button}
                        onClick={() => dispatch(reduceItemFromCart(item.product))}
                      >
                        -
                      </Button>
                      <div className={styles.counter}>{item.quantity}</div>
                      <Button
                        className={styles.button}
                        onClick={() => dispatch(incrementItemFromCart(item.product))}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      className={styles.cartCardDelete}
                      onClick={() => dispatch(removeItemFromCart(item.product.id))}
                    >
                      <MdDelete className={styles.icon} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cartRight}>
              <div className={styles.coupon}>
                <div className={styles.title}>Coupons</div>
                <div className={styles.couponContent}>
                  <div className={styles.iconContainer}>
                    <BiPurchaseTag className={styles.icon} />
                  </div>
                  <div className={styles.title}>Apply Coupons</div>
                  <Button className={styles.button}>Apply</Button>
                </div>
              </div>
              <div className={styles.priceDetails}>
                <div className={styles.title}>Price Details</div>
                <div className={styles.priceContent}>
                  <div className={styles.title}>Total MRP</div>
                  <div className={styles.price}>$ {totalPrice.toFixed(2)}</div>
                </div>
                <div className={styles.priceContent}>
                  <div className={styles.title}>Platform Fee</div>
                  <div className={styles.price}>FREE</div>
                </div>
                <div className={styles.priceContent}>
                  <div className={styles.title}>Shipping Fee</div>
                  <div className={styles.price}>FREE</div>
                </div>
              </div>
              <div className={styles.totalContent}>
                <div className={styles.title}>Total Amount</div>
                <div className={styles.price}>$ {totalPrice.toFixed(2)}</div>
              </div>
              <Button className={styles.button} onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.noCartItems}>No Items Here</div>
        )}
      </div>
    </section>
  );
};

export default Cart;

// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { FaUser, FaBox, FaClipboardList } from 'react-icons/fa';
import styles from './Dashboard.module.scss';

// Interface pour les produits
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

// Interface pour les ordres
interface Order {
  _id: string;
  productId: string; // ID du produit associé
  quantity: number;
  totalPrice: number;
  createdAt: string; // Date de création de la commande
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('user'); // État pour suivre l'onglet actif
  const [products, setProducts] = useState<Product[]>([]); // État pour les produits
  const [orders, setOrders] = useState<Order[]>([]); // État pour les ordres

  // Fonction pour récupérer les produits depuis l'API
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/inventory/products');
      const data = await response.json();
      setProducts(data); // Mise à jour de l'état avec les produits récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  // Fonction pour récupérer les ordres depuis l'API
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/orders'); // Remplace par l'URL correcte pour récupérer les ordres
      const data = await response.json();
      setOrders(data); // Mise à jour de l'état avec les ordres récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des ordres:', error);
    }
  };

  // Utiliser useEffect pour récupérer les produits et les ordres selon l'onglet sélectionné
  useEffect(() => {
    if (activeTab === 'product') {
      fetchProducts();
    } else if (activeTab === 'order') {
      fetchOrders();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <h4>Gestion des Utilisateurs</h4>;
      case 'product':
        return (
          <>
            <h4>Gestion des Produits</h4>
            {/* Tableau pour afficher les produits */}
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price} $</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Aucun produit disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'order':
        return (
          <>
            <h4>Gestion des Commandes</h4>
            {/* Tableau pour afficher les ordres */}
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ID Produit</th>
                    <th>Quantité</th>
                    <th>Prix Total</th>
                    <th>Date de Création</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.productId}</td>
                        <td>{order.quantity}</td>
                        <td>{order.totalPrice} $</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Aucune commande disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h3>Menu</h3>
        <ul>
          <li onClick={() => setActiveTab('user')}>
            <FaUser /> Gestion Utilisateur
          </li>
          <li onClick={() => setActiveTab('product')}>
            <FaBox /> Gestion Produit
          </li>
          <li onClick={() => setActiveTab('order')}>
            <FaClipboardList /> Gestion Commande
          </li>
        </ul>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

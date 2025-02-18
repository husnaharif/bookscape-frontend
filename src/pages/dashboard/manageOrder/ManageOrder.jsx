import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUpdateOrderStatusMutation } from "../../../redux/features/orders/ordersApi";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateOrderStatus] = useUpdateOrderStatusMutation(); 

    //Handle status update
    const handleUpdateStatus = async (id, status) => {
        try {
          const newStatus = status === "Delivered" ? "Pending" : "Delivered";
          await updateOrderStatus({ id, status: newStatus }).unwrap();
      
          // Update the orders state to reflect the status change
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === id ? { ...order, status: newStatus } : order
            )
          );
      
          alert(`Order marked as ${newStatus} successfully!`);
        } catch (error) {
          console.error("Failed to update order status:", error.message);
          alert("Failed to update order status. Please try again.");
        }
      };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }, []);

  // Function to toggle order status
  const toggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Delivered" : "Pending";

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status. Try again.");
    }
  };

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <section className="py-5 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders List</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 border">#</th>
                  <th className="py-3 px-4 border">Order ID</th>
                  <th className="py-3 px-4 border">Name</th>
                  <th className="py-3 px-4 border">Email</th>
                  <th className="py-3 px-4 border">Phone</th>
                  <th className="py-3 px-4 border">Address</th>
                  <th className="py-3 px-4 border">Products</th>
                  <th className="py-3 px-4 border">Total Price ($)</th>
                  <th className="py-3 px-4 border">Status</th>
                  <th className="py-3 px-4 border">Date</th>
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order._id} className="border-b border-gray-300 hover:bg-gray-100">
                      <td className="py-3 px-4 border">{index + 1}</td>
                      <td className="py-3 px-4 border">{order._id}</td>
                      <td className="py-3 px-4 border">{order.name}</td>
                      <td className="py-3 px-4 border">{order.email}</td>
                      <td className="py-3 px-4 border">{order.phone}</td>
                      <td className="py-3 px-4 border">
                        {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                      </td>
                      <td className="py-3 px-4 border">{order.productIds.length}</td>
                      <td className="py-3 px-4 border">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 border">
            
                        <button 
                            onClick={() => handleUpdateStatus(order._id, order.status)}
                            className="font-medium bg-yellow-500 py-1 px-4 rounded-full text-white mr-2">
                                 {order.status === 'Delivered' ? 'Delivered' : 'Pending'}
                        </button> 
                        </td>
                      
                      <td className="py-3 px-4 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-gray-500">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageOrder;



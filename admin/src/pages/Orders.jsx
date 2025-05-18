import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [graphType, setGraphType] = useState("daily");

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const ordersData = response.data.orders.reverse();
        setOrders(ordersData);
        calculateSalesData(ordersData, graphType); // Use the current graphType
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const calculateSalesData = (ordersData, type) => {
    const groupedByDate = {};

    ordersData.forEach((order) => {
      const date = new Date(order.date);
      let groupDate;

      if (type === "daily") {
        groupDate = date.toLocaleDateString();
      } else if (type === "weekly") {
        const startOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        groupDate = `Week of ${startOfWeek.toLocaleDateString()}`;
      } else if (type === "monthly") {
        groupDate = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;
      }

      if (!groupedByDate[groupDate]) {
        groupedByDate[groupDate] = { sales: 0, orderCount: 0, unitsSold: 0 };
      }
      groupedByDate[groupDate].sales += order.amount;
      groupedByDate[groupDate].orderCount += 1;
      order.items.forEach((item) => {
        groupedByDate[groupDate].unitsSold += item.quantity;
      });
    });

    const salesData = Object.keys(groupedByDate).map((date) => ({
      date,
      sales: groupedByDate[date].sales,
      orderCount: groupedByDate[date].orderCount,
      unitsSold: groupedByDate[date].unitsSold,
    }));

    setSalesData(salesData);
  };

  const handleGraphTypeChange = (type) => {
    setGraphType(type);
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully.");
        fetchAllOrders(); // Refresh the orders list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Recalculate sales data whenever the graphType changes
  useEffect(() => {
    if (orders.length > 0) {
      calculateSalesData(orders, graphType);
    }
  }, [graphType, orders]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <div className="my-5">
        <h4 className="text-xl font-bold text-brown">
          Sales & Orders Over Time
        </h4>
        <div className="flex space-x-4 mt-5">
          {["daily", "weekly", "monthly"].map((type) => (
            <button
              key={type}
              onClick={() => handleGraphTypeChange(type)}
              className={`px-4 py-2 ${
                graphType === type ? "bg-brown text-white" : "bg-gray-200"
              } rounded-md`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300} className="mt-5 bg-[var(--Pink)]">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Sales") return `${currency}${value.toFixed(2)}`;
                return value;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--LightBrown)"
              name="Sales"
            />
            <Line
              type="monotone"
              dataKey="orderCount"
              stroke="var(--Brown)"
              name="Number of Orders"
            />
            <Line
              type="monotone"
              dataKey="unitsSold"
              stroke="var(--Light)"
              name="Units Sold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Orders List */}
      <div className="p-5 bg-white shadow-xl shadow-brown">
        <h2 className="text-xl font-bold text-red">Orders List</h2>
        <div>
          {orders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}
              style={{ backgroundColor: "var(--Pink)" }}
            >
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    return (
                      <p className="py-0.5" key={index}>
                        {item.name} x {item.quantity}{" "}
                        {/* <span className="text-brown">{item.size}</span>
                        {index !== order.items.length - 1 && ","} */}
                      </p>
                    );
                  })}
                </div>
                <p className="mt-3 mb-2 font-medium text-brown">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">
                  Items: {order.items.length}
                </p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px] text-pink">
                {currency}.{order.amount.toFixed(2)}
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>

                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Orders.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Orders;

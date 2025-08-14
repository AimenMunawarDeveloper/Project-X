import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pakhtar635@gmail.com",
    pass: "vzdg ycuy wrei vdrg",
  },
  debug: false,
  logger: false,
});

// Placing orders
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Send email with download links
    try {
      const downloadableItems = items.filter(item => item.projectFiles || item.documentation);
      
      console.log('Starting email process...');
      console.log('Customer email:', address.email);
      console.log('Downloadable items:', downloadableItems);
      
      if (downloadableItems.length > 0) {
        const mailOptions = {
          from: '"Project Downloads" <pakhtar635@gmail.com>',
          to: address.email,
          subject: "Your Project Downloads Are Ready!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                <h1 style="color: #333; margin: 0;">Your Downloads Are Ready!</h1>
              </div>
              <div style="padding: 20px;">
                <p style="color: #555;">Dear ${address.firstName},</p>
                <p style="color: #555;">Thank you for your purchase! Here are your download links:</p>
                ${downloadableItems.map(item => `
                  <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
                    <h2 style="color: #333; margin: 0 0 10px;">${item.title}</h2>
                    ${item.projectFiles ? `
                      <p><strong>Project Files:</strong> <a href="${item.projectFiles}" style="color: #4caf50;">Download ZIP</a></p>
                    ` : ''}
                    ${item.documentation ? `
                      <p><strong>Documentation:</strong> <a href="${item.documentation}" style="color: #4caf50;">Download PDF</a></p>
                    ` : ''}
                  </div>
                `).join('')}
                <p style="color: #555; margin-top: 20px;">
                  Note: These links will remain active for your future reference.
                </p>
              </div>
              <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="color: #888; margin: 0;">If you have any questions, please contact our support team.</p>
              </div>
            </div>
          `
        };

        console.log('Mail options prepared:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          downloadableItemsCount: downloadableItems.length
        });

        console.log('Attempting to send email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected
        });
      } else {
        console.log('No downloadable items found in the order');
      }
    } catch (emailError) {
      console.error('Error sending download links email:', {
        error: emailError.message,
        stack: emailError.stack,
        code: emailError.code
      });
      // Don't return error to client, as order was still placed successfully
    }

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus };

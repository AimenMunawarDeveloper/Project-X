import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = (await userData.cartData) || {};

    if (cartData[itemId]) {
      delete cartData[itemId];
    }

    Object.keys(cartData).forEach((key) => {
      if (
        cartData[key] === null ||
        (typeof cartData[key] === "object" &&
          Object.keys(cartData[key]).length === 0)
      ) {
        delete cartData[key];
      }
    });

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, deleteProductFromCart };

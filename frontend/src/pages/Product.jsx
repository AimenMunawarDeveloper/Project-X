import React from "react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../Components/ProductItem";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faClock, faUser, faCheck, faEdit, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";

const Product = () => {
  const { ProductId } = useParams();
  const { products, curr, addingAnItemToTheCart, token, backendUrl } = useContext(ShopContext);
  const [isData, setIsData] = useState(null);
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format the date in a user-friendly way
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    const fetchingData = async () => {
      if (products.length > 0) {
        const foundItem = products.find((item) => item._id === ProductId);
        if (foundItem) {
          setIsData(foundItem);
          setImage(foundItem.image);
        }
        setIsLoading(false);
      }
    };
    fetchingData();
  }, [ProductId, products]);

  // Function to fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/get-product-reviews`,
        { productId: ProductId }
      );
      if (response.data.success) {
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  // Function to fetch user's review
  const fetchUserReview = async () => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/review/get-user-review`,
          { productId: ProductId },
          { headers: { token } }
        );
        if (response.data.success) {
          setUserReview(response.data.review);
          // Don't automatically show or hide the form
        }
      } catch (error) {
        console.error("Error fetching user review:", error);
      }
    }
  };

  useEffect(() => {
    if (ProductId) {
      fetchReviews();
      fetchUserReview();
    }
  }, [ProductId, token, backendUrl]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  const startEditingReview = () => {
    if (userReview) {
      setNewReview({
        rating: userReview.rating,
        reviewText: userReview.reviewText,
      });
      setIsEditingReview(true);
      setShowReviewForm(true);
    }
  };

  const handleAddReview = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId: ProductId,
          rating: newReview.rating,
          reviewText: newReview.reviewText,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        
        // Add the new review to the list
        setReviews([response.data.review, ...reviews]);
        
        // Update total and recalculate average
        const newTotal = totalReviews + 1;
        setTotalReviews(newTotal);
        
        // Recalculate average rating
        const oldSum = averageRating * totalReviews;
        const newAvg = ((oldSum + newReview.rating) / newTotal).toFixed(1);
        setAverageRating(newAvg);
        
        // Update user review and hide form
        setUserReview(response.data.review);
        setShowReviewForm(false);
        
        // Reset form
        setNewReview({
          rating: 5,
          reviewText: "",
        });
        
        return true;
      } else {
        // If the user already has a review, update the userReview state with the existing review
        if (response.data.existingReview) {
          setUserReview(response.data.existingReview);
          toast.info("You already have a review for this product. You can edit it instead.");
        } else {
          toast.error(response.data.message || "Failed to submit review");
        }
        return false;
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
      return false;
    }
  };

  const handleUpdateReview = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/update`,
        {
          reviewId: userReview._id,
          rating: newReview.rating,
          reviewText: newReview.reviewText,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review updated successfully!");
        
        // Update the review in the list
        const updatedReviews = reviews.map(review => 
          review._id === userReview._id ? response.data.review : review
        );
        setReviews(updatedReviews);
        
        // Recalculate average rating
        const ratings = updatedReviews.map(review => review.rating);
        const newAvg = ratings.length > 0 
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
          : 0;
        setAverageRating(newAvg);
        
        // Update user review and hide form
        setUserReview(response.data.review);
        setShowReviewForm(false);
        setIsEditingReview(false);
        
        return true;
      } else {
        toast.error(response.data.message || "Failed to update review");
        return false;
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
      return false;
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/delete`,
        {
          reviewId: userReview._id,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review deleted successfully!");
        
        // Remove the review from the list
        const updatedReviews = reviews.filter(review => review._id !== userReview._id);
        setReviews(updatedReviews);
        
        // Update total
        const newTotal = totalReviews - 1;
        setTotalReviews(newTotal);
        
        // Recalculate average rating
        const ratings = updatedReviews.map(review => review.rating);
        const newAvg = ratings.length > 0 
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
          : 0;
        setAverageRating(newAvg);
        
        // Clear user review
        setUserReview(null);
        setShowReviewForm(false);
        setIsEditingReview(false);
      } else {
        toast.error(response.data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (!newReview.reviewText.trim()) {
      toast.error("Please enter review text");
      return;
    }

    setIsSubmitting(true);
    
    let success;
    if (isEditingReview) {
      success = await handleUpdateReview();
    } else {
      success = await handleAddReview();
    }
    
    setIsSubmitting(false);
    
    if (success) {
      // Reset form data
      setNewReview({
        rating: 5,
        reviewText: "",
      });
    }
  };

  const handleToggleReviewForm = () => {
    if (showReviewForm) {
      setShowReviewForm(false);
      setIsEditingReview(false);
      // Reset the form data when closing
      setNewReview({
        rating: 5,
        reviewText: "",
      });
    } else {
      setShowReviewForm(true);
      setIsEditingReview(false);
    }
  };

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <FontAwesomeIcon key={i} icon={faStar} />;
          } else if (i === fullStars && hasHalfStar) {
            return <FontAwesomeIcon key={i} icon={faStarHalfAlt} />;
          } else {
            return <FontAwesomeIcon key={i} icon={faStarEmpty} className="text-gray-300" />;
          }
        })}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (!isData) {
    return <div>Product not found</div>;
  }

  const getSimilarProducts = (category) => {
    return products.filter(
      (item) => item.category === category && item._id !== isData._id
    );
  };

  const handleImageClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page smoothly
  };

  return isData ? (
    <div className="bg-white">
      <div className="block lg:flex">
        <div className="lg:w-2/5">
          <TransformWrapper>
            <TransformComponent
              wrapperStyle={{
                height: "100%",
                width: "100%",
              }}
              contentStyle={{
                height: "100%",
                width: "100%",
              }}
            >
              <img
                src={image}
                alt={isData.title}
                className=" aspect-[4/5] w-full md:aspect-[5/3]"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className=" lg:w-3/5 p-10">
          <h1
            className="text-[var(--Brown)] text-3xl font-bold pb-2 pt-5 lg:pt-0"
            data-testid="product-title"
          >
            {isData.title}
          </h1>
          <hr />
          
          <div className="flex items-center mt-2 mb-2">
            <StarRating rating={parseFloat(averageRating)} />
            <span className="ml-2 text-gray-600">({totalReviews} reviews)</span>
          </div>
          
          <p className="py-2 text-gray-600 text-xl" data-testid="product-price">
            {`${curr}.${isData.price}`}
          </p>

          <p className="py-2 text-gray-600 text-lg">
            Category: {isData.category}
          </p>
          <p className="py-2 text-gray-600 text-lg">
            SubCategory: {isData.subCategory}
          </p>

          <button
            className="py-2 mt-5 mb-5 px-4 border bg-[var(--Yellow)] rounded-3xl text-lg font-bold text-white hover:bg-yellow-700 cursor-pointer hover:scale-105 transition-all"
            onClick={() => addingAnItemToTheCart(ProductId)}
            aria-label="Add this item to your cart"
          >
            Add to Cart
          </button>
          <h3 className="text-[var(--Brown)] text-2xl font-bold pb-2 pt-5 lg:pt-0">
            Description:
          </h3>
          <p
            className="text-[var(--Brown)] text-xl"
            data-testid="product-description"
          >
            {isData.description}
          </p>

          <ul className="text-[var(--Brown)] text-lg list-disc pb-8 mx-6 my-10">
            <li>Verified Project Code & Documentation</li>
            <li>Free Technical Support for 30 Days</li>
            <li>Source Code with MIT License</li>
          </ul>
        </div>
      </div>

      <div className="p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl text-[var(--Yellow)]">Reviews ({totalReviews})</h2>
          {token && (
            userReview ? (
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-[var(--Light)] text-white rounded-md hover:bg-[var(--LightBrown)] transition-colors duration-300 flex items-center"
                  onClick={startEditingReview}
                  disabled={isDeleting}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                  Edit Your Review
                </button>
                <button 
                  className="px-4 py-2 bg-[var(--Brown)] text-white rounded-md hover:bg-[var(--LightBrown)] transition-colors duration-300 flex items-center"
                  onClick={handleDeleteReview}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="mr-2">Deleting...</span>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete Review
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button 
                className="px-4 py-2 bg-[var(--Yellow)] text-white rounded-md hover:bg-yellow-700 transition-colors duration-300"
                onClick={handleToggleReviewForm}
              >
                Write a Review
              </button>
            )
          )}
        </div>
        
        {/* Review Form */}
        {showReviewForm && (
          <form 
            onSubmit={handleReviewSubmit}
            className="bg-gray-100 p-6 rounded-lg mb-8 animate-fadeIn"
          >
            <h3 className="text-xl font-semibold text-[var(--Brown)] mb-4">
              {isEditingReview ? "Edit Your Review" : "Write Your Review"}
            </h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer mr-2">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={newReview.rating === star}
                      onChange={handleReviewChange}
                      className="sr-only"
                    />
                    <FontAwesomeIcon 
                      icon={star <= newReview.rating ? faStar : faStarEmpty}
                      className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reviewText" className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                id="reviewText"
                name="reviewText"
                value={newReview.reviewText}
                onChange={handleReviewChange}
                placeholder="Share your thoughts about this product..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Light)]"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleToggleReviewForm}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[var(--Light)] text-white rounded-md hover:bg-[var(--LightBrown)] transition-colors duration-300 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </>
                ) : isEditingReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </form>
        )}
        
        {/* User's Review (if they already submitted one) */}
        {userReview && !showReviewForm && (
          <div className="bg-blue-50 p-5 mt-5 rounded-md shadow-md border-l-4 border-blue-500 mb-8 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
                  <span className="font-semibold">{userReview.userName} <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Your Review</span></span>
                </div>
                <StarRating rating={userReview.rating} />
              </div>
              <span className="text-sm text-gray-500 flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                {formatDate(userReview.date)}
              </span>
            </div>
            <p className="mt-3 text-gray-700">{userReview.reviewText}</p>
          </div>
        )}
        
        {/* Other Reviews */}
        {reviews.length > 0 ? (
          reviews
            .filter(review => !userReview || review._id !== userReview._id)
            .map((review) => (
              <div key={review._id} className="bg-white p-5 mt-5 rounded-md shadow-md hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
                      <span className="font-semibold">{review.userName}</span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-sm text-gray-500 flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {formatDate(review.date)}
                  </span>
                </div>
                <p className="mt-3 text-gray-700">{review.reviewText}</p>
              </div>
            ))
        ) : (
          !userReview && (
            <div className="text-center p-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          )
        )}
      </div>

      <h1 className="font-bold text-3xl text-center text-[var(--Yellow)] py-10 mx-10">
        You May Also Like...
      </h1>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-10 mb-10"
        data-testid="similar-products"
      >
        {getSimilarProducts(isData.category).map((similarProduct) => (
          <div key={similarProduct._id} onClick={handleImageClick}>
            <ProductItem
              id={similarProduct._id}
              title={similarProduct.title}
              image={similarProduct.image}
              price={similarProduct.price.toString()}
            />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>No results Found</div>
  );
};

export default Product;

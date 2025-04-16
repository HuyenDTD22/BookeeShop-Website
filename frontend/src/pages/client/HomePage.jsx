import React, { useState, useEffect } from "react";
import bookService from "../../services/client/bookService";
import CategoryMenuComponent from "../../components/common/CategoryMenuComponent";
import FeaturedBookComponent from "../../components/client/FeaturedBookComponent";
import NewBookComponent from "../../components/client/NewBookComponent";
import AllBookComponent from "../../components/client/AllBookComponent";
import { Carousel } from "react-bootstrap";

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    layoutCategory: [],
    booksFeatured: [],
    booksNew: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await bookService.getHomepage();
        setHomeData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch home data");
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Sample carousel images - replace with your actual book covers or promotional images
  const carouselItems = [
    {
      id: 1,
      image: "https://via.placeholder.com/1200x400?text=Discover+New+Books",
      title: "Discover New Books",
      description:
        "Explore our latest collection of books from renowned authors",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/1200x400?text=Special+Promotions",
      title: "Special Promotions",
      description: "Get up to 30% off on selected titles this week",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1200x400?text=Best+Sellers",
      title: "Best Sellers",
      description: "Check out our most popular books this month",
    },
  ];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading homepage content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <Carousel className="mb-5">
        {carouselItems.map((item) => (
          <Carousel.Item key={item.id}>
            <img className="d-block w-100" src={item.image} alt={item.title} />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button className="btn btn-primary">Explore Now</button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="container">
        <div className="row">
          {/* Left Sidebar - Categories */}
          <div className="col-lg-3">
            <CategoryMenuComponent categories={homeData.layoutCategory} />

            {/* Additional sidebar elements */}
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Newsletter</h5>
              </div>
              <div className="card-body">
                <p>
                  Subscribe to get updates on new arrivals and special
                  promotions!
                </p>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email"
                  />
                  <button className="btn btn-primary" type="button">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Featured Books Section */}
            <FeaturedBookComponent books={homeData.booksFeatured} />

            {/* New Books Section */}
            <NewBookComponent books={homeData.booksNew} />

            {/* Promotional Banner */}
            <div className="promo-banner mb-5">
              <div className="card bg-light">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h3>Join Our Book Club</h3>
                      <p>
                        Get exclusive discounts, early access to new releases,
                        and monthly book recommendations!
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <button className="btn btn-lg btn-success">
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Books Section with Pagination */}
            <AllBookComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

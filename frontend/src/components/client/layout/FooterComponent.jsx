import React from "react";
import { Container } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <div className="row">
          <div className="col-md-4">
            <h5>BookeeShop</h5>
            <p>Chuyên cung cấp sách chất lượng cao, đa dạng thể loại.</p>
          </div>
          <div className="col-md-4">
            <h5>Liên hệ</h5>
            <p>Email: support@bookeeshop.com</p>
            <p>Hotline: 0123 456 789</p>
          </div>
          <div className="col-md-4">
            <h5>Theo dõi chúng tôi</h5>
            <div>
              <a href="#" className="text-white me-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white me-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="bg-light" />
        <p className="text-center mb-0">
          © 2025 BookeeShop. All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
};

export default FooterComponent;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductDetailComponent from "../../../components/admin/product/ProductDetailComponent";
import { getBookDetail } from "../../../services/admin/bookService";

const ADMIN = process.env.REACT_APP_ADMIN;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const data = await getBookDetail(id);
        setBook(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id]);

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/admin/book">
          <Button variant="primary">Quay lại</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <ProductDetailComponent book={book} />
      <div className="d-flex justify-content-center mt-4">
        <Link to={`/${ADMIN}/book`}>
          <Button variant="danger">Quay lại</Button>
        </Link>
      </div>
    </Container>
  );
};

export default ProductDetailPage;

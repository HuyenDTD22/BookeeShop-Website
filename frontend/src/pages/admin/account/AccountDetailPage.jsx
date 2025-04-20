import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AccountDetailComponent from "../../../components/admin/account/AccountDetailComponent";
import { getAccountDetail } from "../../../services/admin/accountService";

const ADMIN = process.env.REACT_APP_ADMIN;

const AccountDetailPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        setLoading(true);
        const data = await getAccountDetail(id);
        setAccount(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchAccountDetail();
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
        <Link to="/admin/account">
          <Button variant="primary">Quay lại</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <AccountDetailComponent account={account} />
    </Container>
  );
};

export default AccountDetailPage;

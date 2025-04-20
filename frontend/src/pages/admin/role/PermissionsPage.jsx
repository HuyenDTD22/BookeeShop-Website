import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PermissionsTableComponent from "../../../components/admin/role/PermissionsTableComponent";
import { getRoles } from "../../../services/admin/roleService";

const PermissionsPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await getRoles();
        if (!data.roles || data.roles.length === 0) {
          throw new Error("Không tìm thấy vai trò nào");
        }
        setRoles(data.roles);
        setLoading(false);
      } catch (error) {
        if (error.response?.data?.code === 400) {
          navigate("/admin/auth/login");
        } else {
          setError(error.message || "Không thể tải danh sách vai trò");
          setLoading(false);
        }
      }
    };
    fetchRoles();
  }, [navigate]);

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
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <PermissionsTableComponent roles={roles} />
    </Container>
  );
};

export default PermissionsPage;

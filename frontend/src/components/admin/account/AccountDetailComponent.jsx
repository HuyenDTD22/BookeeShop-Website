import React, { useState, useEffect } from "react";
import { Row, Col, Image, Badge, Card, Button } from "react-bootstrap";
import { FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getRoles } from "../../../services/admin/roleService";

const ADMIN = process.env.REACT_APP_ADMIN;

const AccountDetailComponent = ({ account }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data.roles || []);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const findRoleTitle = (roleId) => {
    const role = roles.find((r) => r._id === roleId);
    return role ? role.title : "N/A";
  };

  const formatBirthDate = (birth) => {
    if (!birth) return "N/A";
    const date = new Date(birth);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <>
      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <FiInfo className="me-2" size={24} />
            <h2 className="m-0 fs-4">Chi tiết tài khoản</h2>
          </div>
        </Card.Header>
      </Card>

      <Row className="mb-5">
        <Col md={5} className="mb-4 d-flex justify-content-center">
          <Image
            src={account.avatar || "https://via.placeholder.com/150"}
            alt={account.fullName || "Avatar"}
            fluid
            className="border shadow-sm"
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Col>

        <Col md={7}>
          <h1 className="text-primary mb-3">
            {account.fullName || "Không có tên"}
          </h1>

          <p className="text-muted mb-2">
            <strong>Phân quyền:</strong>{" "}
            <span className="fw-semibold">
              {findRoleTitle(account.role_id)}
            </span>
          </p>

          <p className="text-muted mb-2">
            <strong>Email:</strong>{" "}
            <span className="fw-semibold">{account.email || "N/A"}</span>
          </p>

          <p className="text-muted mb-2">
            <strong>Số điện thoại:</strong>{" "}
            <span className="fw-semibold">{account.phone || "N/A"}</span>
          </p>

          <p className="text-muted mb-2">
            <strong>Ngày sinh:</strong>{" "}
            <span className="fw-semibold">
              {formatBirthDate(account.birth)}
            </span>
          </p>

          <p className="text-muted mb-2">
            <strong>Giới tính:</strong>{" "}
            <span className="fw-semibold">{account.gender || "N/A"}</span>
          </p>

          <p className="text-muted mb-2">
            <strong>Địa chỉ:</strong>{" "}
            <span className="fw-semibold">{account.address || "N/A"}</span>
          </p>

          <p className="mb-4">
            <strong>Trạng thái:</strong>{" "}
            <Badge bg={account.status === "active" ? "success" : "danger"}>
              {account.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
            </Badge>
          </p>
          <div className="mt-3">
            <Link to={`/${ADMIN}/account`}>
              <Button variant="danger">Quay lại</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AccountDetailComponent;

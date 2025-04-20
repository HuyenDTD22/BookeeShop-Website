import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Button,
  Pagination,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import FilterBarComponent from "../../../components/admin/FilterBarComponent";
import AccountTableComponent from "../../../components/admin/account/AccountTableComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";
import {
  getAccounts,
  changeStatus,
  deleteAccount,
  changeMulti,
} from "../../../services/admin/accountService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const { hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();
  const limitItems = 4;

  const fetchAccounts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAccounts({ ...params, page: currentPage });
      if (response.code === 200) {
        setAccounts(response.accounts);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi tải danh sách sách!");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [currentPage]);

  const handleFilter = (filters) => {
    setCurrentPage(1);
    fetchAccounts(filters);
  };

  const handleSearch = (keyword) => {
    setCurrentPage(1);
    fetchAccounts({ keyword });
  };

  const handleAddNew = () => {
    navigate(`/${ADMIN}/account/create`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await changeStatus(id, newStatus);
      if (response.code === 200) {
        setToastMessage("Cập nhật trạng thái thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchAccounts();
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật trạng thái");
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi cập nhật trạng thái!"
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteAccount(id);
      if (response.code === 200) {
        setToastMessage("Xóa thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchAccounts();
      } else {
        throw new Error(response.message || "Lỗi khi xóa sản phẩm");
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi xóa sản phẩm!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleSelectAccounts = (newSelectedAccounts) => {
    setSelectedAccounts(newSelectedAccounts);
  };

  const handleChangeMulti = async (key, value) => {
    if (!selectedAccounts || selectedAccounts.length === 0) {
      setToastMessage(
        "Vui lòng chọn ít nhất một sản phẩm để thực hiện hành động!"
      );
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    // Hiển thị modal xác nhận
    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${
          key === "delete"
            ? "xóa"
            : value === "active"
            ? "kích hoạt"
            : "dừng hoạt động"
        } ${selectedAccounts.length} tài khoản đã chọn không?`
      )
    ) {
      try {
        setMultiLoading(true);
        const response = await changeMulti(selectedAccounts, key, value);
        if (response.code === 200) {
          setToastMessage(response.message || "Thay đổi thành công!");
          setToastVariant("success");
          setShowToast(true);
          setSelectedAccounts([]);
          fetchAccounts();
        } else {
          throw new Error(
            response.message || "Lỗi khi thay đổi nhiều tài khoản"
          );
        }
      } catch (error) {
        setToastMessage(
          error.message || "Đã xảy ra lỗi khi thay đổi nhiều tài khoản!"
        );
        setToastVariant("danger");
        setShowToast(true);
      } finally {
        setMultiLoading(false);
      }
    }
  };

  return (
    <Container fluid className="accounts-page">
      <h2 className="mb-4">Danh sách tài khoản</h2>

      <FilterBarComponent
        onFilter={handleFilter}
        onSearch={handleSearch}
        onAddNew={hasPermission("create_accounts") ? handleAddNew : null}
      />

      {selectedAccounts.length > 0 && (
        <div className="mb-3">
          {hasPermission("delete_accounts") && (
            <Button
              variant="danger"
              onClick={() => handleChangeMulti("delete", true)}
              className="me-2"
              disabled={multiLoading}
            >
              {multiLoading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              Xóa các mục đã chọn
            </Button>
          )}
          {hasPermission("update_accounts") && (
            <>
              <Button
                variant="warning"
                onClick={() => handleChangeMulti("status", "inactive")}
                className="me-2"
                disabled={multiLoading}
              >
                {multiLoading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : null}
                Dừng hoạt động
              </Button>
              <Button
                variant="success"
                onClick={() => handleChangeMulti("status", "active")}
                disabled={multiLoading}
              >
                {multiLoading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : null}
                Kích hoạt
              </Button>
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <AccountTableComponent
          accounts={accounts}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSelect={handleSelectAccounts}
          selectedAccounts={selectedAccounts}
          currentPage={currentPage}
          limitItems={limitItems}
        />
      )}

      {totalPages > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          loading={loading}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </Container>
  );
};

export default AccountPage;

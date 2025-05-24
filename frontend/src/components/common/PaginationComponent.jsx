// import React from "react";
// import { Pagination } from "react-bootstrap";

// const PaginationComponent = ({
//   currentPage,
//   totalPages,
//   totalItems,
//   loading,
//   onPageChange,
// }) => {
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       onPageChange(page);
//     }
//   };

//   const getPaginationItems = () => {
//     const items = [];
//     const maxPagesToShow = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//     if (endPage - startPage + 1 < maxPagesToShow) {
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }

//     if (startPage > 1) {
//       items.push(
//         <Pagination.Ellipsis key="start-ellipsis" disabled={loading} />
//       );
//     }

//     for (let page = startPage; page <= endPage; page++) {
//       items.push(
//         <Pagination.Item
//           key={page}
//           active={page === currentPage}
//           onClick={() => handlePageChange(page)}
//           disabled={loading}
//         >
//           {page}
//         </Pagination.Item>
//       );
//     }

//     if (endPage < totalPages) {
//       items.push(<Pagination.Ellipsis key="end-ellipsis" disabled={loading} />);
//     }

//     return items;
//   };

//   return (
//     <div className="d-flex justify-content-between align-items-center mt-4">
//       {totalPages > 1 && (
//         <Pagination>
//           <Pagination.First
//             onClick={() => handlePageChange(1)}
//             disabled={loading}
//           />
//           <Pagination.Prev
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1 || loading}
//           />
//           {getPaginationItems()}
//           <Pagination.Next
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages || loading}
//           />
//           <Pagination.Last
//             onClick={() => handlePageChange(totalPages)}
//             disabled={loading}
//           />
//         </Pagination>
//       )}
//     </div>
//   );
// };

// export default PaginationComponent;

import React from "react";
import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";

const PaginationComponent = ({
  currentPage,
  totalPages,
  totalItems,
  loading,
  onPageChange,
  className,
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Ellipsis key="start-ellipsis" disabled={loading} />
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
          disabled={loading}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled={loading} />);
    }

    return items;
  };

  return (
    <div className={`d-flex align-items-center mt-4 ${className || ""}`}>
      {totalPages > 1 && (
        <Pagination>
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={loading}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          />
          {getPaginationItems()}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={loading}
          />
        </Pagination>
      )}
    </div>
  );
};

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default PaginationComponent;

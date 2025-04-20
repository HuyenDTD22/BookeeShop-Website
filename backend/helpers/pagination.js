module.exports = (objectPagination, query, countRecords) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems; // Tính vị trí bắt đầu lấy

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems); // Tính số lượng trang
  objectPagination.totalPage = totalPage;

  return objectPagination;
};

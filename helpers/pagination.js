module.exports = (objectPagination, query, countProducts) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems; // Tính vị trí bắt đầu lấy

    const totalPage = Math.ceil(countProducts / objectPagination.limitItems); // Tính số lượng trang
    objectPagination.totalPage = totalPage;

    return objectPagination;
}
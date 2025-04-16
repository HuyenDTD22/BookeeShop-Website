module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: "",
    }
    
    if (query.keyword) {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i"); // "i" là không phân biệt chữ hoa, chữ thường
        
        objectSearch.regex = regex; 
    }

    return objectSearch;
}
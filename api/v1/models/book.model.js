const mongoose = require("mongoose");
// const slug = require("mongoose-slug-updater");

// mongoose.plugin(slug);

const bookSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    // slug: {
    //     type: String,
    //     slug: "title",
    //     unique: true 
    // },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true, 
});

const Book = mongoose.model("Book", bookSchema, "book");

module.exports = Book;
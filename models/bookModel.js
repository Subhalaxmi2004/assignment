import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    bookName: {
      type: String,
      required: [true, "Book name is required"],
      trim: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    yearOfPublication: {
      type: Number,
      required: [true, "Year of publication is required"],
      min: [1000, "Invalid year of publication"],  
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    numberOfPages: {
      type: Number,
      required: [true, "Number of pages is required"],
    },
    condition: {
      type: String,
      enum: ["new", "used"],
      required: [true, "Condition of the book is required"],
    },
    description: {
      type: String,
      trim: true, 
    },
    category: {
      type: String,
      enum: ["fiction", "non-fiction", "science", "history", "biography", "technology", "education", "others"],
      required: [true, "Category is required"],
    },
    coverImage: {
      url: {
        type: String,
        trim: true
      },
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);

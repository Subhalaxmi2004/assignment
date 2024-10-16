import { Book } from "../models/bookModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

export const createBook = asyncHandler(async (req, res) => {
  const { 
    bookName, 
    authorName, 
    yearOfPublication, 
    price, 
    discount, 
    numberOfPages, 
    condition, 
    description, 
    category, 
    coverImage 
  } = req.body;
  const existingBook = await Book.findOne({ bookName, authorName });
  if (existingBook) {
    throw new apiError(400, "A book with this name and author already exists.");
  }

  try {
    const book = new Book({
      bookName,
      authorName,
      yearOfPublication,
      price,
      discount: discount || 0,
      numberOfPages,
      condition,
      description,
      category,
      coverImage,
    });
    await book.save();

    res.status(201).json(new apiResponse(201, book, "Book created successfully."));
  } catch (error) {
  
    if (error.name === 'ValidationError') {
      
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new apiError(400, validationErrors.join(" "));
    } else {
      throw new apiError(500, "Internal server error.");
    }
  }
});


// Update an existing book
export const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trimmedId = id.trim();

  const updates = req.body;

  const updatedBook = await Book.findByIdAndUpdate(trimmedId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    throw new apiError(404, "Book not found.");
  }

  res.status(200).json(new apiResponse(200, updatedBook, "Book updated successfully."));
});

// Delete a book by ID
export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trimmedId = id.trim();

  const deletedBook = await Book.findByIdAndDelete(trimmedId);

  if (!deletedBook) {
    throw new apiError(404, "Book not found.");
  }

  res.status(200).json(new apiResponse(200, null, "Book deleted successfully."));
});

// Get all books


export const getAllBook = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    authorName,
    yearOfPublication,
    priceMin,
    priceMax,
    condition,
    sortBy = "bookName",
    sortOrder = "asc"
  } = req.query;

  // Pagination logic
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Filtering logic
  const filter = {};
  if (authorName) {
    filter.authorName = { $regex: new RegExp(authorName, "i") }; // Case-insensitive search
  }
  if (yearOfPublication) {
    filter.yearOfPublication = yearOfPublication;
  }
  if (condition) {
    filter.condition = condition;
  }
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = parseFloat(priceMin);
    if (priceMax) filter.price.$lte = parseFloat(priceMax);
  }

  // Sorting logic
  const sortCriteria = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  // Fetching books with filtering, pagination, and sorting
  const books = await Book.find(filter)
    .sort(sortCriteria)
    .skip(skip)
    .limit(pageSize);

  const totalBooks = await Book.countDocuments(filter); // For total count

  res.status(200).json(
    new apiResponse(200, { books, totalBooks, page: pageNumber, limit: pageSize }, "Books retrieved successfully.")
  );
});

//Get book by Id
export const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trimmedId = id.trim();

  const book = await Book.findById(trimmedId);

  if (!book) {
    throw new apiError(404, "Book not found.");
  }

  res.status(200).json(new apiResponse(200, book, "Book retrieved successfully."));
});

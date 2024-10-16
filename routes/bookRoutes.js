import { Router } from "express";
import {
  createBook,
  updateBook,
  deleteBook,
  getAllBook,
  getBookById,
} from "../controllers/bookControllers.js";

const router = Router();

// create book
router.route("/create").post(createBook);

// show all book
router.route("/getAll").get(getAllBook);

// show single book
router.route("/get/:id").get(getBookById);


// update book
router.route("/update/:id").put(updateBook);

// delete book
router.route("/delete/:id").delete(deleteBook);


export default router;

import express from "express";
import authenticateToken from "../middleware/auth.ts";
import Category from "../models/Category.ts";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Check for duplicates
    const existing = await Category.findOne({ category });
    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ ...req.body });
    await newCategory.save();

    res.json({ message: "Category Created" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories: " + error });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, parentCategory } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category name cannot be empty" });
    }

    // 2. Check if another category already has the new name
    const existingCategory = await Category.findOne({ category });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res
        .status(409)
        .json({ error: "Another category with this name already exists" });
    }

    const existingParentCategory = await Category.findOne({
      category: parentCategory,
    });
    if (!existingParentCategory) {
      return res.status(500).json({ error: "Parent category does not exist" });
    }

    // 3. Find and update the category
    const updatedCategory = await Category.findByIdAndUpdate(id, {
      category,
      parentCategory: parentCategory || null,
    });

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;

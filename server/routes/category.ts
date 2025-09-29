import express from "express";
import authenticateToken from "../middleware/auth.ts";
import Category from "../models/Category.ts";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({ error: "Category is required" });
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

// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.body.name || !req.body.logo) {
//       return res.status(400).json({ error: "Name and Logo are required" });
//     }

//     const brandToEdit = await Brand.findById(id);
//     if (!brandToEdit) {
//       return res.status(404).json({ error: "Brand not found" });
//     }

//     const update = {
//       $set: {
//         ...req.body,
//       },
//     };

//     await Brand.findByIdAndUpdate(id, update, { new: true });

//     res.json({ message: "Brand Updated" });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });

router.get("/", authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories: " + error });
  }
});

// router.get("/brand/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }
//     const brandDetails = await Brand.findById(id);
//     if (!brandDetails) {
//       return res.status(404).json({ error: "No brand was found" });
//     }
//     res.status(200).json(brandDetails);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch Brand: " + error });
//   }
// });

// router.delete("/delete/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }
//     const brandToDelete = await Brand.findById(id);

//     if (!brandToDelete) {
//       return res.status(404).json({ error: "Brand not found" });
//     }

//     await s3.send(
//       new DeleteObjectCommand({
//         Bucket: bucket,
//         Key: brandToDelete.logo.replace(prefix, ""),
//       })
//     );

//     await Brand.findByIdAndDelete(id);

//     res.status(200).json({
//       message: "Brand deleted successfully",
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "An unexpected error occurred" });
//     }
//   }
// });

export default router;

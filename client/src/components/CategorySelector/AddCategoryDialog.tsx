import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { Category } from "../../models";

// The shape of the data this component sends back on submission
export interface NewCategoryData {
  category: string;
  parentCategory?: string; // This expects a string, which we will handle in onSubmit
}

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newCategory: NewCategoryData) => void;
  initialValue: string;
  parentCategories: Category[];
}

export const AddCategoryDialog = ({
  open,
  onClose,
  onSubmit,
  initialValue,
  parentCategories,
}: AddCategoryDialogProps) => {
  const [category, setCategory] = useState(initialValue);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  useEffect(() => {
    setCategory(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    onSubmit({
      category,
      parentCategory: parentCategory ? parentCategory.category : undefined,
    });
    setParentCategory(null);
  };

  const handleClose = () => {
    setParentCategory(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add new category</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          label="Category Name"
          type="text"
          variant="standard"
          fullWidth
        />
        <Autocomplete
          id="parentCategory"
          value={parentCategory}
          onChange={(_event, newValue: Category | null) => {
            setParentCategory(newValue);
          }}
          options={parentCategories}
          getOptionLabel={(option) => option.category}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Parent Category (optional)"
              variant="standard"
            />
          )}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

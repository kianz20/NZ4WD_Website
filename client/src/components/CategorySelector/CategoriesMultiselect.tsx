import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect, useState, useCallback } from "react";
import { Checkbox, ListItemText } from "@mui/material";
import * as api from "../../api/categoryController";
import { useRequireAuth, useToast } from "../../hooks";
import { AddCategoryDialog, type NewCategoryData } from "./AddCategoryDialog";
import type { Category } from "../../models";

const filter = createFilterOptions<Category>();

interface CategoriesMultiselectProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  value: Category[];
  onChange: (newValue: Category[]) => void;
}

// Sorting function remains the same
const sortCategories = (categories: Category[]) => {
  const parents = categories.filter((c) => !c.parentCategory);
  const children = categories.filter((c) => c.parentCategory);
  const result: Category[] = [];
  parents.sort((a, b) => a.category.localeCompare(b.category));
  children.sort((a, b) => a.category.localeCompare(b.category));
  parents.forEach((parent) => {
    result.push(parent);
    children
      .filter((child) => child.parentCategory === parent.category)
      .forEach((child) => result.push(child));
  });
  children
    .filter(
      (child) => !parents.find((p) => p.category === child.parentCategory)
    )
    .forEach((child) => result.push(child));
  return result;
};

export default function CategoriesMultiselect({
  setLoading,
  value,
  onChange,
}: CategoriesMultiselectProps) {
  const [options, setOptions] = useState<Category[]>([]);
  const [sortedOptions, setSortedOptions] = useState<Category[]>([]);

  // State specifically for controlling the dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialValue, setDialogInitialValue] = useState("");

  const { userToken } = useRequireAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!userToken) return;
    setLoading(true);
    api
      .getCategories(userToken)
      .then(setOptions)
      .catch(() => showToast("Failed to load categories", "error"))
      .finally(() => setLoading(false));
  }, [userToken, setLoading, showToast]);

  useEffect(() => {
    setSortedOptions(sortCategories(options));
  }, [options]);

  const handleCreateCategory = useCallback(
    (newCategoryData: NewCategoryData) => {
      if (!userToken) return;
      setLoading(true);
      // Assume the API returns the created category object
      api
        .createCategory(newCategoryData, userToken)
        .then(() => {
          showToast("Category created successfully", "success");
          // Update state without refetching the whole list
          setOptions((prev) => [...prev, newCategoryData]);
          onChange([...value, newCategoryData]);
          setDialogOpen(false);
        })
        .catch(() => showToast("Failed to create category", "error"))
        .finally(() => setLoading(false));
    },
    [userToken, setLoading, showToast, onChange, value]
  );

  return (
    <>
      <Autocomplete
        multiple
        value={value}
        disableCloseOnSelect
        onChange={(_, newValue) => {
          const lastSelectedItem = newValue[newValue.length - 1];
          if (lastSelectedItem && lastSelectedItem.inputValue) {
            // User clicked the "Add..." option, open the dialog
            setDialogInitialValue(lastSelectedItem.inputValue);
            setDialogOpen(true);
          } else {
            onChange(newValue as Category[]);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              category: `Add "${params.inputValue}"`,
            });
          }
          return filtered;
        }}
        id="categories-multiselect-dialog"
        options={sortedOptions}
        getOptionLabel={(option) => option.inputValue || option.category}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        isOptionEqualToValue={(option, value) =>
          option.category === value.category
        }
        renderOption={(props, option, { selected }) => {
          const indent = option.parentCategory ? 20 : 0;
          return (
            <li {...props} style={{ paddingLeft: indent }}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              <ListItemText primary={option.category} />
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label="Categories" />}
      />

      <AddCategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateCategory}
        initialValue={dialogInitialValue}
        parentCategories={options.filter((category) => {
          return !category.parentCategory;
        })}
      />
    </>
  );
}

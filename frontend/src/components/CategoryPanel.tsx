import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Category } from "../features/categories/categoriesSlice";

interface Props {
  categories: Category[];
  todoCountByCategory: Record<string, number>;
  categoryNameInput: string;
  onCategoryNameChange: (value: string) => void;
  onCreateCategory: () => void;
  onDeleteCategory: (id: string) => void;
  formatDate: (value: string) => string;
}

export function CategoryPanel({
  categories,
  todoCountByCategory,
  categoryNameInput,
  onCategoryNameChange,
  onCreateCategory,
  onDeleteCategory,
  formatDate,
}: Props) {
  return (
    <Card>
      <CardHeader title="Categories" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="New category"
              value={categoryNameInput}
              onChange={e => onCategoryNameChange(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={onCreateCategory}>
              Add
            </Button>
          </Stack>

          <Divider />

          {categories.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No categories yet.
            </Typography>
          )}

          {categories.map(cat => (
            <Stack
              key={cat.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack>
                <Typography fontWeight={700}>{cat.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Created {formatDate(cat.createdAt)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={`${todoCountByCategory[cat.id] ?? 0} items`} size="small" />
                <Button color="error" size="small" onClick={() => onDeleteCategory(cat.id)}>
                  Delete
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

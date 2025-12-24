import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Category } from "../features/categories/categoriesSlice";
import type { Todo } from "../features/todos/todosSlice";

interface Props {
  categories: Category[];
  todosByCategory: Record<string, Todo[]>;
  isLoading: boolean;
  errorMessage: string | null;
  fieldErrors: { title?: string; categoryId?: string; dueDate?: string };
  title: string;
  description: string;
  categoryId: string;
  dueDate: string;
  minDueDate: string;
  editingId: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onEditStart: (todo: Todo) => void;
  onToggleStatus: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  formatDate: (value: string) => string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
}

export function TodoPanel({
  categories,
  todosByCategory,
  isLoading,
  errorMessage,
  fieldErrors,
  title,
  description,
  categoryId,
  dueDate,
  minDueDate,
  editingId,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onDueDateChange,
  onSubmit,
  onCancel,
  onEditStart,
  onToggleStatus,
  onDeleteTodo,
  formatDate,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
}: Props) {
  return (
    <Card>
      <CardHeader title={editingId ? "Edit Todo" : "Add Todo"} />
      <CardContent>
        <Stack spacing={2}>
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}

          <TextField
            label="Todo title"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            fullWidth
            error={Boolean(fieldErrors.title)}
            helperText={fieldErrors.title}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={categoryId}
                label="Category"
                onChange={e => onCategoryChange(e.target.value as string)}
                error={Boolean(fieldErrors.categoryId)}
              >
                <MenuItem value="">
                  <em>Select category</em>
                </MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Due date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={e => onDueDateChange(e.target.value)}
              fullWidth
              inputProps={{ min: minDueDate }}
              error={Boolean(fieldErrors.dueDate)}
              helperText={fieldErrors.dueDate}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={onSubmit}>
              {editingId ? "Save Changes" : "Add Todo"}
            </Button>
            {editingId && (
              <Button variant="text" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {isLoading ? (
          <Stack alignItems="center" py={3}>
            <CircularProgress />
          </Stack>
        ) : (
          Object.entries(todosByCategory).map(([categoryName, list]) => (
            <Box key={categoryName} mb={3}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography fontWeight={700}>{categoryName}</Typography>
                <Chip label={`${list.length} items`} size="small" />
              </Stack>

              <Stack spacing={1.5}>
                {list.map(todo => (
                  <Card key={todo.id} variant="outlined">
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            fontWeight={700}
                            sx={{ textDecoration: todo.completed ? "line-through" : "none" }}
                          >
                            {todo.title}
                          </Typography>
                          <Chip
                            label={todo.completed ? "Completed" : "Active"}
                            color={todo.completed ? "success" : "warning"}
                            size="small"
                          />
                        </Stack>
                        {todo.description && (
                          <Typography variant="body2" color="text.secondary">
                            {todo.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Due {formatDate(todo.dueDate)} | Created {formatDate(todo.createdAt)}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => onToggleStatus(todo.id)}>
                          {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                        </Button>
                        <Button variant="outlined" onClick={() => onEditStart(todo)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => onDeleteTodo(todo.id)}>
                          Delete
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          ))
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body2">
            Page {currentPage} of {totalPages} • Showing up to {pageSize} per page • {totalCount} total
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
              Previous
            </Button>
            <Button
              variant="outlined"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

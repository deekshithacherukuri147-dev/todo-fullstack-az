import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CssBaseline, IconButton, Snackbar, ThemeProvider, Typography, createTheme, } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { createCategory, deleteCategory, fetchCategories, } from "./features/categories/categoriesSlice";
import { createTodo, deleteTodo, fetchTodos, toggleTodo, updateTodo, } from "./features/todos/todosSlice";
import { CategoryPanel } from "./components/CategoryPanel";
import { TodoPanel } from "./components/TodoPanel";
import { FilterPanel } from "./components/FilterPanel";
const formatDate = (value) => new Date(value).toLocaleDateString();
export default function App() {
    const dispatch = useAppDispatch();
    const { items: todos, status: todoStatus, error: todoError, total: todoTotal, page: apiPage, pageSize: apiPageSize, } = useAppSelector(state => state.todos);
    const { items: categories, status: categoryStatus, error: categoryError, } = useAppSelector(state => state.categories);
    const [mode, setMode] = useState("dark");
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            background: {
                default: mode === "dark" ? "#0f0f0f" : "#f4f6f8",
                paper: mode === "dark" ? "#1c1c1c" : "#ffffff",
            },
        },
    }), [mode]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [categoryNameInput, setCategoryNameInput] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState("createdAt");
    const [ascending, setAscending] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const todayInput = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const filters = useMemo(() => ({
        status: statusFilter,
        sort: sortKey,
        order: ascending ? "asc" : "desc",
        page,
        pageSize,
    }), [statusFilter, sortKey, ascending, page, pageSize]);
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchTodos(filters));
    }, [dispatch, filters]);
    useEffect(() => {
        setPage(1);
    }, [statusFilter, sortKey, ascending]);
    useEffect(() => {
        const message = errorMessage || todoError || categoryError;
        if (message)
            setSnackbarMessage(message);
    }, [errorMessage, todoError, categoryError]);
    useEffect(() => {
        if (apiPage && apiPage !== page)
            setPage(apiPage);
        if (apiPageSize && apiPageSize !== pageSize)
            setPageSize(apiPageSize);
    }, [apiPage, apiPageSize, page, pageSize]);
    const categoryNameById = useMemo(() => categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {}), [categories]);
    const todoCountByCategory = useMemo(() => {
        const counts = {};
        todos.forEach(todo => {
            counts[todo.categoryId] = (counts[todo.categoryId] ?? 0) + 1;
        });
        return counts;
    }, [todos]);
    const totalPages = useMemo(() => Math.max(1, Math.ceil(todoTotal / pageSize)), [todoTotal, pageSize]);
    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);
    const todosByCategory = useMemo(() => {
        const groups = {};
        todos.forEach(todo => {
            const name = categoryNameById[todo.categoryId] ?? "Uncategorized";
            if (!groups[name])
                groups[name] = [];
            groups[name].push(todo);
        });
        return groups;
    }, [todos, categoryNameById]);
    const resetTodoForm = () => {
        setTitle("");
        setDescription("");
        setCategoryId("");
        setDueDate("");
        setEditingId(null);
        setFieldErrors({});
    };
    const refreshTodos = async () => {
        await dispatch(fetchTodos(filters));
    };
    const handleSubmitTodo = async () => {
        setErrorMessage(null);
        setFieldErrors({});
        const errors = {};
        if (!title.trim())
            errors.title = "Title is required";
        if (!categoryId)
            errors.categoryId = "Category is required";
        if (!dueDate)
            errors.dueDate = "Due date is required";
        if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
            errors.dueDate = "Enter a valid date";
        }
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        const payload = {
            title: title.trim(),
            description: description.trim() || undefined,
            categoryId,
            dueDate,
        };
        try {
            if (editingId) {
                await dispatch(updateTodo({ id: editingId, ...payload })).unwrap();
            }
            else {
                await dispatch(createTodo(payload)).unwrap();
            }
            await refreshTodos();
            resetTodoForm();
        }
        catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to save todo");
        }
    };
    const handleStartEdit = (todo) => {
        setEditingId(todo.id);
        setTitle(todo.title);
        setDescription(todo.description ?? "");
        setCategoryId(todo.categoryId);
        setDueDate(todo.dueDate.slice(0, 10));
    };
    const handleCreateCategory = async () => {
        if (!categoryNameInput.trim())
            return;
        try {
            await dispatch(createCategory(categoryNameInput.trim())).unwrap();
            setCategoryNameInput("");
        }
        catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to create category");
        }
    };
    const handleDeleteCategory = async (id) => {
        await dispatch(deleteCategory(id)).unwrap();
        await refreshTodos();
    };
    const handleToggleTodo = async (id) => {
        await dispatch(toggleTodo(id)).unwrap();
        await refreshTodos();
    };
    const handleDeleteTodo = async (id) => {
        await dispatch(deleteTodo(id)).unwrap();
        await refreshTodos();
    };
    const isLoading = todoStatus === "loading" || categoryStatus === "loading";
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages)
            return;
        setPage(newPage);
    };
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsxs(Box, { sx: { maxWidth: 1280, mx: "auto", p: 3 }, children: [_jsxs(Box, { sx: {
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                        }, children: [_jsx(Box, { sx: { width: 48 } }), _jsx(Typography, { variant: "h5", fontWeight: 800, sx: { flex: 1, textAlign: "center" }, children: "Todo Application" }), _jsx(IconButton, { onClick: () => setMode(mode === "dark" ? "light" : "dark"), children: mode === "dark" ? _jsx(LightModeIcon, {}) : _jsx(DarkModeIcon, {}) })] }), _jsxs(Box, { sx: {
                            display: "grid",
                            gap: 3,
                            gridTemplateColumns: { xs: "1fr", md: "280px 1fr 320px" },
                        }, children: [_jsx(CategoryPanel, { categories: categories, todoCountByCategory: todoCountByCategory, categoryNameInput: categoryNameInput, onCategoryNameChange: setCategoryNameInput, onCreateCategory: handleCreateCategory, onDeleteCategory: handleDeleteCategory, formatDate: formatDate }), _jsx(TodoPanel, { categories: categories, todosByCategory: todosByCategory, isLoading: isLoading, errorMessage: errorMessage, fieldErrors: fieldErrors, title: title, description: description, categoryId: categoryId, dueDate: dueDate, minDueDate: todayInput, editingId: editingId, onTitleChange: setTitle, onDescriptionChange: setDescription, onCategoryChange: setCategoryId, onDueDateChange: setDueDate, onSubmit: handleSubmitTodo, onCancel: resetTodoForm, onEditStart: handleStartEdit, onToggleStatus: handleToggleTodo, onDeleteTodo: handleDeleteTodo, formatDate: formatDate, currentPage: page, totalPages: totalPages, onPageChange: handlePageChange, pageSize: pageSize, totalCount: todoTotal }), _jsx(FilterPanel, { statusFilter: statusFilter, sortKey: sortKey, ascending: ascending, onStatusChange: setStatusFilter, onSortChange: value => setSortKey(value), onToggleSortOrder: () => setAscending(prev => !prev) })] })] }), _jsx(Snackbar, { open: Boolean(snackbarMessage), autoHideDuration: 4000, onClose: () => setSnackbarMessage(null), anchorOrigin: { vertical: "bottom", horizontal: "center" }, children: _jsx(Alert, { severity: "error", onClose: () => setSnackbarMessage(null), sx: { width: "100%" }, children: snackbarMessage }) })] }));
}

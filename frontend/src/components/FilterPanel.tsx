import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

type StatusFilter = "all" | "active" | "completed";
type SortKey = "createdAt" | "dueDate";

interface Props {
  statusFilter: StatusFilter;
  sortKey: SortKey;
  ascending: boolean;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortKey) => void;
  onToggleSortOrder: () => void;
}

export function FilterPanel({
  statusFilter,
  sortKey,
  ascending,
  onStatusChange,
  onSortChange,
  onToggleSortOrder,
}: Props) {
  return (
    <Card>
      <CardHeader title="Filter & Sort" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            {(["all", "active", "completed"] as StatusFilter[]).map(s => (
              <Button
                key={s}
                variant={statusFilter === s ? "contained" : "outlined"}
                onClick={() => onStatusChange(s)}
                fullWidth
              >
                {s.toUpperCase()}
              </Button>
            ))}
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="sort-select-label">Sort by</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortKey}
              label="Sort by"
              onChange={e => onSortChange(e.target.value as SortKey)}
            >
              <MenuItem value="createdAt">Created date</MenuItem>
              <MenuItem value="dueDate">Due date</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={onToggleSortOrder}>
            {ascending ? "Ascending" : "Descending"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

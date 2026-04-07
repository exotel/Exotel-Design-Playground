import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GridRenderCellParams, GridSortModel } from '@mui/x-data-grid-pro'
import MenuItem from '@mui/material/MenuItem'
import {
  Avatar,
  Box,
  DataGrid,
  Divider,
  getInitials,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Paper,
  Stack,
  stringToColor,
  Typography,
  type GridColDef,
  type ToolbarFilterConfig,
} from '@exotel-npm-dev/signal-design-system'
import { fetchUsersQuery } from '../api/usersApi'
import type { TableUserRow } from '../data/tableUser'
import type { FilterRecords } from '../types/filterRecords'

const roleOptions = [
  { value: 'all', label: 'All' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Member', label: 'Member' },
]

const teamOptions = [
  { value: 'all', label: 'All' },
  { value: 'Design', label: 'Design' },
  { value: 'Engineer', label: 'Engineer' },
]

const filterChipOptions = [
  { value: 'all', label: 'All' },
  { value: 'option_a', label: 'Option A' },
  { value: 'option_b', label: 'Option B' },
]

/** Must match toolbar `initialValue`s and stay in sync with `buildToolbarFilters` */
const INITIAL_TOOLBAR_FILTERS: FilterRecords = {
  role: 'all',
  team: 'all',
  filterChip1: 'option_a',
  filterChip2: 'option_b',
}

function buildToolbarFilters(): ToolbarFilterConfig[] {
  return [
    {
      id: 'role',
      type: 'select',
      label: 'Role',
      options: roleOptions,
      initialValue: INITIAL_TOOLBAR_FILTERS.role,
    },
    {
      id: 'team',
      type: 'select',
      label: 'Team',
      options: teamOptions,
      initialValue: INITIAL_TOOLBAR_FILTERS.team,
    },
    {
      id: 'filterChip1',
      type: 'select',
      label: 'Filter Chip 1',
      options: filterChipOptions,
      initialValue: INITIAL_TOOLBAR_FILTERS.filterChip1,
    },
    {
      id: 'filterChip2',
      type: 'select',
      label: 'Filter Chip 2',
      options: filterChipOptions,
      initialValue: INITIAL_TOOLBAR_FILTERS.filterChip2,
    },
  ]
}

export function ExampleTablePage() {
  const [rows, setRows] = useState<TableUserRow[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [filterRecords, setFilterRecords] = useState<FilterRecords>(() => ({ ...INITIAL_TOOLBAR_FILTERS }))
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [menuRowId, setMenuRowId] = useState<string | number | null>(null)

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, rowId: string | number) => {
    setMenuAnchorEl(event.currentTarget)
    setMenuRowId(rowId)
  }, [])

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null)
    setMenuRowId(null)
  }, [])

  const handleMenuAction = useCallback((action: string) => {
    console.log(`Action "${action}" on row: ${String(menuRowId)}`)
    handleMenuClose()
  }, [menuRowId, handleMenuClose])

  const loadPage = useCallback(
    async (page: number, pageSize: number, sort: GridSortModel, filters: FilterRecords) => {
      setLoading(true)
      setLoadError(null)
      try {
        const { rows: nextRows, rowCount: total } = await fetchUsersQuery({
          page,
          pageSize,
          sortModel: sort,
          filters,
        })
        setRows(nextRows)
        setRowCount(total)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load users'
        setLoadError(message)
        setRows([])
        setRowCount(0)
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadPage(paginationModel.page, paginationModel.pageSize, sortModel, filterRecords)
  }, [paginationModel.page, paginationModel.pageSize, sortModel, filterRecords, loadPage])

  const toolbarFilters = useMemo(() => buildToolbarFilters(), [])

  const renderUserNameCell = useCallback((params: GridRenderCellParams) => (
    <Stack height='100%' alignItems="center" direction="row" spacing={1}>
      <Avatar sx={{ backgroundColor: stringToColor(params.value), width: 24, height: 24, fontSize: 12 }}>{getInitials(params.value)}</Avatar>
      <Typography variant="body2">
        {params.value}
      </Typography>
    </Stack>
  ), [])

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'userName',
        headerName: 'User Name',
        flex: 1,
        minWidth: 200,
        sortable: true,
        renderCell: renderUserNameCell,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.2,
        minWidth: 240,
        sortable: true,
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 120,
        sortable: true,
      },
      {
        field: 'team',
        headerName: 'Team',
        width: 130,
        sortable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 72,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <IconButton
            size="small"
            aria-label="More actions"
            onClick={(e) => {
              e.stopPropagation()
              handleMenuOpen(e, params.id)
            }}
          >
            <Icon name="dots-three-vertical" size="sm" />
          </IconButton>
        ),
      },
    ],
    [],
  )

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'surface.elevation1',
      }}
    >
      <Stack spacing={1.5} sx={{ flex: 1, height: '100%' }}>
        {loadError && (
          <Typography color="error" variant="body2">
            {loadError}
          </Typography>
        )}
        <Box sx={{ flex: 1, height: '100%', minHeight: 480 }}>
          <DataGrid
            tableHeader={{
              title: 'Example - Table Page',
              subtitle: 'Interactive table from Signal Design System',
              showSearch: true,
              searchType: "basic",
              actions: [
                { id: 'cta-action-outlined', variant: 'outlined', children: 'CTA Action', onClick: () => {} },
                { id: 'cta-action', variant: 'contained', children: 'CTA Action', onClick: () => {} },
              ]
            }}
            rows={rows}
            columns={columns}
            loading={loading}
            checkboxSelection
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={(model) => {
              setSortModel(model)
              setPaginationModel((p) => ({ ...p, page: 0 }))
            }}
            paginationMode="server"
            rowCount={rowCount}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            customToolbarFilters={toolbarFilters}
            onToolbarFiltersChange={(filters) => {
              setFilterRecords(filters)
              setPaginationModel((p) => ({ ...p, page: 0 }))
            }}
            showAppliedFilters
            maxVisibleAppliedFilters={4}
            onRefresh={() =>
              void loadPage(paginationModel.page, paginationModel.pageSize, sortModel, filterRecords)
            }
            initialState={{pinnedColumns: {right: ['actions']}}}
          />
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { minWidth: 180 } } }}
          >
            <MenuItem onClick={() => handleMenuAction('edit')}>
              <ListItemIcon><Icon name="pencil-simple-line" size="sm" /></ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction('download')}>
              <ListItemIcon><Icon name="download-simple" size="sm" /></ListItemIcon>
              <ListItemText>Download</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction('duplicate')}>
              <ListItemIcon><Icon name="copy-simple" size="sm" /></ListItemIcon>
              <ListItemText>Duplicate</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction('view-activity')}>
              <ListItemIcon><Icon name="clock-counter-clockwise" size="sm" /></ListItemIcon>
              <ListItemText>View Activity</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit' }}><Icon name="trash-simple" size="sm" /></ListItemIcon>
              <ListItemText color="error.main">Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Paper>
  )
}

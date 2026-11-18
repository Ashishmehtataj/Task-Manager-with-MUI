import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Stack,
    IconButton,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon, Logout as LogoutIcon, Search as SearchIcon } from "@mui/icons-material"

function Task() {
    interface ITask {
        _id: string
        title: string
        description: string
        addedDate: string
        dueDate: string
        Status: string
        taskAmount: number
    }
    interface ITaskForm {
        title: string
        description: string
        addedDate: string
        dueDate: string
        Status: string
        taskAmount: number | ""
    }

    const [taskform, setTaskform] = useState<ITaskForm>({
        title: "",
        description: "",
        addedDate: "",
        dueDate: "",
        Status: "",
        taskAmount: ""
    })
    const API = 'http://localhost:7000/task'
    const token = localStorage.getItem('token')
    const login = localStorage.getItem("login")
    const [task, setTask] = useState<ITask[]>([])
    const [keyword, setKeyword] = useState("")
    const [id, setId] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleDate = (date: string | undefined) => {
        if (!date) {
            return ""
        }
        return new Date(date).toISOString().slice(0, 16)
    }

    const handleChange = (e: any) => {
        const { name, value, type } = e.target
        setTaskform({ ...taskform, [name]: type === 'number' ? (value === "" ? "" : Number(value)) : value })
    }

    const getAllTask = async () => {
        try {
            const res = await axios.get(`${API}/gettasks`, { headers: { Authorization: `Bearer ${token}` } })
            setTask(res.data.data)
        } catch (err: any) {
            if (err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
        }
    }

    const submitTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const payload = {
                ...taskform,
                addedDate: taskform.addedDate ? handleDate(taskform.addedDate) : "",
                dueDate: taskform.dueDate ? handleDate(taskform.dueDate) : "",
            }
            if (id) {
                const updatetask = await axios.put(`${API}/updatetask/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
                if (updatetask.data.success) {
                    toast.success(updatetask.data.message)
                }
                setId(null)
            } else {
                const posttask = await axios.post(`${API}/createtask`, payload, { headers: { Authorization: `Bearer ${token}` } })
                if (posttask.data.success) {
                    toast.success(posttask.data.message)
                }
            }
            getAllTask()
            setTaskform({
                title: "",
                description: "",
                addedDate: "",
                dueDate: "",
                Status: "",
                taskAmount: ""
            })
        } catch (err: any) {
            if (err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
        }
    }

    const editTask = (user: ITask) => {
        setId(user._id)
        setTaskform({
            title: user.title,
            description: user.description,
            addedDate: handleDate(user.addedDate),
            dueDate: handleDate(user.dueDate),
            Status: user.Status,
            taskAmount: user.taskAmount
        })
    }

    const searchTask = async () => {
        if (!keyword.trim()) {
            setTimeout(() => {
                getAllTask()
            }, 2000)
            return
        }

        try {
            const res = await axios.get(
                `${API}/searchtask/${keyword}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (res.data.success) {
                setTask(res.data.data)
                toast.success(res.data.message)
            }

        } catch (err: any) {
            if (err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
        }
    }

    const deleteTask = async (userId: string) => {
        if (window.confirm("Are you sure")) {
            try {
                const res = await axios.delete(`${API}/deletetask/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
                if (res.data.success) {
                    toast.success(res.data.message)
                }
                getAllTask()
            } catch (err: any) {
                if (err.response) {
                    toast.error(err.response.data.message)
                } else {
                    toast.error(err.message)
                }
            }
        }
    }

    const logOut = () => {
        if (window.confirm("Are you sure")) {
            localStorage.removeItem("token")
            localStorage.removeItem("login")
            toast("Log out success, Redirect to Log in page")
            navigate('/login')
        }
    }

    useEffect(() => {
        getAllTask()
    }, [])

    useEffect(() => {
        if (login === "true") {
            navigate('/', { replace: true })
        }
    }, [login, navigate])

    useEffect(() => {
        const login = localStorage.getItem("login")

        if (login !== "true") {
            navigate("/login")
        }
    }, [navigate])

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    CRUD PROGRAM
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={logOut}
                >
                    Log Out
                </Button>
            </Box>

            {/* Task Form Card */}
            <Card elevation={3} sx={{ mb: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                        {id ? "Edit Task" : "Add Task"}
                    </Typography>
                    <Box component="form" onSubmit={submitTask} noValidate>
                        <Stack spacing={3}>
                            <TextField
                                label="Enter Title"
                                name="title"
                                value={taskform.title}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Enter description"
                                name="description"
                                value={taskform.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                fullWidth
                            />
                            <TextField
                                label="Added Date"
                                name="addedDate"
                                type="datetime-local"
                                value={taskform.addedDate}
                                onChange={handleChange}
                                slotProps={{ inputLabel: { shrink: true } }}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Due Date"
                                name="dueDate"
                                type="datetime-local"
                                value={taskform.dueDate}
                                onChange={handleChange}
                                slotProps={{ inputLabel: { shrink: true } }}
                                required
                                fullWidth
                            />
                            <FormControl fullWidth required>
                                <InputLabel id="status-label">Select Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="Status"
                                    value={taskform.Status}
                                    label="Select Status"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Select" disabled>Select Status</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="inCompleted">inCompleted</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Task amount"
                                name="taskAmount"
                                type="number"
                                value={taskform.taskAmount}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                >
                                    {id ? "Update Task" : "Add Task"}
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            {/* Task List Section */}
            <Card elevation={3} sx={{ p: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                            All Tasks
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <TextField
                                size="small"
                                placeholder="Search Task"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={searchTask}
                                startIcon={<SearchIcon />}
                            >
                                Search
                            </Button>
                        </Stack>
                    </Box>

                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell><strong>Title</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Added Date</strong></TableCell>
                                    <TableCell><strong>Due Date</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Task Amount</strong></TableCell>
                                    <TableCell align="center"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {task.length > 0 ? (
                                    task.map((t) => (
                                        <TableRow key={t._id}>
                                            <TableCell>{t.title}</TableCell>
                                            <TableCell>{t.description}</TableCell>
                                            <TableCell>{t.addedDate}</TableCell>
                                            <TableCell>{t.dueDate}</TableCell>
                                            <TableCell>{t.Status}</TableCell>
                                            <TableCell>{t.taskAmount}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => editTask(t)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => deleteTask(t._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No tasks found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    )
}

export default Task
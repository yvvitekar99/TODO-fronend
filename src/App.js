import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMess, setalertMess] = useState("");
  const [fieldData, setfieldData] = useState("");
  const [severity, setseverity] = useState("error");
  const [editId, setEditId] = useState(false);
  useEffect(() => {
    getAllTodo();
  }, []);
  const closeAlert = () => {
    setTimeout(() => {
      setAlert(false);
    }, 1000);
  };
  const getAllTodo = async () => {
    const res = await axios.get("http://localhost:5000/todos");
    if (res.status === 200) {
      setData(res.data);
    } else {
      setData([]);
      setseverity("error");
      setalertMess("Something went wrong");
      setAlert(true);
      closeAlert();
    }
  };
  const handleSubmit = async (e) => {
    if (editId) {
      const res = await axios.put(`http://localhost:5000/todo/${editId}`, {
        description: fieldData,
      });
      if (res.status === 200) {
        await getAllTodo();
        setseverity("success");
        setalertMess(`Todo updated succesfully`);
        setAlert(true);
        closeAlert();
      } else {
        setData([]);
        setseverity("error");
        setalertMess("Something went wrong");
        setAlert(true);
        closeAlert();
      }
      setEditId(false);
    } else {
      const res = await axios.post("http://localhost:5000/todo", {
        description: fieldData,
      });
      if (res.status === 200) {
        await getAllTodo();
        setseverity("success");
        setalertMess(`Todo added succesfully`);
        setAlert(true);
        closeAlert();
      } else {
        setData([]);
        setseverity("error");
        setalertMess("Something went wrong");
        setAlert(true);
        closeAlert();
      }
    }
    setfieldData("");
  };
  const handleDelete = async (id) => {
    const res = await axios.delete(`http://localhost:5000/todo/${id}`);
    if (res.status === 200) {
      getAllTodo();
      setseverity("success");
      setalertMess("Todo Deleted succesfully");
      setAlert(true);
      closeAlert();
    } else {
      setseverity("error");
      setalertMess("Something went wrong");
      setAlert(true);
      closeAlert();
    }
  };
  const handleEdit = (ele) => {
    setfieldData(ele.description);
    setEditId(ele.todo_id);
  };
  return (
    <Grid container spacing={4} p={4}>
      {alert ? (
        <Alert
          sx={{ position: "fixed", zIndex: 5, right: "50px", top: "50px" }}
          variant="outlined"
          severity={severity}
        >
          {alertMess}
        </Alert>
      ) : null}
      <Grid
        marginTop={"2rem"}
        item
        lg={12}
        display={"flex"}
        justifyContent={"center"}
      >
        <Stack columnGap={4} sx={{ display: "flex", flexDirection: "row" }}>
          <TextField
            placeholder="Please Eneter new TODO"
            value={fieldData}
            onChange={(e) => setfieldData(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button
            color="success"
            variant="contained"
            sx={{ width: "100px" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Grid>
      {data.length
        ? data.map((ele, idx) => {
            return (
              <Grid key={idx} item lg={4}>
                <Card>
                  <CardContent>
                    <Stack
                      direction={"row"}
                      justifyContent="space-between"
                      alignItems={"center"}
                    >
                      <Typography>{ele.description}</Typography>
                      <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => handleEdit(ele)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(ele.todo_id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        : null}
    </Grid>
  );
}

export default App;

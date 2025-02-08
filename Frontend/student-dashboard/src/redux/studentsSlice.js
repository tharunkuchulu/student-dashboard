import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../api";

export const getStudents = createAsyncThunk("students/getStudents", async () => {
  const response = await fetchStudents();
  return response.data;
});

export const createStudent = createAsyncThunk("students/createStudent", async (student) => {
  const response = await addStudent(student);
  return response.data;
});

export const editStudent = createAsyncThunk("students/editStudent", async ({ name, student }) => {
  const response = await updateStudent(name, student);
  return response.data;
});

export const removeStudent = createAsyncThunk("students/removeStudent", async (name) => {
  await deleteStudent(name);
  return name;
});

const studentsSlice = createSlice({
  name: "students",
  initialState: { students: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.fulfilled, (state, action) => {
        state.students = action.payload;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex((s) => s.name === action.payload.name);
        state.students[index] = action.payload;
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.name !== action.payload);
      });
  },
});

export default studentsSlice.reducer;

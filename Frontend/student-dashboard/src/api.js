import axios from "axios";

const API_URL = "http://localhost:8000/students/";

export const fetchStudents = async () => await axios.get(API_URL);
export const addStudent = async (student) => await axios.post(API_URL, student);
export const updateStudent = async (name, student) => await axios.put(`${API_URL}${name}`, student);
export const deleteStudent = async (name) => await axios.delete(`${API_URL}${name}`);

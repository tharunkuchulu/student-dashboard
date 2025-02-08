import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStudents, createStudent } from "./redux/studentsSlice";  
import { deleteStudent } from "./api";           
import "./StudentsList.css"; 

const StudentsList = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.students);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", email: "", course: "" });

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  // Filter students based on search input
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (name) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(name);
      dispatch(getStudents()); // Refresh student list
    }
  };

  const handleSubmit = () => {
    dispatch(createStudent(form));
    setForm({ name: "", age: "", email: "", course: "" });
    setShowForm(false); // Hide form after submission
  };

  return (
    <div className="student-container" style={{ marginTop: "100px" }}>
      <div className="header">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Student"}
        </button>
      </div>

      {showForm && (
        <div className="form-container" style={{ marginTop: "40px" }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
          <button onClick={handleSubmit}>Add</button>
        </div>
      )}

      <table style={{ width: "100%", position: "relative",top: "100px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.email}</td>
                <td>{student.course || "N/A"}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(student.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;

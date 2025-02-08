import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, createStudent, editStudent, removeStudent } from "../redux/studentsSlice";

const StudentsList = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const [form, setForm] = useState({ name: "", age: "", email: "", course: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  const handleSubmit = () => {
    if (editing) {
      dispatch(editStudent({ name: form.name, student: form }));
    } else {
      dispatch(createStudent(form));
    }
    setForm({ name: "", age: "", email: "", course: "" });
    setEditing(false);
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
      <button onClick={handleSubmit}>{editing ? "Update" : "Add"}</button>

      {students.map((s) => (
        <div key={s.name}>
          {s.name} - {s.age} - {s.email} - {s.course}
          <button onClick={() => dispatch(removeStudent(s.name))}>Delete</button>
          <button onClick={() => { setEditing(true); setForm(s); }}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default StudentsList;

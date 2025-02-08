from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)  # Create DB tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new student
@app.post("/students/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    new_student = models.Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

# Get all students
@app.get("/students/", response_model=list[schemas.StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

# Get a single student by name
@app.get("/students/{name}", response_model=schemas.StudentResponse)
def get_student(name: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.name == name).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

# Update a student
@app.put("/students/{name}", response_model=schemas.StudentResponse)
def update_student(name: str, student_update: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.name == name).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    for key, value in student_update.dict(exclude_unset=True).items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student

# Delete a student
@app.delete("/students/{name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(name: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.name == name).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"message": f"Student {name} deleted successfully"}

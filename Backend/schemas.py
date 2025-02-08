from pydantic import BaseModel, EmailStr

class StudentBase(BaseModel):
    name: str
    age: int
    email: EmailStr
    course: str | None = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

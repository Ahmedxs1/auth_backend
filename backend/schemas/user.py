from pydantic import BaseModel , Field , EmailStr


class UserBase(BaseModel):
    username: str = Field(..., min_length=5)
    email: EmailStr

class UserRegister(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    user_id: int = Field(...)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class JWT_LoginKey(BaseModel):
    access_token: str = Field(...)
    token_type: str = Field(...)
    
import re
from pydantic import BaseModel, Field, field_validator
from typing import Optional

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="User full name")
    email: str = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters.")
    confirm_password: str = Field(..., description="Password confirmation matching password")
    organization: Optional[str] = "Smart City Ops"

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str):
        v_clean = v.strip().lower()
        if not EMAIL_REGEX.match(v_clean):
            raise ValueError("Invalid email address format.")
        return v_clean

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Password confirmation does not match password.")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return v

class UserLoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_login_email(cls, v: str):
        v_clean = v.strip().lower()
        if not EMAIL_REGEX.match(v_clean):
            raise ValueError("Invalid email address format.")
        return v_clean

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    organization: Optional[str]
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

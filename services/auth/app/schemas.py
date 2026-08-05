"""Authentication request/response models."""
from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Credentials for the password flow."""

    email: EmailStr
    password: str = Field(min_length=8)


class TokenResponse(BaseModel):
    """JWT token pair."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    """Refresh token exchange."""

    refresh_token: str


class UserCreate(BaseModel):
    """New user payload (admin only)."""

    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    role: str = "viewer"


class UserOut(BaseModel):
    """User profile (never exposes hashes or secrets)."""

    id: str
    email: EmailStr
    full_name: str
    role: str


class ApiKeyResponse(BaseModel):
    """Issued API key (shown once)."""

    api_key: str
    user_id: str

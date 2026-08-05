"""Authentication core: user store, password hashing, JWT tokens, RBAC."""
from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from .config import settings

# Cost factor for bcrypt. 12 strikes a balance between security and latency;
# OWASP recommends >= 10 for interactive logins.
BCRYPT_ROUNDS = 12


def hash_password(plain: str) -> str:
    """Hash a plaintext password with bcrypt (cost 12)."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt(rounds=BCRYPT_ROUNDS)).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plaintext password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        # Malformed hash — never crash the login flow, just fail closed.
        return False


class AuthError(Exception):
    """Raised when credentials or tokens are invalid."""


# Demo in-memory user store. Replace with a PostgreSQL user repository
# (see docs/data/data-models.md) — table `users`.
USERS: dict[str, dict[str, Any]] = {
    "admin@floodwatch.ai": {
        "id": "u_0001",
        "email": "admin@floodwatch.ai",
        "full_name": "Platform Administrator",
        "role": "admin",
        "hashed_password": hash_password("ChangeMe123!"),
        "api_keys": [],
    },
    "operator@floodwatch.ai": {
        "id": "u_0002",
        "email": "operator@floodwatch.ai",
        "full_name": "County Operations",
        "role": "operator",
        "hashed_password": hash_password("ChangeMe123!"),
        "api_keys": [],
    },
}


def authenticate(email: str, password: str) -> dict[str, Any]:
    """Return the user record for valid credentials, else raise AuthError."""
    user = USERS.get(email.lower())
    if user is None or not verify_password(password, user["hashed_password"]):
        raise AuthError("Invalid email or password")
    return user


def _create_token(subject: str, role: str, token_type: str, minutes: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "role": role,
        "type": token_type,
        "iat": now,
        "exp": now + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str, role: str) -> tuple[str, int]:
    """Return (access token, expiry seconds)."""
    token = _create_token(subject, role, "access", settings.access_token_expire_minutes)
    return token, settings.access_token_expire_minutes * 60


def create_refresh_token(subject: str, role: str) -> str:
    """Return a refresh token."""
    return _create_token(subject, role, "refresh", settings.refresh_token_expire_days * 24 * 60)


def decode_token(token: str) -> dict[str, Any] | None:
    """Decode and validate a token; return its claims or None."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None


def issue_api_key(user_id: str) -> str:
    """Issue a new API key and attach it to the user."""
    key = f"fw_{secrets.token_urlsafe(32)}"
    for user in USERS.values():
        if user["id"] == user_id:
            user["api_keys"].append(key)
    return key


def public_user(user: dict[str, Any]) -> dict[str, str]:
    """Strip sensitive fields from a user record."""
    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
    }

"""Authentication routes (JWT + RBAC)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Header, HTTPException

from .engine import (
    AuthError,
    USERS,
    authenticate,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    issue_api_key,
    public_user,
)
from .schemas import ApiKeyResponse, LoginRequest, RefreshRequest, TokenResponse, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

ADMIN_ONLY = {"admin"}


def require_user(authorization: str | None = Header(default=None)) -> dict:
    """Dependency: validate the bearer token and return its claims."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    payload = decode_token(authorization.removeprefix("Bearer "))
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


def require_role(*roles: str) -> callable:
    """Dependency factory enforcing role-based access."""

    def checker(payload: dict = Depends(require_user)) -> dict:
        if payload.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return payload

    return checker


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest) -> TokenResponse:
    """Authenticate and issue an access + refresh token pair."""
    try:
        user = authenticate(body.email, body.password)
    except AuthError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    access, expires_in = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"], user["role"])
    return TokenResponse(access_token=access, refresh_token=refresh, expires_in=expires_in)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest) -> TokenResponse:
    """Exchange a valid refresh token for a new pair."""
    payload = decode_token(body.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = USERS.get(payload["sub"])
    if user is None:
        raise HTTPException(status_code=401, detail="Unknown user")
    access, expires_in = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"], user["role"])
    return TokenResponse(access_token=access, refresh_token=refresh, expires_in=expires_in)


@router.get("/me", response_model=UserOut)
async def me(payload: dict = Depends(require_user)) -> UserOut:
    """Return the authenticated user's profile."""
    user = USERS.get(payload["sub"])
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**public_user(user))


@router.post("/api-keys", response_model=ApiKeyResponse)
async def create_api_key(payload: dict = Depends(require_user)) -> ApiKeyResponse:
    """Issue an API key for the current user."""
    key = issue_api_key(payload["sub"])
    return ApiKeyResponse(api_key=key, user_id=payload["sub"])


@router.get("/users", response_model=list[UserOut])
async def list_users(_: dict = Depends(require_role("admin"))) -> list[UserOut]:
    """List all users (admin only)."""
    return [UserOut(**public_user(user)) for user in USERS.values()]


@router.post("/users", response_model=UserOut, status_code=201)
async def create_user(body: UserCreate, _: dict = Depends(require_role("admin"))) -> UserOut:
    """Create a user (admin only)."""
    email = body.email.lower()
    if email in USERS:
        raise HTTPException(status_code=409, detail="User already exists")

    USERS[email] = {
        "id": f"u_{len(USERS) + 1:04d}",
        "email": email,
        "full_name": body.full_name,
        "role": body.role,
        "hashed_password": hash_password(body.password),
        "api_keys": [],
    }
    return UserOut(**public_user(USERS[email]))

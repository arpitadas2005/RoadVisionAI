import uuid
import time
from fastapi import APIRouter, HTTPException, status, Header, Request, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import UserModel
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.services.audit_service import log_security_event

router = APIRouter()

REVOKED_TOKENS = set()

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.split(" ")[1]
    if token in REVOKED_TOKENS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been logged out. Please log in again.",
        )

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid signature. Please log in again.",
        )
        
    return payload["sub"]

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserRegisterRequest, request: Request, db: AsyncSession = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    email_clean = body.email.lower().strip()
    
    # Query database for existing user
    stmt = select(UserModel).where(UserModel.email == email_clean)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()
    
    if existing_user:
        log_security_event("registration_duplicate_attempt", details=f"email={email_clean}", ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    if body.password != body.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password confirmation does not match password."
        )

    user_id = f"usr-{uuid.uuid4().hex[:10]}"
    hashed_pwd = hash_password(body.password)

    new_user = UserModel(
        id=user_id,
        email=email_clean,
        name=body.full_name,
        password_hash=hashed_pwd,
        organization=body.organization or "Municipal Survey Ops",
        role="operator"
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    log_security_event("registration_success", user_id=user_id, ip_address=client_ip)

    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.name,
        organization=new_user.organization or "Municipal Survey Ops",
        role=new_user.role,
        created_at=new_user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if new_user.created_at else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    )

@router.post("/login", response_model=TokenResponse)
async def login(body: UserLoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    email_clean = body.email.lower().strip()

    stmt = select(UserModel).where(UserModel.email == email_clean)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(body.password, user.password_hash):
        log_security_event("login_failure", details=f"email={email_clean}", ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password combination."
        )

    log_security_event("login_success", user_id=user.id, ip_address=client_ip)

    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=86400,
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.name,
            organization=user.organization or "Municipal Survey Ops",
            role=user.role,
            created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if user.created_at else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)):
    user_id = get_current_user_id(authorization)
    
    stmt = select(UserModel).where(UserModel.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if user:
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.name,
            organization=user.organization or "Municipal Survey Ops",
            role=user.role,
            created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if user.created_at else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
            
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        REVOKED_TOKENS.add(token)
    return {"message": "Session logged out and access token invalidated."}

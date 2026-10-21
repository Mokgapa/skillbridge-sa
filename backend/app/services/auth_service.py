from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security.jwt import create_access_token
from app.security.password import verify_password
from app.schemas.auth import LoginRequest, TokenResponse


class AuthService:
    """
    Business logic for authentication and login.
    """

    def __init__(self):
        self.user_repository = UserRepository()

    def authenticate_user(
        self,
        db: Session,
        login_data: LoginRequest,
    ) -> User | None:
        user = self.user_repository.get_by_email(
            db,
            login_data.email,
        )

        if user is None:
            return None

        if not user.is_active:
            return None

        if not verify_password(
            login_data.password,
            user.password_hash,
        ):
            return None

        return user

    def login(
        self,
        db: Session,
        login_data: LoginRequest,
    ) -> TokenResponse:
        user = self.authenticate_user(
            db,
            login_data,
        )

        if user is None:
            raise ValueError(
                "Invalid email or password."
            )

        role_name = None

        if getattr(user, "roles", None):
            if len(user.roles) > 0:
                role_name = user.roles[0].name

        access_token = create_access_token(
            subject=user.email,
            user_id=user.id,
            role=role_name,
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
        )
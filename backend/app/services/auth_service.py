
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security.jwt import create_access_token
from app.security.password import hash_password, verify_password
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse


class AuthService:
    """
    Business logic for user registration and authentication.
    """

    def __init__(self):
        self.user_repository = UserRepository()

    def register_user(
        self,
        db: Session,
        user_data: UserCreate,
    ) -> UserResponse:
        """
        Register a new user with a securely hashed password.
        """
        email = str(user_data.email)

        existing_user = self.user_repository.get_by_email(
            db,
            email,
        )

        if existing_user is not None:
            raise ValueError(
                "An account with this email already exists."
            )

        try:
            user = self.user_repository.create(
                db,
                {
                    "email": email,
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name,
                    "phone": user_data.phone,
                    "password_hash": hash_password(
                        user_data.password
                    ),
                },
            )

            db.commit()
            db.refresh(user)

        except Exception:
            db.rollback()
            raise

        return UserResponse.model_validate(user)

    def authenticate_user(
        self,
        db: Session,
        login_data: LoginRequest,
    ) -> User | None:
        """
        Find an active user and verify their password.
        """
        user = self.user_repository.get_by_email(
            db,
            str(login_data.email),
        )

        if user is None or not user.is_active:
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
        """
        Authenticate a user and return an access token.
        """
        user = self.authenticate_user(
            db,
            login_data,
        )

        if user is None:
            raise ValueError(
                "Invalid email or password."
            )

        role_name = None
        user_roles = getattr(user, "roles", None)

        if user_roles:
            if len(user_roles) > 0:
                role_name = user_roles[0].name

        access_token = create_access_token(
            subject=user.email,
            user_id=user.id,
            role=role_name,
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
        )

    def login_user(
        self,
        db: Session,
        login_data: LoginRequest,
    ) -> TokenResponse:
        """
        Compatibility method used by the login controller.
        """
        return self.login(
            db,
            login_data,
        )

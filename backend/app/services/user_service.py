from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security.password import hash_password
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """
    Business logic for user management.
    """

    def __init__(self):
        self.user_repository = UserRepository()

    def get_user(
        self,
        db: Session,
        user_id: int,
    ) -> User | None:
        return self.user_repository.get_by_id(
            db,
            user_id,
        )

    def get_user_by_email(
        self,
        db: Session,
        email: str,
    ) -> User | None:
        return self.user_repository.get_by_email(
            db,
            email,
        )

    def create_user(
        self,
        db: Session,
        user_data: UserCreate,
    ) -> User:
        existing_user = self.user_repository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ValueError(
                "A user with this email already exists."
            )

        user_values = user_data.model_dump()

        password = user_values.pop("password")

        user_values["password_hash"] = hash_password(
            password
        )

        return self.user_repository.create(
            db,
            user_values,
        )

    def update_user(
        self,
        db: Session,
        user_id: int,
        user_data: UserUpdate,
    ) -> User:
        user = self.user_repository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            raise ValueError(
                "User not found."
            )

        update_values = user_data.model_dump(
            exclude_unset=True
        )

        if "password" in update_values:
            password = update_values.pop("password")

            if password:
                update_values["password_hash"] = (
                    hash_password(password)
                )

        return self.user_repository.update(
            db,
            user,
            update_values,
        )

    def delete_user(
        self,
        db: Session,
        user_id: int,
    ) -> None:
        user = self.user_repository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            raise ValueError(
                "User not found."
            )

        self.user_repository.delete(
            db,
            user,
        )
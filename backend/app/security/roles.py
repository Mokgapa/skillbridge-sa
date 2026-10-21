from fastapi import Depends, HTTPException, status

from app.security.dependencies import get_current_user


def require_role(required_role: str):
    """
    Restrict an endpoint to users with a specific role.
    """

    def role_checker(
        current_user=Depends(get_current_user),
    ):
        user_roles = getattr(
            current_user,
            "roles",
            [],
        )

        role_names = {
            role.name
            for role in user_roles
        }

        if required_role not in role_names:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )

        return current_user

    return role_checker
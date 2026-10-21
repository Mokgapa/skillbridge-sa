from fastapi import HTTPException, status


class SkillBridgeException(Exception):
    """Base exception for SkillBridge SA."""

    def __init__(self, message: str = "An application error occurred."):
        self.message = message
        super().__init__(self.message)


class ResourceNotFoundException(SkillBridgeException):
    """Raised when a requested resource cannot be found."""

    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} not found.")


class DuplicateResourceException(SkillBridgeException):
    """Raised when a resource already exists."""

    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} already exists.")


class BusinessRuleException(SkillBridgeException):
    """Raised when a business rule is violated."""


class PermissionDeniedException(SkillBridgeException):
    """Raised when a user lacks permission to perform an action."""

    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(message)


def not_found_http_exception(
    detail: str = "Resource not found.",
) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=detail,
    )


def bad_request_http_exception(
    detail: str = "The request is invalid.",
) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=detail,
    )


def unauthorized_http_exception(
    detail: str = "Authentication is required.",
) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def forbidden_http_exception(
    detail: str = "You do not have permission to perform this action.",
) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=detail,
    )

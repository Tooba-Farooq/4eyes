from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

class OptionalJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that doesn't fail on invalid/expired tokens.
    Instead, it returns None and lets permission classes decide access.
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, AuthenticationFailed):
            # Invalid token - return None instead of raising error
            # This allows AllowAny endpoints to continue
            return None
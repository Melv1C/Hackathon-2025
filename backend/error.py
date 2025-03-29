class Error:
    def __init__(self, message, code=None):
        self.message = message
        self.code = code

    def __str__(self):
        return f"Error {self.code}: {self.message}" if self.code else self.message

    def to_dict(self):
        """Convert error to dictionary for JSON response"""
        error_dict = {"error": self.message}
        if self.code:
            error_dict["code"] = self.code
        return error_dict

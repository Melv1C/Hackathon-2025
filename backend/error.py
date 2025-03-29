
class Error:
    def __init__(self, message, code=None):
        self.message = message
        self.code = code

    def __str__(self):
        return f"Error {self.code}: {self.message}" if self.code else self.message





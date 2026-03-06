class DomainError(Exception):
    pass


class MissingIndexError(DomainError):
    pass


class EmptyMarkdownError(DomainError):
    pass

import strawberry
from .mutation
from .query 

schema = strawberry.Schema(query=Query, mutation=Mutation)
# from fastapi import FastAPI, Request
# import httpx

# app = FastAPI(title="SmartSplit API Gateway")


# SERVICES = {
#     "auth": "http://127.0.0.1:8001",
#     "users": "http://127.0.0.1:8002",
#     "groups": "http://127.0.0.1:8003",
#     "expenses": "http://127.0.0.1:8004",
# }


# async def forward_request(
#     request: Request,
#     service_url: str,
#     path: str
# ):
#     async with httpx.AsyncClient() as client:

#         body = await request.body()

#         response = await client.request(
#             method=request.method,
#             url=f"{service_url}/{path}",
#             headers=dict(request.headers),
#             content=body,
#             params=request.query_params,
#         )

#         return response


# @app.api_route(
#     "/auth/{path:path}",
#     methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
# )
# async def auth_gateway(path: str, request: Request):

#     response = await forward_request(
#         request,
#         SERVICES["auth"],
#         f"auth/{path}"
#     )

#     return response.json()


# @app.api_route(
#     "/users/{path:path}",
#     methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
# )
# async def user_gateway(path: str, request: Request):

#     response = await forward_request(
#         request,
#         SERVICES["users"],
#         f"users/{path}"
#     )

#     return response.json()


# @app.api_route(
#     "/groups/{path:path}",
#     methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
# )
# async def group_gateway(path: str, request: Request):

#     response = await forward_request(
#         request,
#         SERVICES["groups"],
#         f"groups/{path}"
#     )

#     return response.json()


# @app.api_route(
#     "/expenses/{path:path}",
#     methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
# )
# async def expense_gateway(path: str, request: Request):

#     response = await forward_request(
#         request,
#         SERVICES["expenses"],
#         f"expenses/{path}"
#     )

#     return response.json()
from __future__ import annotations

import os
import threading
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.interface.http.dependencies import build_container
from app.interface.http.routes.agent import router as agent_router


def _get_allowed_origins() -> list[str]:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if frontend_url:
        origins.append(frontend_url)
    return origins


def _init_container(app: FastAPI) -> None:
    """Build container and index in a background thread."""
    try:
        container = build_container()
        settings = container.settings
        container.build_index_usecase.execute(
            md_dir=settings.md_dir,
            index_dir=settings.index_dir,
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            embed_batch_size=settings.embed_batch_size,
        )
        app.state.container = container
        print("[startup] Container and index ready.")
    except Exception as e:
        print(f"[startup] Initialization failed: {e}")
        app.state.container = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.container = None
    thread = threading.Thread(target=_init_container, args=(app,), daemon=True)
    thread.start()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Portfolio AI Agent API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(agent_router)

    @app.get("/", include_in_schema=False)
    def root() -> RedirectResponse:
        return RedirectResponse(url="/docs")

    return app

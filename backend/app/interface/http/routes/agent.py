from __future__ import annotations

from typing import AsyncIterator

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.domain.errors import EmptyMarkdownError, MissingIndexError
from app.interface.http.schemas import BuildIndexRequest, ChatStreamRequest
from app.interface.http.sse import format_sse

router = APIRouter()


@router.get("/health")
def health(request: Request) -> dict[str, str]:
    ready = request.app.state.container is not None
    return {"status": "ok", "ready": str(ready).lower()}


@router.post("/index/build")
def build_index(req: BuildIndexRequest, request: Request) -> dict:
    container = request.app.state.container
    if container is None:
        raise HTTPException(status_code=503, detail="Service is still initializing.")
    settings = container.settings
    try:
        result = container.build_index_usecase.execute(
            md_dir=settings.md_dir,
            index_dir=settings.index_dir,
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            embed_batch_size=settings.embed_batch_size,
        )
        return result
    except EmptyMarkdownError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail="Failed to build index.") from e


@router.post("/chat/stream")
async def chat_stream(req: ChatStreamRequest, request: Request) -> StreamingResponse:
    container = request.app.state.container
    if container is None:
        raise HTTPException(status_code=503, detail="Service is still initializing.")

    async def gen() -> AsyncIterator[str]:
        try:
            async for event in container.chat_stream_usecase.execute(
                thread_id=req.thread_id,
                user_message=req.message,
            ):
                yield format_sse(event=event["event"], data=event["data"])
        except MissingIndexError as e:
            yield format_sse("error", {"message": str(e)})
        except Exception:
            yield format_sse("error", {"message": "Stream failed due to server error."})

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

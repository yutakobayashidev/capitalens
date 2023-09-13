from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import ffmpeg
import io

app = FastAPI()


@app.get("/video_frame/")
async def get_video_frame(time: int, url: str):
    output_image_path = "pipe:"
    input_url = url

    out, _ = (
        ffmpeg.input(input_url, ss=time)
        .output(output_image_path, vframes=1, format="image2", vcodec="mjpeg")
        .run(capture_stdout=True, capture_stderr=True)
    )
    return StreamingResponse(io.BytesIO(out), media_type="image/jpeg")

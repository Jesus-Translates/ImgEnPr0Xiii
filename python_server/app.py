# python_server/app.py

"""Simple FastAPI inference server used by the Next.js front‑end.
It exposes a single `/infer` endpoint that accepts a JSON body with a
`prompt` field and returns a base64‑encoded placeholder PNG image.
Replace the placeholder logic with your actual model inference.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import io
from PIL import Image, ImageDraw, ImageFont

app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str

def generate_placeholder_image(prompt: str) -> str:
    # Create a small PNG with the prompt text for demo purposes.
    img = Image.new("RGB", (400, 200), color="#222222")
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except Exception:
        font = ImageFont.load_default()
    d.text((10, 80), f"Prompt: {prompt}", fill="#eeeeee", font=font)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

@app.post("/infer")
async def infer(request: PromptRequest):
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Missing prompt")
    # TODO: integrate real model here.
    image_base64 = generate_placeholder_image(request.prompt)
    return {"imageBase64": image_base64}

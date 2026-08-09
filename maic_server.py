"""
MochiClass AI ??MAIC Edition Server
Merges: VaultSage API proxy + OCR (PaddleOCR) + Speech-to-Text (Whisper)
Port: 4185
"""
import base64
import hashlib
import hmac
import json
import os
import subprocess
import sys
import tempfile
import importlib.util
import time
from urllib.parse import urlencode
from io import BytesIO
from pathlib import Path
import threading
from typing import Any, List, Optional, Dict

os.environ["FLAGS_use_onednn"] = "0"
os.environ["FLAGS_use_mkldnn"] = "0"

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile, Body, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
load_dotenv(ROOT / ".env")

# ?? API Keys & Config ??
VAULTSAGE_API_BASE = os.getenv("VAULTSAGE_API_BASE", "https://api.vaultsage.ai/api/v1").rstrip("/")
VAULTSAGE_API_KEY  = os.getenv("VAULTSAGE_API_KEY", "")
GEMINI_API_KEY     = os.getenv("GEMINI_API_KEY", "")
HF_TOKEN           = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY", "")
OAUTH_BASE_URL     = os.getenv("OAUTH_BASE_URL", "http://127.0.0.1:4185").rstrip("/")
AUTH_COOKIE_NAME   = "classok_auth"
AUTH_SECRET        = os.getenv("AUTH_SECRET") or HF_TOKEN or "classok-dev-secret"
GOOGLE_CLIENT_ID   = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
LINE_CHANNEL_ID    = os.getenv("LINE_CHANNEL_ID", "")
LINE_CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET", "")
APPLE_CLIENT_ID    = os.getenv("APPLE_CLIENT_ID", "")
APPLE_TEAM_ID      = os.getenv("APPLE_TEAM_ID", "")
APPLE_KEY_ID       = os.getenv("APPLE_KEY_ID", "")
APPLE_PRIVATE_KEY  = os.getenv("APPLE_PRIVATE_KEY", "")

print("=" * 40)
print(" MochiClass AI - MAIC Server")
print(f" Root:           {ROOT}")
print(f" VaultSage API:  {'[OK]' if VAULTSAGE_API_KEY else '[X] Missing'}")
print(f" Gemini API:     {'[OK]' if GEMINI_API_KEY else '[X] Missing'}")
print(f" HF Token:       {'[OK]' if HF_TOKEN else '[X] Missing'}")
print("=" * 40)

# ?? FastAPI App ??
app = FastAPI(title="MochiClass AI ??MAIC Edition")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:4185", "http://localhost:4185", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ?? Pydantic Models ??
@app.middleware("http")
async def no_cache_static_assets(request: Request, call_next):
    response = await call_next(request)
    if request.url.path == "/" or request.url.path.endswith((".html", ".js", ".css")):
        response.headers["Cache-Control"] = "no-store, max-age=0"
    return response

class ChatRequest(BaseModel):
    question: str
    file_ids: List[str] = []
    chat_id:  Optional[str] = None

class EnsureDirectoryRequest(BaseModel):
    directory_name: str

class ParseEventsRequest(BaseModel):
    text: str
    language: str = "zh-Hant"

class ScheduleCommandRequest(BaseModel):
    command: str
    current_events: List[Dict[str, Any]] = []
    language: str = "zh-Hant"

def _sign(value: str) -> str:
    return hmac.new(AUTH_SECRET.encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()

def _encode_signed(payload: Dict[str, Any]) -> str:
    raw = base64.urlsafe_b64encode(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")).decode("ascii").rstrip("=")
    return f"{raw}.{_sign(raw)}"

def _decode_signed(token: str) -> Optional[Dict[str, Any]]:
    try:
      raw, signature = token.split(".", 1)
      if not hmac.compare_digest(signature, _sign(raw)):
          return None
      padded = raw + "=" * (-len(raw) % 4)
      return json.loads(base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8"))
    except Exception:
      return None

def _oauth_state(provider: str) -> str:
    nonce = base64.urlsafe_b64encode(os.urandom(18)).decode("ascii").rstrip("=")
    raw = f"{provider}:{nonce}:{int(time.time())}"
    return f"{raw}:{_sign(raw)}"

def _verify_oauth_state(provider: str, state: str) -> bool:
    try:
        raw, signature = state.rsplit(":", 1)
        state_provider, _, ts = raw.split(":", 2)
        if state_provider != provider:
            return False
        if int(time.time()) - int(ts) > 600:
            return False
        return hmac.compare_digest(signature, _sign(raw))
    except Exception:
        return False

def _auth_cookie_payload(provider: str, profile: Dict[str, Any]) -> Dict[str, Any]:
    name = profile.get("name") or profile.get("displayName") or profile.get("email") or "ClassOK User"
    return {
        "provider": provider,
        "name": name,
        "email": profile.get("email", ""),
        "picture": profile.get("picture", ""),
        "sub": profile.get("sub") or profile.get("userId") or "",
        "iat": int(time.time()),
    }

def _set_auth_cookie(response: Response, payload: Dict[str, Any]) -> None:
    response.set_cookie(
        AUTH_COOKIE_NAME,
        _encode_signed(payload),
        max_age=60 * 60 * 24 * 14,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )

def _current_user(request: Request) -> Optional[Dict[str, Any]]:
    token = request.cookies.get(AUTH_COOKIE_NAME, "")
    if not token:
        return None
    return _decode_signed(token)

# ?? OCR & Whisper (lazy-loaded) ??
_ocr_model    = None
_whisper_model = None
_ocr_lock     = threading.Lock()

def get_ocr():
    global _ocr_model
    if _ocr_model is None:
        try:
            from paddleocr import PaddleOCR
            _ocr_model = PaddleOCR(
                text_detection_model_name="PP-OCRv4_mobile_det",
                text_recognition_model_name="PP-OCRv4_mobile_rec",
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                use_textline_orientation=False,
                enable_mkldnn=False
            )
        except ImportError:
            print("PaddleOCR not installed ??image OCR disabled.")
            return None
    return _ocr_model

def get_whisper():
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            cache_dir = PROJECT_ROOT / "tools" / "whisper_models"  # Share with parent project
            cache_dir.mkdir(parents=True, exist_ok=True)
            model_name = os.getenv("WHISPER_MODEL_SIZE", "tiny")
            _whisper_model = WhisperModel(
                model_name,
                device="cpu",
                compute_type="int8",
                download_root=str(cache_dir),
            )
        except ImportError:
            print("Faster-Whisper not installed ??audio transcription disabled.")
            return None
    return _whisper_model

def run_ocr_on_pil(pil_img) -> str:
    try:
        import numpy as np
        import cv2
        from PIL import Image
        max_size = 2000
        if max(pil_img.size) > max_size:
            pil_img = pil_img.copy()
            pil_img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        model = get_ocr()
        if not model:
            return ""
        with _ocr_lock:
            img_np  = np.array(pil_img.convert("RGB"))
            img_cv2 = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
            texts   = []
            if hasattr(model, "predict"):
                result = model.predict(img_cv2)
                for item in result or []:
                    rec_texts = item.get("rec_texts") if hasattr(item, "get") else None
                    if rec_texts:
                        texts.extend(str(t) for t in rec_texts if t)
                if texts:
                    return " ".join(texts).strip()
            result = model.ocr(img_cv2)
            for page in result or []:
                for line in page or []:
                    if line and len(line) > 1:
                        texts.append(str(line[1][0]))
            return " ".join(texts).strip()
    except Exception as e:
        print(f"OCR error: {e}")
        return ""

def sync_extract_text(body: bytes, filename: str, content_type: str) -> str:
    lower = filename.lower()
    text  = ""

    if lower.endswith(".pdf") or content_type == "application/pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(BytesIO(body))
            pages  = [p.extract_text() or "" for p in reader.pages[:8]]
            text   = "\n".join(pages).strip()
        except Exception:
            pass
        if len(text.strip()) < 50:
            try:
                import pypdfium2 as pdfium
                pdf = pdfium.PdfDocument(body)
                for i in range(min(3, len(pdf))):
                    page   = pdf.get_page(i)
                    bitmap = page.render(scale=2.0)
                    pil_img = bitmap.to_pil()
                    ocr_text = run_ocr_on_pil(pil_img)
                    if ocr_text:
                        text += "\n" + ocr_text
            except Exception as e:
                print(f"PDF OCR failed: {e}")

    elif lower.endswith((".jpg",".png",".jpeg",".webp")) or content_type.startswith("image/"):
        try:
            from PIL import Image
            pil_img = Image.open(BytesIO(body))
            text    = run_ocr_on_pil(pil_img)
        except Exception as e:
            print(f"Image OCR failed: {e}")
            text = "Image OCR failed"

    elif lower.endswith((".wav",".mp3",".m4a",".ogg",".flac",".aac")) or content_type.startswith("audio/"):
        suffix = Path(filename).suffix or ".wav"
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(body)
                tmp_path = tmp.name
            try:
                whisper = get_whisper()
                if whisper:
                    segs, _ = whisper.transcribe(tmp_path, beam_size=1, vad_filter=True, vad_parameters=dict(min_silence_duration_ms=500))
                    text = "".join(s.text for s in segs).strip()
                else:
                    text = "Whisper not loaded"
            except Exception as e:
                print(f"Whisper error: {e}")
                text = "Audio processing error"
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        except Exception as e:
            print(f"File handling error: {e}")

    elif lower.endswith((".txt",".md",".csv",".json")) or content_type.startswith("text/"):
        text = body.decode("utf-8", errors="ignore")

    return text

# ?? VaultSage Helpers ??
def vault_headers() -> Dict[str, str]:
    if not VAULTSAGE_API_KEY:
        raise HTTPException(status_code=503, detail="VaultSage API key not configured. Set VAULTSAGE_API_KEY in maic-app/.env")
    return {"X-Api-Key": VAULTSAGE_API_KEY}

def extract_file_id(payload: Any) -> str:
    if isinstance(payload, dict):
        for key in ("file_id", "id"):
            if payload.get(key): return str(payload[key])
        for value in payload.values():
            found = extract_file_id(value)
            if found: return found
    if isinstance(payload, list):
        for value in payload:
            found = extract_file_id(value)
            if found: return found
    return ""

def extract_json_payload(text: str) -> Any:
    raw = (text or "").strip()
    if not raw:
        return None
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = max(parts, key=len).strip()
        if raw.lower().startswith("json"):
            raw = raw[4:].strip()
    first_array = raw.find("[")
    last_array = raw.rfind("]")
    if first_array >= 0 and last_array > first_array:
        raw = raw[first_array:last_array + 1]
    else:
        first_obj = raw.find("{")
        last_obj = raw.rfind("}")
        if first_obj >= 0 and last_obj > first_obj:
            raw = raw[first_obj:last_obj + 1]
    return json.loads(raw)

async def qwen_json(prompt: str) -> Any:
    if not HF_TOKEN:
        raise HTTPException(status_code=503, detail="HF_TOKEN / HUGGINGFACE_API_KEY not configured")

    model = os.getenv("HF_BOOKING_MODEL") or os.getenv("HF_QWEN_MODEL", "Qwen/Qwen2.5-7B-Instruct")
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a careful JSON extraction engine. Return only valid JSON. No markdown.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.1,
        "max_tokens": 1200,
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(90.0, connect=20.0)) as client:
        resp = await client.post("https://router.huggingface.co/v1/chat/completions", headers=headers, json=payload)
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        data = resp.json()

    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    try:
        return extract_json_payload(content)
    except Exception as exc:
        raise HTTPException(status_code=502, detail={"message": "Qwen did not return valid JSON", "raw": content}) from exc

# ?? API Routes ??

import database

@app.get("/api/sync")
async def get_sync(request: Request) -> Dict[str, Any]:
    user = _current_user(request)
    user_id = user["sub"] if (user and user.get("sub")) else "guest"
    return database.get_user_state(user_id)

@app.post("/api/sync")
async def post_sync(request: Request, body: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    user = _current_user(request)
    user_id = user["sub"] if (user and user.get("sub")) else "guest"
    ok = database.save_user_state(user_id, body)
    if not ok:
        raise HTTPException(status_code=500, detail="Database save failed")
    return {"ok": True}

@app.get("/api/status")
async def status() -> Dict[str, Any]:
    result = {
        "api_base": VAULTSAGE_API_BASE,
        "api_key_configured": bool(VAULTSAGE_API_KEY),
        "api_ready": False,
        "hf_proxy": bool(HF_TOKEN),
        "local_ocr_ready": bool(importlib.util.find_spec("paddleocr") and importlib.util.find_spec("paddle")),
        "local_speech_ready": bool(importlib.util.find_spec("faster_whisper")),
        "whisper_model_size": os.getenv("WHISPER_MODEL_SIZE", "tiny"),
        "python_executable": sys.executable,
        "python_prefix": sys.prefix,
        "auth_status": "missing_key" if not VAULTSAGE_API_KEY else "unchecked",
    }
    if VAULTSAGE_API_KEY:
        try:
            resp = httpx.get(f"{VAULTSAGE_API_BASE}/users/me", headers=vault_headers(), timeout=10.0)
            result["api_ready"]    = resp.status_code == 200
            result["auth_status"]  = "ok" if resp.status_code == 200 else f"http_{resp.status_code}"
        except Exception as exc:
            result["auth_status"] = f"error: {exc!s}"
    return result

@app.get("/api/auth/me")
async def auth_me(request: Request) -> Dict[str, Any]:
    return {
        "authenticated": bool(_current_user(request)),
        "user": _current_user(request),
        "providers": {
            "google": bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET),
            "line": bool(LINE_CHANNEL_ID and LINE_CHANNEL_SECRET),
            "apple": bool(APPLE_CLIENT_ID and APPLE_TEAM_ID and APPLE_KEY_ID and APPLE_PRIVATE_KEY),
        },
    }

@app.post("/api/auth/logout")
async def auth_logout() -> Response:
    response = Response(content='{"ok":true}', media_type="application/json")
    response.delete_cookie(AUTH_COOKIE_NAME, path="/")
    return response

@app.get("/api/auth/oauth-url/{provider}")
async def oauth_url(provider: str) -> Dict[str, str]:
    provider = provider.lower()
    redirect_uri = f"{OAUTH_BASE_URL}/api/auth/callback/{provider}"
    state = _oauth_state(provider)
    if provider == "google":
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            raise HTTPException(status_code=503, detail="GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not configured")
        params = {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "select_account",
        }
        return {"url": f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"}
    if provider == "line":
        if not LINE_CHANNEL_ID or not LINE_CHANNEL_SECRET:
            raise HTTPException(status_code=503, detail="LINE_CHANNEL_ID / LINE_CHANNEL_SECRET not configured")
        params = {
            "response_type": "code",
            "client_id": LINE_CHANNEL_ID,
            "redirect_uri": redirect_uri,
            "state": state,
            "scope": "profile openid email",
            "bot_prompt": "normal",
        }
        return {"url": f"https://access.line.me/oauth2/v2.1/authorize?{urlencode(params)}"}
    if provider == "apple":
        if not (APPLE_CLIENT_ID and APPLE_TEAM_ID and APPLE_KEY_ID and APPLE_PRIVATE_KEY):
            raise HTTPException(status_code=503, detail="APPLE_CLIENT_ID / APPLE_TEAM_ID / APPLE_KEY_ID / APPLE_PRIVATE_KEY not configured")
        params = {
            "client_id": APPLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code id_token",
            "response_mode": "form_post",
            "scope": "name email",
            "state": state,
        }
        return {"url": f"https://appleid.apple.com/auth/authorize?{urlencode(params)}"}
    raise HTTPException(status_code=404, detail="Unknown OAuth provider")

@app.get("/api/auth/callback/{provider}")
async def oauth_callback(provider: str, code: str = "", state: str = "", error: str = "") -> RedirectResponse:
    provider = provider.lower()
    if error:
        return RedirectResponse(f"/?auth_error={urlencode({'message': error})}")
    if not code or not _verify_oauth_state(provider, state):
        return RedirectResponse("/?auth_error=invalid_state")

    redirect_uri = f"{OAUTH_BASE_URL}/api/auth/callback/{provider}"
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            if provider == "google":
                token_resp = await client.post("https://oauth2.googleapis.com/token", data={
                    "code": code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                })
                token_resp.raise_for_status()
                id_token = token_resp.json().get("id_token", "")
                profile_resp = await client.get("https://oauth2.googleapis.com/tokeninfo", params={"id_token": id_token})
                profile_resp.raise_for_status()
                profile = profile_resp.json()
            elif provider == "line":
                token_resp = await client.post("https://api.line.me/oauth2/v2.1/token", data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "client_id": LINE_CHANNEL_ID,
                    "client_secret": LINE_CHANNEL_SECRET,
                })
                token_resp.raise_for_status()
                id_token = token_resp.json().get("id_token", "")
                profile_resp = await client.post("https://api.line.me/oauth2/v2.1/verify", data={
                    "id_token": id_token,
                    "client_id": LINE_CHANNEL_ID,
                })
                profile_resp.raise_for_status()
                profile = profile_resp.json()
            else:
                raise HTTPException(status_code=404, detail="Unknown OAuth provider")
    except Exception as exc:
        print(f"OAuth callback failed: {exc}")
        return RedirectResponse("/?auth_error=oauth_failed")

    response = RedirectResponse("/")
    _set_auth_cookie(response, _auth_cookie_payload(provider, profile))
    return response


def sync_extract_text(body: bytes, filename: str, content_type: str) -> str:
    lower = filename.lower()
    text = ""

    if lower.endswith(".pdf") or content_type == "application/pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(BytesIO(body))
            pages = [page.extract_text() or "" for page in reader.pages[:8]]
            text = "\n".join(pages).strip()
        except Exception:
            pass
        if len(text.strip()) < 50:
            try:
                import pypdfium2 as pdfium
                pdf = pdfium.PdfDocument(body)
                for i in range(min(3, len(pdf))):
                    page = pdf.get_page(i)
                    bitmap = page.render(scale=2.0)
                    ocr_text = run_ocr_on_pil(bitmap.to_pil())
                    if ocr_text:
                        text += "\n" + ocr_text
            except Exception as exc:
                print(f"PDF OCR failed: {exc}")

    elif lower.endswith((".jpg", ".png", ".jpeg", ".webp")) or content_type.startswith("image/"):
        try:
            from PIL import Image
            text = run_ocr_on_pil(Image.open(BytesIO(body)))
        except Exception as exc:
            print(f"Image OCR failed: {exc}")

    elif lower.endswith((".wav", ".mp3", ".m4a", ".ogg", ".flac", ".aac", ".webm")) or content_type.startswith("audio/"):
        suffix = Path(filename).suffix or ".webm"
        tmp_path = ""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(body)
                tmp_path = tmp.name
            whisper = get_whisper()
            if whisper:
                segments, _ = whisper.transcribe(tmp_path, beam_size=1, vad_filter=True, vad_parameters=dict(min_silence_duration_ms=500))
                text = "".join(segment.text for segment in segments).strip()
        except Exception as exc:
            print(f"Whisper error: {exc}")
        finally:
            if tmp_path:
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass

    elif lower.endswith((".txt", ".md", ".csv", ".json")) or content_type.startswith("text/"):
        text = body.decode("utf-8", errors="ignore")

    return text


def get_mime_type(filename: str, fallback: str) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"): return "application/pdf"
    if lower.endswith(".png"): return "image/png"
    if lower.endswith((".jpg", ".jpeg")): return "image/jpeg"
    if lower.endswith(".webp"): return "image/webp"
    if lower.endswith(".wav"): return "audio/wav"
    if lower.endswith(".mp3"): return "audio/mp3"
    if lower.endswith((".m4a", ".mp4")): return "audio/mp4"
    if lower.endswith(".webm"): return "audio/webm"
    if lower.endswith(".ogg"): return "audio/ogg"
    if lower.endswith(".flac"): return "audio/flac"
    if lower.endswith(".aac"): return "audio/aac"
    if fallback: return fallback
    return "application/octet-stream"

async def gemini_generate_content(mime_type: str, data: bytes, prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")
    b64_data = base64.b64encode(data).decode("utf-8")
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": b64_data
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    async with httpx.AsyncClient(timeout=httpx.Timeout(90.0)) as client:
        resp = await client.post(url, json=payload)
        if resp.status_code != 200:
            raise Exception(f"Gemini API error: {resp.status_code} - {resp.text}")
        result = resp.json()
        text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        return text.strip()

@app.post("/api/extract-text")
async def extract_text(file: UploadFile = File(...)) -> Dict[str, Any]:
    body = await file.read()
    if not body:
        raise HTTPException(status_code=400, detail="Empty file")
    filename     = file.filename or "upload"
    content_type = file.content_type or ""

    if GEMINI_API_KEY:
        try:
            mime = get_mime_type(filename, content_type)
            if mime.startswith("image/"):
                text = await gemini_generate_content(
                    mime, body,
                    "Please extract all text from this image. Return only the extracted text exactly as it appears. Do not add any summary, explanation, or markdown."
                )
                return {"text": text[:12000]}
            elif mime == "application/pdf":
                try:
                    from pypdf import PdfReader
                    reader = PdfReader(BytesIO(body))
                    pages = [page.extract_text() or "" for page in reader.pages[:8]]
                    text = "\n".join(pages).strip()
                except Exception:
                    text = ""
                if len(text.strip()) < 50:
                    ocr_texts = []
                    try:
                        import pypdfium2 as pdfium
                        pdf = pdfium.PdfDocument(body)
                        for i in range(min(3, len(pdf))):
                            page = pdf.get_page(i)
                            bitmap = page.render(scale=2.0)
                            img_io = BytesIO()
                            bitmap.to_pil().convert("RGB").save(img_io, format="JPEG")
                            img_bytes = img_io.getvalue()
                            ocr_text = await gemini_generate_content(
                                "image/jpeg", img_bytes,
                                "Please extract all text from this page image. Return only the extracted text exactly as it appears. Do not add any summary, explanation, or markdown."
                            )
                            if ocr_text:
                                ocr_texts.append(ocr_text)
                        text = "\n".join(ocr_texts).strip()
                    except Exception as exc:
                        print(f"Gemini PDF rendering/OCR failed: {exc}")
                return {"text": text[:12000]}
            elif mime.startswith("audio/"):
                text = await gemini_generate_content(
                    mime, body,
                    "Please transcribe this audio. Return only the transcription verbatim. Do not translate, summarize, or explain. Use the original language."
                )
                return {"text": text[:12000]}
            elif mime.startswith("text/") or filename.lower().endswith((".txt", ".md", ".csv", ".json")):
                text = body.decode("utf-8", errors="ignore")
                return {"text": text[:12000]}
        except Exception as e:
            print(f"Gemini extraction failed, falling back to local: {e}")

    try:
        import anyio
        text = await anyio.to_thread.run_sync(sync_extract_text, body, filename, content_type)
    except ImportError:
        import asyncio
        text = await asyncio.to_thread(sync_extract_text, body, filename, content_type)
    return {"text": text[:12000]}


async def gemini_json(prompt: str) -> Any:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    async with httpx.AsyncClient(timeout=httpx.Timeout(40.0)) as client:
        resp = await client.post(url, json=payload)
        if resp.status_code != 200:
            raise Exception(f"Gemini JSON API error: {resp.status_code} - {resp.text}")
        result = resp.json()
        text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        return extract_json_payload(text)

@app.post("/api/parse-events")
async def parse_events(request: ParseEventsRequest) -> Dict[str, Any]:
    source = (request.text or "").strip()
    if not source:
        return {"events": []}

    import datetime
    today = datetime.datetime.now()
    ref_date = today.strftime("%Y-%m-%d")
    ref_weekday = today.strftime("%A")
    weekdays_zh = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    ref_weekday_zh = weekdays_zh[int(today.strftime("%w"))]

    prompt = f"""
You are ClassOK's schedule and event parser for Taiwanese students.
The student might input weekly course schedules, single exams, or personal events via voice dictation or text.
Extract all events mentioned.

Today's Reference Date: {ref_date} ({ref_weekday_zh} / {ref_weekday})

Return ONLY a valid JSON array of objects. No markdown (no ```json), no explanations, no comments.

Each event object structure:
{{
  "title": "Event/Course title",
  "type": "class|life|exam",
  "day": null or integer (0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday),
  "date": null or string "YYYY-MM-DD",
  "start": "HH:MM",
  "end": "HH:MM",
  "room": "Location/Room if specified, or empty string",
  "relatedCourse": "Course name if this is an exam/event related to a course, or empty string"
}}

Rules for Dates and Weekdays:
1. For single one-off events (e.g. "8/10 18:00 朋友聚會", "8/16 9點多益考試", "明天早上 10 點小考", "下週三討論專題"):
   - Calculate the absolute date based on the Today's Reference Date ({ref_date}).
   - Set "date" to the calculated date string (e.g. "2026-08-10").
   - Set "day" to the corresponding weekday integer (0-6).
   - If the text specifies a month and day (e.g. "8/10", "8/16"), assume the current year ({today.year}) unless specified.
   - For relative dates: "今天" is {ref_date}, "明天" is {(today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")}, "後天" is {(today + datetime.timedelta(days=2)).strftime("%Y-%m-%d")}.
2. For weekly repeating class schedules (e.g. "星期一 第三節 10:10-11:00 英文"):
   - Set "date" to null.
   - Set "day" to the weekday integer (0-6).
3. Time extraction:
   - Format start and end as "HH:MM" (24-hour format). E.g., "18:00", "09:00", "13:30".
   - If the user says "9點" or "早上9點", set start to "09:00". If "晚上9點", set start to "21:00".
   - If end time is not specified, default the duration to 1 hour (e.g. "9點" -> start "09:00", end "10:00").
4. Type classification:
   - "class": school courses, lectures, regular tutoring, weekly classes.
   - "exam": exams, tests, quizzes, midterms, finals, certification exams (e.g. TOEIC, GEPT), deadlines, submissions.
   - "life": gatherings, dinners, sports/exercise, personal appointments, club activities, work shifts, etc.

Example Input:
"8/10 18:00 朋友聚會，然後 8/16 早上9點多益考試"

Example Output:
[
  {{
    "title": "朋友聚會",
    "type": "life",
    "day": 1,
    "date": "2026-08-10",
    "start": "18:00",
    "end": "19:00",
    "room": "",
    "relatedCourse": ""
  }},
  {{
    "title": "多益考試",
    "type": "exam",
    "day": 0,
    "date": "2026-08-16",
    "start": "09:00",
    "end": "10:00",
    "room": "",
    "relatedCourse": "多益"
  }}
]

Language hint: {request.language}
Student Text:
{source}
""".strip()

    # Route request to Gemini JSON if configured, fallback to Qwen JSON
    parsed = None
    if GEMINI_API_KEY:
        try:
            print("Using Gemini API for JSON event parsing...")
            parsed = await gemini_json(prompt)
        except Exception as gem_err:
            print(f"Gemini JSON parsing failed, falling back to Qwen: {gem_err}")
            
    if parsed is None:
        print("Using Qwen API for JSON event parsing...")
        parsed = await qwen_json(prompt)
        
    if isinstance(parsed, dict):
        events = parsed.get("events", [])
    else:
        events = parsed
    if not isinstance(events, list):
        raise HTTPException(status_code=502, detail={"message": "AI JSON was not a list", "payload": parsed})

    def normalize_time(value: Any, fallback: str) -> str:
        text = str(value or fallback).replace("：", ":").strip()
        if len(text) == 4 and text[1] == ":":
            text = "0" + text
        if len(text) >= 5 and text[2] == ":":
            return text[:5]
        return fallback

    def add_one_hour(start_time_str: str) -> str:
        try:
            parts = start_time_str.split(":")
            h = int(parts[0])
            m = int(parts[1])
            h = (h + 1) % 24
            return f"{h:02d}:{m:02d}"
        except Exception:
            return "10:00"

    clean_events = []
    for index, item in enumerate(events):
        if not isinstance(item, dict):
            continue
        event_type = item.get("type") if item.get("type") in {"class", "life", "exam"} else "class"
        day = item.get("day")
        if isinstance(day, str) and day.isdigit():
            day = int(day)
            
        start_time = normalize_time(item.get("start"), "09:00")
        end_time = item.get("end")
        if not end_time or end_time == start_time:
            end_time = add_one_hour(start_time)
        else:
            end_time = normalize_time(end_time, "10:00")
            
        clean_events.append({
            "id": f"event-{index}",
            "title": str(item.get("title") or f"Event {index + 1}").strip(),
            "type": event_type,
            "day": day if day in {0, 1, 2, 3, 4, 5, 6} else None,
            "date": item.get("date"),
            "start": start_time,
            "end": end_time,
            "room": str(item.get("room") or "").strip(),
            "relatedCourse": str(item.get("relatedCourse") or "").strip(),
        })
    return {"events": clean_events}


async def schedule_command(request: ScheduleCommandRequest) -> Dict[str, Any]:
    command = (request.command or "").strip()
    if not command:
        return {"action": "noop", "message": "empty command"}

    current_events = json.dumps(request.current_events[:80], ensure_ascii=False)
    prompt = f"""
You control a student's ClassOK timeline. Return ONLY valid JSON, no markdown.

The user speaks a command in Chinese or mixed language. Decide whether to add, delete, update, or do nothing.

Return one object:
{{
  "action": "add" | "delete" | "update" | "noop",
  "events": [event objects for add],
  "target": {{"title":"", "type":"class|life|exam|null", "day":0-6|null}},
  "updates": {{"title":null, "type":null, "day":null, "start":null, "end":null, "room":null, "relatedCourse":null}},
  "message": "short Traditional Chinese summary"
}}

Event object format:
{{"title":"", "type":"class|life|exam", "day":0-6, "date":null, "start":"HH:MM", "end":"HH:MM", "room":"", "relatedCourse":""}}

Rules:
- If the command adds schedule content, fill "events" exactly like /api/parse-events.
- If the command says ?芣?/??/delete/remove, action is "delete" and target describes what to delete.
- If the command says ??蝘餃/撱嗅?/??/change/move, action is "update", target describes old event, updates contains new fields.
- For "銝?" with no exact time infer 09:00-11:00. For "銝?" infer 14:00-16:00. For exams with no time infer 09:00-11:00.
- Keep Saturday and Sunday: Saturday=6, Sunday=0.
- Do not invent unrelated fields.

Current events:
{current_events}

Voice command:
{command}
""".strip()

    parsed = await qwen_json(prompt)
    if not isinstance(parsed, dict):
        raise HTTPException(status_code=502, detail={"message": "Qwen command JSON was not an object", "payload": parsed})
    return parsed


@app.post("/api/chat")
async def chat(request: ChatRequest) -> Dict[str, Any]:
    if not VAULTSAGE_API_KEY:
        return {
            "answer": "VaultSage API 尚未設定，ClassOK 目前先使用本機 Demo 回答。請在 .env 補上 VAULTSAGE_API_KEY 後重新啟動伺服器。",
            "chat_id": None,
        }

    message: Dict[str, Any] = {"actor": "user", "content": request.question}
    if request.file_ids and not request.chat_id:
        message["file_ids"] = request.file_ids

    payload: Dict[str, Any] = {"messages": [message], "persist": True}
    if request.chat_id:
        payload["chat_id"] = request.chat_id

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=30.0)) as client:
            resp = await client.post(f"{VAULTSAGE_API_BASE}/chat/message/v2", headers=vault_headers(), json=payload)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"VaultSage 連線失敗: {exc!s}") from exc

    try:    data = resp.json()
    except: data = {"raw": resp.text}
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=data)

    return {
        "answer":  data.get("result") or data.get("answer") or data.get("message") or str(data),
        "chat_id": data.get("new_chat_id") or data.get("chat_id") or request.chat_id,
    }


@app.post("/api/directories/ensure")
async def ensure_directory(request: EnsureDirectoryRequest) -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(f"{VAULTSAGE_API_BASE}/directories/", headers=vault_headers())
            if resp.status_code == 200:
                data = resp.json()
                dirs = data.get("data") or data.get("items") or data
                if isinstance(dirs, list):
                    for d in dirs:
                        if d.get("directory_name") == request.directory_name:
                            return {"directory_id": str(d["directory_id"]), "created": False}

            create_resp = await client.post(
                f"{VAULTSAGE_API_BASE}/directories/",
                headers=vault_headers(),
                json={"directory_name": request.directory_name, "parent_directory_id": None},
            )
            payload = create_resp.json() if create_resp.status_code < 400 else {}
            if create_resp.status_code >= 400:
                raise HTTPException(status_code=create_resp.status_code, detail=payload)
            return {"directory_id": str(payload.get("directory_id","")), "created": True}
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"VaultSage directory error: {exc!s}") from exc


@app.post("/api/upload")
async def upload(file: UploadFile = File(...), directory_id: Optional[str] = None) -> Dict[str, Any]:
    body = await file.read()
    if not body:
        raise HTTPException(status_code=400, detail="Empty file")

    content_type = file.content_type or "application/octet-stream"
    if content_type.startswith("text/") and "charset=" not in content_type.lower():
        content_type += "; charset=utf-8"

    params = {"conflict_resolution": "keep"}
    if directory_id:
        params["directory_id"] = directory_id

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=30.0)) as client:
            resp = await client.post(
                f"{VAULTSAGE_API_BASE}/files/",
                headers=vault_headers(),
                params=params,
                files={"files": (file.filename or "upload", body, content_type)},
            )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"VaultSage upload error: {exc!s}") from exc

    try:    payload = resp.json()
    except: payload = {"raw": resp.text}
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=payload)

    file_id = extract_file_id(payload)
    if not file_id:
        raise HTTPException(status_code=502, detail={"message": "API did not return a file_id", "payload": payload})
    return {"file_id": file_id, "payload": payload}


# ?? HF Proxy (fallback) ??
@app.post("/api/hf-proxy/{model_path:path}")
async def hf_proxy(model_path: str, body: bytes = Body(...)):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN / HUGGINGFACE_API_KEY not configured")
    url = f"https://api-inference.huggingface.co/models/{model_path}"
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/octet-stream" if len(body) > 1000 else "application/json"
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(url, headers=headers, content=body)
            return resp.json()
        except Exception as e:
            return {"error": str(e), "fallback": True}


# ?? Serve frontend ??
@app.get("/")
def index() -> FileResponse:
    return FileResponse(ROOT / "www" / "index.html")

app.mount("/", StaticFiles(directory=str(ROOT / "www")), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4185, reload=False)








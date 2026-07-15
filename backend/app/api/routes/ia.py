import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from google import genai
from pydantic import BaseModel


load_dotenv()
client = genai.Client(api_key=os.getenv("IA_API_KEY"))

router = APIRouter(prefix="/ia", tags=["IA"])

class MensagemRequest(BaseModel):
    mensagem: str
    loja: str
    preco: float
    preco_antigo: float | None = None
    cupom: str | None = None
    canal: str = "Telegram"
    tom: str = "Urgente"

def criar_prompt(dados: MensagemRequest) -> str:
    return f"""
Crie uma mensagem curta de promoção para {dados.canal}.

Produto: {dados.produto}
Loja: {dados.loja}
Preço atual: R$ {dados.preco}
Preço antigo: {dados.preco_antigo or "não informado"}
Cupom: {dados.cupom or "sem cupom"}
Tom da mensagem: {dados.tom}

A mensagem deve ser persuasiva, clara e pronta para publicar.
"""

def get_client():
    api_key = os.getenv("IA_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="IA_API_KEY não configurada.")
    return genai.Client(api_key=api_key)

@router.post("/gerar-mensagem")
async def gerar_mensagem(dados: MensagemRequest):
    prompt = criar_prompt(dados)
    client = get_client()
    try:
        resposta = client.models.generate_content(
            model="genai-3.5-flash",
            contents=prompt,
        )
        return {"mensagem": resposta.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

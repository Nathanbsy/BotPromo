"use client";

import { useMemo, useState } from "react";

type Network = "Instagram" | "TikTok" | "WhatsApp" | "Telegram";
type Tone = "Direto" | "Urgente" | "Consultivo" | "Divertido";

const networks: Network[] = ["Instagram", "TikTok", "WhatsApp", "Telegram"];
const tones: Tone[] = ["Direto", "Urgente", "Consultivo", "Divertido"];

const workflow = [
  {
    title: "Afiliados",
    module: "affiliate_service.py",
    status: "Mock local",
    detail: "Busca produtos, precos e links rastreados.",
  },
  {
    title: "Conteudo",
    module: "content_service.py",
    status: "Simulado",
    detail: "Gera legenda, CTA, hashtags e imagem sugerida.",
  },
  {
    title: "Publicacao",
    module: "social_publisher.py",
    status: "Fila visual",
    detail: "Prepara posts para redes e agenda envios.",
  },
  {
    title: "API",
    module: "health.py",
    status: "Sem conexao",
    detail: "Espaco pronto para testar /health quando existir.",
  },
];

const queue = [
  { time: "09:30", channel: "Telegram", title: "Cupom relampago", state: "Pronto" },
  { time: "12:00", channel: "Instagram", title: "Carrossel de oferta", state: "Rascunho" },
  { time: "18:45", channel: "WhatsApp", title: "Lista VIP", state: "Aguardando" },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function PromoLab() {
  const [product, setProduct] = useState("Fone Bluetooth Lenovo LP40");
  const [store, setStore] = useState("Shopee");
  const [price, setPrice] = useState(79.9);
  const [oldPrice, setOldPrice] = useState(129.9);
  const [commission, setCommission] = useState(8);
  const [network, setNetwork] = useState<Network>("Instagram");
  const [tone, setTone] = useState<Tone>("Urgente");
  const [coupon, setCoupon] = useState("PROMO10");
  const [generatedAt, setGeneratedAt] = useState("15:20");

  const discount = useMemo(() => {
    if (!oldPrice || oldPrice <= price) {
      return 0;
    }

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }, [oldPrice, price]);

  const affiliateLink = useMemo(() => {
    const slug = product
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return `https://afiliado.local/${store.toLowerCase()}/${slug}?utm=botpromocoes`;
  }, [product, store]);

  const caption = useMemo(() => {
    const openings: Record<Tone, string> = {
      Direto: "Oferta encontrada e pronta para divulgar.",
      Urgente: "Preco caiu agora e pode acabar rapido.",
      Consultivo: "Boa opcao para quem quer economizar sem garimpar.",
      Divertido: "Achadinho aprovado para mandar no grupo sem medo.",
    };

    const channelNote: Record<Network, string> = {
      Instagram: "Use no post ou nos stories com link na bio.",
      TikTok: "Roteiro curto para video de ate 20 segundos.",
      WhatsApp: "Mensagem compacta para lista de transmissao.",
      Telegram: "Post objetivo para canal de ofertas.",
    };

    return `${openings[tone]}\n\n${product} por ${currency.format(price)} na ${store}. Antes estava ${currency.format(oldPrice)}${discount ? `, desconto de ${discount}%` : ""}.\n\nCupom: ${coupon || "sem cupom"}\n${channelNote[network]}\n\n${affiliateLink}`;
  }, [affiliateLink, coupon, discount, network, oldPrice, price, product, store, tone]);

  const hashtags = useMemo(
    () => ["#promocao", "#achadinhos", `#${store.toLowerCase()}`, "#ofertasdodia"],
    [store],
  );

  function simulateGeneration() {
    setGeneratedAt(
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f3] text-[#1c201f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[#d8ddd2] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#66746a]">
              BotPromocoes
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#101615] sm:text-4xl">
              Laboratorio de campanhas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66746a]">
              Frente de teste para montar ofertas, validar copy e simular a fila
              de publicacao antes do backend entrar em cena.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-[390px]">
            <Metric label="Margem" value={`${commission}%`} />
            <Metric label="Desconto" value={`${discount}%`} />
            <Metric label="Mock" value="ON" />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflow.map((item) => (
            <article
              className="rounded-lg border border-[#d8ddd2] bg-white p-4 shadow-sm"
              key={item.module}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <p className="mt-1 font-mono text-xs text-[#66746a]">{item.module}</p>
                </div>
                <span className="rounded-md border border-[#c9d8ce] bg-[#edf6ee] px-2 py-1 text-xs font-semibold text-[#2e6c45]">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#66746a]">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(320px,430px)_1fr]">
          <form className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Entrada da promocao</h2>
                <p className="mt-1 text-sm text-[#66746a]">
                  Ajuste os dados e gere um preview local.
                </p>
              </div>
              <button
                className="h-10 rounded-md bg-[#1d5b4f] px-4 text-sm font-semibold text-white transition hover:bg-[#16483f]"
                onClick={simulateGeneration}
                type="button"
              >
                Simular
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <Field label="Produto">
                <input
                  className="field"
                  onChange={(event) => setProduct(event.target.value)}
                  value={product}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Loja">
                  <select
                    className="field"
                    onChange={(event) => setStore(event.target.value)}
                    value={store}
                  >
                    <option>Amazon</option>
                    <option>Mercado Livre</option>
                    <option>Shopee</option>
                    <option>AliExpress</option>
                  </select>
                </Field>
                <Field label="Canal">
                  <select
                    className="field"
                    onChange={(event) => setNetwork(event.target.value as Network)}
                    value={network}
                  >
                    {networks.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Preco">
                  <input
                    className="field"
                    min="0"
                    onChange={(event) => setPrice(Number(event.target.value))}
                    step="0.01"
                    type="number"
                    value={price}
                  />
                </Field>
                <Field label="De">
                  <input
                    className="field"
                    min="0"
                    onChange={(event) => setOldPrice(Number(event.target.value))}
                    step="0.01"
                    type="number"
                    value={oldPrice}
                  />
                </Field>
                <Field label="Comissao">
                  <input
                    className="field"
                    min="0"
                    onChange={(event) => setCommission(Number(event.target.value))}
                    type="number"
                    value={commission}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Cupom">
                  <input
                    className="field"
                    onChange={(event) => setCoupon(event.target.value)}
                    value={coupon}
                  />
                </Field>
                <Field label="Tom">
                  <select
                    className="field"
                    onChange={(event) => setTone(event.target.value as Tone)}
                    value={tone}
                  >
                    {tones.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </form>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <section className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#e5e8e1] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Preview do post</h2>
                  <p className="mt-1 text-sm text-[#66746a]">
                    Gerado as {generatedAt} para {network}.
                  </p>
                </div>
                <span className="w-fit rounded-md bg-[#f2e7c9] px-3 py-1 text-xs font-semibold text-[#70520d]">
                  {tone}
                </span>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
                <div className="flex aspect-[4/5] items-center justify-center rounded-lg border border-[#d8ddd2] bg-[#10211e] p-5 text-center text-white">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#a7d8c7]">
                      Oferta
                    </p>
                    <p className="mt-4 text-3xl font-bold">{discount}% OFF</p>
                    <p className="mt-3 text-sm leading-5 text-[#d8e8e1]">{product}</p>
                    <p className="mt-5 text-2xl font-semibold">{currency.format(price)}</p>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  <pre className="min-h-[260px] whitespace-pre-wrap rounded-lg border border-[#d8ddd2] bg-[#fbfcf8] p-4 text-sm leading-6 text-[#28302d]">
                    {caption}
                  </pre>

                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((item) => (
                      <span
                        className="rounded-md border border-[#cfd8d9] bg-[#eef5f8] px-2 py-1 text-xs font-semibold text-[#315f6b]"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[#d8ddd2] bg-[#fbfcf8] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#66746a]">
                      Payload para futura API
                    </p>
                    <code className="mt-2 block break-all text-xs leading-5 text-[#28302d]">
                      POST /api/v1/content/generate {"{"} product, price, oldPrice,
                      coupon, network, tone, affiliateLink {"}"}
                    </code>
                  </div>
                </div>
              </div>
            </section>

            <aside className="grid gap-6">
              <section className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Saude da API</h2>
                <div className="mt-4 rounded-lg border border-[#edd7d0] bg-[#fff6f2] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#7c3f2c]">
                      Backend offline
                    </span>
                    <span className="h-3 w-3 rounded-full bg-[#d85b3f]" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#765548]">
                    Este bloco esta mockado. Depois voce pode chamar
                    <span className="font-mono"> /api/v1/health</span> aqui.
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Fila de publicacao</h2>
                <div className="mt-4 divide-y divide-[#e5e8e1]">
                  {queue.map((item) => (
                    <div className="grid grid-cols-[54px_1fr] gap-3 py-3" key={item.time}>
                      <time className="text-sm font-semibold text-[#1d5b4f]">{item.time}</time>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-[#66746a]">
                          {item.channel} - {item.state}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  children,
  label,
}: Readonly<{
  children: React.ReactNode;
  label: string;
}>) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#3d4642]">
      {label}
      {children}
    </label>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border border-[#d8ddd2] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

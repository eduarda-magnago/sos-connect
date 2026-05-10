import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import logoDark from "../../assets/Striking_Horizontal_Logo_with_Heart_Icon__4_-removebg-preview 1.png";
import logoLight from "../../assets/logowhite.png";
import heroBg from "../../assets/capa.png";
import imgRedes from "../../assets/image 4.png";
import imgVoluntariado from "../../assets/image 2.png";
import imgDoacoes from "../../assets/image 5.png";
import imgRescue from "../../assets/Rectangle 440.png";
import telefone from "../../assets/telefone.png";
import localiza from "../../assets/pin-de-localizacao 1.png";

// Hook: dispara classe 'visible' quando elemento entra na viewport
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingPage() {
  const navigate = useNavigate();

  // Refs do hero para stagger manual
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef  = useRef<HTMLParagraphElement>(null);
  const heroBtnRef   = useRef<HTMLButtonElement>(null);

  // Refs com IntersectionObserver
  const sectionTitleRef = useReveal();
  const rescueRef       = useReveal();

  // Animação staggered no hero ao montar a página
  useEffect(() => {
    const items = [
      { el: heroTitleRef.current, delay: 100 },
      { el: heroTextRef.current,  delay: 320 },
      { el: heroBtnRef.current,   delay: 540 },
    ];
    items.forEach(({ el, delay }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        })
      );
    });
  }, []);

  return (
    <>
      <style>{`
        /* Reveal genérico ao scroll */
        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Banner rescue: zoom-out suave + overlay */
        .rescue-wrap {
          overflow: hidden;
          border-radius: 1rem;
          position: relative;
        }
        .rescue-wrap img {
          transition: transform 0.9s ease;
          transform: scale(1.06);
          display: block;
        }
        .rescue-wrap.visible img {
          transform: scale(1);
        }
        .rescue-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(16,40,72,0.30) 0%, transparent 55%);
          border-radius: 1rem;
          pointer-events: none;
        }
      `}</style>

      <div className="min-h-screen font-sans bg-white">

        {/* ── NAVBAR ── */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <img src={logoDark} alt="SOS Connect" className="h-50 cursor-pointer" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-sm px-5 py-2 rounded-lg bg-[#f9f9f9] border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm px-5 py-2 rounded-lg bg-[#F32121] text-white hover:bg-[#cc3618] transition-colors cursor-pointer font-medium"
              >
                Cadastre-se
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section
          className="relative min-h-[700px] flex items-center pt-16 overflow-hidden"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 w-full pl-30 py-24">
            <div className="max-w-lg">
              <h1
                ref={heroTitleRef}
                className="text-3xl font-bold text-white leading-snug mb-4"
              >
                Conectando pessoas,<br />salvando vidas!
              </h1>

              <p
                ref={heroTextRef}
                className="text-lg text-gray-300 leading-relaxed mb-8"
              >
                A SOS Connect reúne unidades de apoio, voluntários e quem precisa
                de ajuda em um só lugar, informação certa, na hora certa, para
                transformar solidariedade em ação.
              </p>

              <button
                ref={heroBtnRef}
                onClick={() => navigate("/register")}
                className="px-15 py-3 bg-[#F32121] text-white text-sm font-medium rounded-lg hover:bg-[#F32121] transition-colors cursor-pointer"
              >
                Quero participar
              </button>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">

            {/* Título com fade-up ao entrar na tela */}
            <div ref={sectionTitleRef} className="reveal">
              <h2 className="text-4xl font-semibold text-gray-900 text-center mb-10">
                Como nossa plataforma funciona
              </h2>
            </div>

            <div className="bg-[#EAEAEA]/20 border border-[#BEBEBE] rounded-2xl p-10 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                {[
                  {
                    img: imgRedes,
                    title: "Redes de apoio próximas de você",
                    desc: "Encontre unidades de apoio ativas na sua região e saiba exatamente onde buscar ajuda ou como contribuir de forma eficiente.",
                  },
                  {
                    img: imgVoluntariado,
                    title: "Voluntariado",
                    desc: "Conecte-se a missões reais que precisam de voluntários. Escolha como e quando você pode ajudar e faça a diferença na vida de pessoas.",
                  },
                  {
                    img: imgDoacoes,
                    title: "Ajude com doações",
                    desc: "Veja as necessidades específicas de cada unidade e doe o que realmente será útil, evitando desperdício e priorizando urgências.",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="flex flex-col transition-all duration-300 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden"
                  >
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-50 object-cover"
                    />
                    <div className="bg-white p-12 pt-6 h-full">
                      <h3 className="text-1xl font-semibold text-gray-900 mb-5">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BANNER RESCUE ── */}
        <section className="max-w-7xl mx-auto px-6 pb-14">
          {/* zoom-out + fade ao entrar na tela */}
          <div ref={rescueRef} className="rescue-wrap reveal">
            <img
              src={imgRescue}
              alt="Equipe de resgate"
              className="w-full h-80 object-cover"
            />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#102848] text-white py-12">
          <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col">
              <img src={logoLight} alt="SOS Connect" className="w-70 mb-6 cursor-pointer" />
              <p className="text-[18px] text-gray-300 leading-relaxed max-w-sm">
                Conectando pessoas e recursos para salvar vidas em momentos de emergência.
              </p>
            </div>

            <div className="mt-10 md:mt-0">
              <h4 className="text-3xl font-semibold mb-6">Contato</h4>
              <ul className="space-y-5 text-[18px] text-gray-300">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#1E3A5F] flex items-center justify-center cursor-pointer">✉</div>
                  <span>sosconnect@gmail.com</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#1E3A5F] flex items-center justify-center">
                    <img src={telefone} className="w-4 mb-1 cursor-pointer" />
                  </div>
                  <span>+55 31 99862-3465</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#1E3A5F] flex items-center justify-center">
                    <img src={localiza} className="w-5 mb-1 cursor-pointer" />
                  </div>
                  <span>Minas Gerais, Brasil</span>
                </li>
              </ul>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
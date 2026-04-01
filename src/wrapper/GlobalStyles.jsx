// src/components/landing/GlobalStyles.jsx
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Sora:wght@400;500;600;700;800&family=Syne:wght@700&display=swap');


      *, *::before, *::after { box-sizing: border-box; margin: 0; }
      html { scroll-behavior: smooth; }
      body { min-height: 100vh; }


      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }


      .feat-card {
        padding: 28px;
        border-radius: 16px;
        border: 1px solid rgba(26, 111, 255, 0.18);
        background: rgba(10, 22, 40, 0.85);
        backdrop-filter: blur(8px);
        transition: transform .2s, box-shadow .2s, border-color .2s;
      }


      @media (max-width: 899px) {
        .features-grid {
          grid-template-columns: 1fr;
        }
      }


      @keyframes fadeSlideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeSlideLeft {
        from { opacity: 0; transform: translateX(30px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50%       { transform: translateX(-50%) translateY(-8px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.5; transform: scale(0.85); }
      }
    `}</style>
  );
}

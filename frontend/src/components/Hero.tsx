export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
            Backend &amp; System Engineering
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          박해원
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light">
          Backend Engineer · System Architect
        </p>

        <div className="w-16 h-px bg-gray-300 mx-auto mb-8" />

        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          서비스가 실제로 운영되는 환경을 전제로 설계하는
          <br className="hidden md:block" />
          백엔드 엔지니어입니다.
        </p>

        <div className="mt-12">
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="text-sm">더 알아보기</span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

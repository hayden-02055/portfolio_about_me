export default function Future() {
  const capabilities = [
    "서비스 규모에 맞는 백엔드 구조 설계",
    "MVP부터 운영 단계까지 이어지는 설계",
    "복잡한 비즈니스 로직 정리",
    "기존 코드베이스 구조 개선",
  ];

  const directions = [
    "대규모 시스템 설계",
    "AI 시스템과 서비스 인프라의 결합",
    "운영 자동화 및 안정성",
  ];

  return (
    <section id="future" className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">What I Can Do &amp; Direction</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              What I Can Do
            </h3>

            <div className="space-y-3">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100"
                >
                  <span className="w-6 h-6 bg-gray-800 text-white rounded flex items-center justify-center text-xs font-semibold">
                    ✓
                  </span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Direction
            </h3>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                현재는{" "}
                <strong className="text-gray-900">
                  Backend / System / Architecture
                </strong>{" "}
                중심의 엔지니어링 역량을 강화하고 있으며, 장기적으로는:
              </p>

              <div className="space-y-3">
                {directions.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <span className="w-6 h-6 bg-gray-100 text-gray-500 rounded flex items-center justify-center text-xs">
                      →
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-sm mt-4">쪽으로 확장하고자 합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Experience() {
  const projectCharacteristics = [
    "실제 사용자 대상 서비스",
    "단순 과제가 아닌 지속 운영 서비스",
    "기능 추가와 구조 변경이 반복되는 환경",
  ];

  const roles = [
    "백엔드 아키텍처 설계",
    "핵심 비즈니스 로직 구현",
    "데이터 구조 설계",
    "운영 이슈 대응",
  ];

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Project Experience</h2>

        <div className="mb-8">
          <span className="text-sm text-gray-500 font-medium tracking-wide uppercase">
            Service-Level Development Experience
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              프로젝트 성격
            </h3>
            <ul className="space-y-3 pl-4">
              {projectCharacteristics.map((item) => (
                <li key={item} className="text-gray-600 flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              담당 역할
            </h3>
            <ul className="space-y-3 pl-4">
              {roles.map((item) => (
                <li key={item} className="text-gray-600 flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const challenges = [
    "불완전한 요구사항",
    "빠른 MVP 개발과 구조 안정성의 균형",
    "운영 중 발생하는 예외 상황",
    "기능 확장에 따른 구조 복잡도 증가",
  ];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">About Me</h2>

        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            저는 단순히 기능을 구현하는 개발자가 아니라,{" "}
            <strong className="text-gray-900 font-semibold">
              서비스가 실제로 운영되는 환경을 전제로 설계하는 백엔드 엔지니어
            </strong>
            입니다.
          </p>

          <p className="text-gray-600 leading-relaxed">
            실서비스 <span className="font-semibold text-gray-800">Fingoo</span>
            의 설계·개발·운영을 경험하며 아래와 같은 문제들을 반복적으로 다뤄왔습니다.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            {challenges.map((challenge, index) => (
              <div
                key={challenge}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{challenge}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-600 leading-relaxed">
              이 포트폴리오는 제가 어떤{" "}
              <span className="text-gray-400">기술을 썼는지</span>보다 어떤{" "}
              <strong className="text-gray-900">
                문제를 어떻게 바라보고 해결하는지
              </strong>
              를 보여주기 위한 문서입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

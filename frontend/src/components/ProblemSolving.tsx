export default function ProblemSolving() {
  const questions = [
    "이 기능은 확장될 가능성이 있는가?",
    "데이터 구조는 변경될 수 있는가?",
    "운영 중 어떤 에러가 발생할 수 있는가?",
  ];

  const architecture = [
    { layer: "Client", description: null },
    { layer: "Controller", description: "요청 검증 / 응답 포맷" },
    { layer: "Service", description: "비즈니스 규칙" },
    { layer: "Repository", description: "데이터 접근" },
    { layer: "Database", description: null },
  ];

  const principles = [
    "비즈니스 로직은 Service에 집중",
    "Controller는 최대한 얇게 유지",
    "데이터 접근 로직 분리",
  ];

  return (
    <section id="approach" className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Problem-Solving Approach</h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">문제 정의 방식</h3>
            <p className="text-gray-600 mb-6">
              제가 가장 중요하게 보는 것은{" "}
              <strong className="text-gray-900">
                &quot;지금 요구사항이 아니라, 다음 요구사항&quot;
              </strong>
              입니다.
            </p>

            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100"
                >
                  <span className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-sm font-mono">
                    ?
                  </span>
                  <span className="text-gray-700">{question}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-500 mt-4 text-sm">이 질문을 기준으로 설계를 시작합니다.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">설계 원칙</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="space-y-2">
                  {architecture.map((item, index) => (
                    <div key={item.layer}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`px-4 py-2 rounded-lg text-sm font-mono ${
                            index === 0 || index === architecture.length - 1
                              ? "bg-gray-100 text-gray-600"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          {item.layer}
                        </div>
                        {item.description && (
                          <span className="text-gray-500 text-sm">→ {item.description}</span>
                        )}
                      </div>
                      {index < architecture.length - 1 && (
                        <div className="ml-6 my-1 text-gray-300">↓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div
                    key={principle}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100"
                  >
                    <span className="w-6 h-6 bg-gray-800 text-white rounded flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{principle}</span>
                  </div>
                ))}

                <p className="text-sm text-gray-500 mt-4 p-4 bg-gray-100 rounded-lg">
                  이는 Fingoo 실서비스에서 검증된 구조이며, 규모에 따라 단순화·확장이 모두
                  가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

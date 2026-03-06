export default function Learnings() {
  const learnings = [
    {
      statement: "구조는 속도를 늦추지 않는다",
      insight: "속도를 유지하게 만든다",
    },
    {
      statement: "요구사항은 반드시 변한다",
      insight: "변화를 전제로 설계해야 한다",
    },
    {
      statement: "운영 경험 없는 설계는 한계가 있다",
      insight: null,
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Learnings</h2>

        <div className="space-y-4">
          {learnings.map((item) => (
            <div
              key={item.statement}
              className="p-6 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <span className="text-lg text-gray-900 font-medium">{item.statement}</span>
                {item.insight && (
                  <>
                    <span className="hidden md:block text-gray-300">→</span>
                    <span className="text-gray-600">
                      <span className="md:hidden">→ </span>
                      {item.insight}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-600 text-center">
            이러한 관점은{" "}
            <strong className="text-gray-900">실제 서비스를 운영하며 체득한 경험</strong>
            에서 비롯되었습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

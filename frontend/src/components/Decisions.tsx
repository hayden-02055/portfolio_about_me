export default function Decisions() {
  const cases = [
    {
      title: "빠른 개발 vs 구조",
      points: [
        "단기적으로는 코드량이 늘어남",
        "장기적으로는 수정 비용 감소",
        "실제 운영 단계에서 이점이 분명히 드러남",
      ],
    },
    {
      title: "단순 구현 vs 추상화",
      points: [
        "과도한 추상화는 지양",
        "변경 가능성이 높은 영역만 분리",
        "실서비스 기준으로 판단",
      ],
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Decision &amp; Trade-offs</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((caseItem, index) => (
            <div key={caseItem.title} className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{caseItem.title}</h3>
              </div>

              <ul className="space-y-3">
                {caseItem.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

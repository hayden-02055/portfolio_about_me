export default function TechStack() {
  const technologies = [
    { category: "Backend", tech: "NestJS (TypeScript)", primary: true },
    { category: "Database", tech: "PostgreSQL", primary: true },
    { category: "ORM", tech: "TypeORM", primary: false },
    { category: "Infra", tech: "Docker, AWS EC2", primary: false },
    { category: "Auth", tech: "JWT", primary: false },
    { category: "Version Control", tech: "GitHub", primary: false },
  ];

  const criteria = [
    { principle: '"유행"보다', value: "운영 안정성" },
    { principle: '"복잡함"보다', value: "명확한 책임 분리" },
    { principle: '"빠른 구현"보다', value: "지속 가능한 구조" },
  ];

  return (
    <section id="tech" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Technology Stack</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-3">
              {technologies.map((item) => (
                <div
                  key={`${item.category}-${item.tech}`}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.primary
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-700 border-gray-100"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-400">{item.category}</span>
                  <span className={`font-semibold ${item.primary ? "text-white" : "text-gray-900"}`}>
                    {item.tech}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">기술 선택 기준</h3>

            <div className="space-y-4">
              {criteria.map((item) => (
                <div key={item.principle} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 text-sm line-through">{item.principle}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  <span className="text-gray-900 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

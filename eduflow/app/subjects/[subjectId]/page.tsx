import { subjects } from "@/types";

export default function SubjectOverviewPage({
  params,
}: {
  params: { subjectId: string };
}) {
  const subject = subjects.find((s) => s.id === params.subjectId) ?? subjects[0];

  return (
    <main className="page-enter">
      <section className="shell">
        <div className="glass-panel" style={{ padding: 28 }}>
          <span className="pill pill-amber">{subject.category}</span>
          <h2 style={{ marginTop: 16, marginBottom: 10 }}>{subject.title}</h2>
          <p style={{ maxWidth: 620 }}>{subject.subtitle}</p>
        </div>
      </section>
    </main>
  );
}


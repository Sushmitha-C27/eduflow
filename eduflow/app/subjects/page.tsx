import { subjects } from "@/types";
import { SubjectCard } from "@/components/subjects/SubjectCard";

export default function SubjectsPage() {
  return (
    <main className="page-enter">
      <section className="shell" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              fontStyle: "italic",
              margin: "0 0 10px",
              color: "var(--text-1)",
            }}
          >
            All Subjects
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>
            Published series from the EduFlow studio.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
    </main>
  );
}
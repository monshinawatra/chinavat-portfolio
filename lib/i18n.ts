// UI copy, intro, and education in both languages. Terminal commands
// (find / cd / ls / %) stay English on purpose — they're the shell vocabulary.

export const INTRO = {
  en: {
    name: "Chinavat",
    tagline:
      "I'm a passionate developer and ML engineer focused on innovation, with experience across AI, games, and robotics.",
    cv: "cv.pdf",
  },
  th: {
    name: "ชินวัตร",
    tagline:
      "นักพัฒนาและ ML Engineer ที่คลั่งไคล้ในเทคโนโลยีและนวัตกรรมใหม่ ๆ มีประสบการณ์สนุก ๆ ในการทำทั้ง AI เกม และหุ่นยนต์",
    cv: "cv.pdf",
  },
} as const;

export const EDUCATION = {
  en: {
    label: "education",
    degree: "B.Sc. Applied Computer Science",
    school: "King Mongkut's University of Technology Thonburi (KMUTT)",
    status: "Graduated 2026 · GPAX 3.69",
    note: "Petchra Pra Jom Klao scholarship.",
  },
  th: {
    label: "การศึกษา",
    degree: "วท.บ. วิทยาการคอมพิวเตอร์ประยุกต์",
    school: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.)",
    status: "จบการศึกษาปี 2026 · GPAX 3.69",
    note: "ทุนเพชรพระจอมเกล้า",
  },
} as const;

export const UI = {
  en: {
    year: "year",
    tag: "tag",
    showingAll: (n: number) => `showing all ${n}`,
    matches: (n: number) => `${n} ${n === 1 ? "match" : "matches"}`,
    clear: "clear ✕",
    noMatches: "— no matches —",
    empty: "— empty —",
  },
  th: {
    year: "ปี",
    tag: "แท็ก",
    showingAll: (n: number) => `ทั้งหมด ${n} รายการ`,
    matches: (n: number) => `เจอ ${n} รายการ`,
    clear: "ล้าง ✕",
    noMatches: "— ไม่พบข้อมูล —",
    empty: "— ว่าง —",
  },
} as const;

export type IntroStrings = { name: string; tagline: string; cv: string };
export type EducationStrings = {
  label: string;
  degree: string;
  school: string;
  status: string;
  note: string;
};
export type UIStrings = {
  year: string;
  tag: string;
  showingAll: (n: number) => string;
  matches: (n: number) => string;
  clear: string;
  noMatches: string;
  empty: string;
};

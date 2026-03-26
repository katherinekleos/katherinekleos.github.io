export const featuredPost = {
  title: "Not Everything Needs to Be Manual: Small Excel Tools That Changed My Workflow",
  description:
    "A practical reflection on overlooked Excel tools in research administration, including Office Scripts, Focus Cell, and simple Excel dashboards.",
  href: "/blog/excel-tools",
  image: "/assets/excel-tools-header.png",
  date: "2026-03-24",
  displayDate: "March 24, 2026",
  tags: ["Excel", "Workflow", "Tools"],
};

const allOtherPosts = [
  {
    title: "The Use of Restorative Practices in Research Administration",
    description:
      "How restorative practices can help research administrators recognize tension early, defuse conflict, and protect working relationships across departments, PIs, and central offices.",
    href: "/blog/restorative-practices",
    image: "/assets/restorative-practices-header.png",
    date: "2026-03-25",
    displayDate: "March 25, 2026",
    tags: ["Restorative Practices", "Communication", "Research Administration"],
  },
  {
    title: "AI in Research Administration: Types, Use Cases, and Tradeoffs",
    description:
      "A reflection on how AI is showing up in research administration, the different types of tools, and the benefits and risks of using them in structured work.",
    href: "/blog/ai-in-research",
    image: "/assets/ai-robots-header.png",
    date: "2026-03-25",
    displayDate: "March 25, 2026",
    tags: ["AI", "Automation"],
  },
  {
    title: "When the System Resets: Institutional Knowledge During Platform Transitions",
    description:
      "A reflection on institutional knowledge, system transitions, and what becomes visible when institutions reset the platforms they rely on.",
    href: "/blog/system-resets",
    image: "/assets/page-under-transition.png",
    date: "2026-03-25",
    displayDate: "March 25, 2026",
    tags: ["Systems", "Institutional Knowledge", "Transition"],
  },
];

export const recentPosts = [...allOtherPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
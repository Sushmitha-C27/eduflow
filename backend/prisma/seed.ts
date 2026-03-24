import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("test123");

  const user = await prisma.user.upsert({
    where: { email: "test@eduflow.com" },
    update: {},
    create: {
      email: "test@eduflow.com",
      name: "Test User",
      passwordHash,
    },
  });

  const subjectsData = [
    {
      title: "JavaScript Mastery",
      slug: "javascript-mastery",
      description: "Deep dive into modern JavaScript from fundamentals to advanced patterns.",
      isPublished: true,
      sections: [
        {
          title: "JS Foundations",
          videos: [
            {
              title: "JavaScript Full Course",
              youtubeUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            },
            {
              title: "JavaScript ES6 Features",
              youtubeUrl: "https://www.youtube.com/watch?v=NCwa_xi0Uuc",
            },
            {
              title: "Asynchronous JavaScript",
              youtubeUrl: "https://www.youtube.com/watch?v=PoRJizFvM7s",
            },
          ],
        },
        {
          title: "Advanced Concepts",
          videos: [
            {
              title: "JavaScript OOP",
              youtubeUrl: "https://www.youtube.com/watch?v=PFmuCDHHpwk",
            },
            {
              title: "JavaScript Functional Programming",
              youtubeUrl: "https://www.youtube.com/watch?v=e-5obm1G_FY",
            },
            {
              title: "JavaScript Debugging",
              youtubeUrl: "https://www.youtube.com/watch?v=H0XScE08hvU",
            },
          ],
        },
        {
          title: "Projects",
          videos: [
            {
              title: "Build 15 JavaScript Projects",
              youtubeUrl: "https://www.youtube.com/watch?v=3PHXvlpOkf4",
            },
            {
              title: "JavaScript Algorithms and Data Structures",
              youtubeUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
            },
            {
              title: "Clean Code JavaScript",
              youtubeUrl: "https://www.youtube.com/watch?v=UjhX2sVf0eg",
            },
          ],
        },
      ],
    },
    {
      title: "Python for Beginners",
      slug: "python-for-beginners",
      description: "Learn Python from scratch using practical examples and exercises.",
      isPublished: true,
      sections: [
        {
          title: "Getting Started",
          videos: [
            {
              title: "Python for Beginners",
              youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            },
            {
              title: "Python Functions",
              youtubeUrl: "https://www.youtube.com/watch?v=NSbOtYzIQI0",
            },
            {
              title: "Python Lists and Dictionaries",
              youtubeUrl: "https://www.youtube.com/watch?v=W8KRzm-HUcc",
            },
          ],
        },
        {
          title: "Working with Data",
          videos: [
            {
              title: "Python File Handling",
              youtubeUrl: "https://www.youtube.com/watch?v=Uh2ebFW8OYM",
            },
            {
              title: "Python OOP",
              youtubeUrl: "https://www.youtube.com/watch?v=JeznW_7DlB0",
            },
            {
              title: "Python Modules and Packages",
              youtubeUrl: "https://www.youtube.com/watch?v=CqvZ3vGoGs0",
            },
          ],
        },
        {
          title: "Projects",
          videos: [
            {
              title: "Python Projects for Beginners",
              youtubeUrl: "https://www.youtube.com/watch?v=8ext9G7xspg",
            },
            {
              title: "Automate with Python",
              youtubeUrl: "https://www.youtube.com/watch?v=VchuKL44s6E",
            },
            {
              title: "Build a Web Scraper in Python",
              youtubeUrl: "https://www.youtube.com/watch?v=ng2o98k983k",
            },
          ],
        },
      ],
    },
    {
      title: "React & Next.js",
      slug: "react-nextjs",
      description: "Modern React and Next.js development with real-world projects.",
      isPublished: true,
      sections: [
        {
          title: "React Essentials",
          videos: [
            {
              title: "React JS Full Course",
              youtubeUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            },
            {
              title: "React Hooks",
              youtubeUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
            },
            {
              title: "React State Management",
              youtubeUrl: "https://www.youtube.com/watch?v=35lXWvCuM8o",
            },
          ],
        },
        {
          title: "Next.js Basics",
          videos: [
            {
              title: "Next.js Full Course",
              youtubeUrl: "https://www.youtube.com/watch?v=1WmNXEVia8I",
            },
            {
              title: "Next.js Routing",
              youtubeUrl: "https://www.youtube.com/watch?v=IkOVe40Sy0U",
            },
            {
              title: "Next.js Data Fetching",
              youtubeUrl: "https://www.youtube.com/watch?v=xtItzwYG6oQ",
            },
          ],
        },
        {
          title: "Full Projects",
          videos: [
            {
              title: "React & Next.js SaaS App",
              youtubeUrl: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
            },
            {
              title: "Build a Dashboard with Next.js",
              youtubeUrl: "https://www.youtube.com/watch?v=hZ1DASYd9rk",
            },
            {
              title: "Deploying Next.js Apps",
              youtubeUrl: "https://www.youtube.com/watch?v=DJvM2lSPn6w",
            },
          ],
        },
      ],
    },
  ];

  for (const subject of subjectsData) {
    const createdSubject = await prisma.subject.create({
      data: {
        title: subject.title,
        slug: subject.slug,
        description: subject.description,
        isPublished: subject.isPublished,
      },
    });

    let sectionOrder = 1;
    for (const section of subject.sections) {
      const createdSection = await prisma.section.create({
        data: {
          subjectId: createdSubject.id,
          title: section.title,
          orderIndex: sectionOrder++,
        },
      });

      let videoOrder = 1;
      for (const video of section.videos) {
        await prisma.video.create({
          data: {
            sectionId: createdSection.id,
            title: video.title,
            youtubeUrl: video.youtubeUrl,
            orderIndex: videoOrder++,
          },
        });
      }
    }
  }

  console.log(`Seeded database with test user ${user.email} and subjects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


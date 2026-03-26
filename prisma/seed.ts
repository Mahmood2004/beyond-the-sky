import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // 1. SUPER ADMIN
  const superadmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin1@example.com",
      password: "123456",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  });

  // 2. NORMAL USER
  const normalUser = await prisma.user.create({
    data: {
      name: "Normal User",
      email: "user1@example.com",
      password: "123456",
    },
  });

  // 3. SERVICE
  const service = await prisma.service.create({
    data: {
      title: "Telescope Observation Sessions",
      icon: "telescope",
      description:
        "Guided observation sessions using advanced telescopes to explore planets, galaxies, and deep-sky phenomena.",
      features: [
        "Live sky tracking",
        "Expert-guided walkthroughs",
        "HD imaging capture",
        "Remote access support",
        "Session recording",
      ],
    },
  });

  // 4. PROJECT
  const project = await prisma.project.create({
    data: {
      title: "Milky Way Dark Matter Mapping",
      category: "Astrophysics",
      excerpt:
        "A gravitational lensing study mapping dark matter distribution across the Milky Way.",
      content:
        "This project focuses on analyzing gravitational lensing data to map the unseen dark matter structure across our galaxy.",
      objectives: [
        "Map dark matter distribution",
        "Analyze gravitational lensing",
        "Compare galactic models",
      ],
      techStack: ["Spectroscopy", "Radio Astronomy", "Data Modeling", "Python"],
      status: "ACTIVE",
      bannerURL: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
    },
  });

  // 5. BLOG
  const blog = await prisma.blog.create({
    data: {
      title: "The fark Matter Problem: What the Universe Is Hiding",
      category: "Astrophysics",
      excerpt:
        "An exploration of dark matter — what it is and how scientists are trying to detect it.",
      content:
        "Dark matter makes up most of the universe’s mass, yet we cannot see it. Scientists rely on indirect observations like gravitational lensing.",
      bannerURL: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
      isPublished: true,
      authorId: superadmin.id,
    },
  });

  // 6. NEWS
  const news = await prisma.news.create({
    data: {
      title: "JWST Detects Carbon Dioxide in Atmosphere of Distant Super-Earth",
      excerpt:
        "Breakthrough discovery confirms CO2 in a habitable-zone exoplanet.",
      content:
        "Using advanced infrared instruments, the James Webb Space Telescope has detected carbon dioxide in the atmosphere of a distant super-Earth.",
      bannerURL: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4",
      referenceURLs: [
        "https://www.nasa.gov/missions/webb/",
        "https://www.esa.int/Science_Exploration/Space_Science/Webb",
      ],
    },
  });

  // 7. SUBMISSION (PROJECT INTEREST)
  await prisma.submission.create({
    data: {
      userId: normalUser.id,
      projectId: project.id,
      name: normalUser.name,
      email: normalUser.email,
      subject: "Interested in Dark Matter Research",
      message:
        "I would like to participate in the dark matter mapping project.",
      type: "PROJECT_INTEREST",
    },
  });

  // 8. SUBMISSION (CONTACT)
  await prisma.submission.create({
    data: {
      userId: normalUser.id,
      name: normalUser.name,
      email: normalUser.email,
      subject: "Astronomy Programs Inquiry",
      message:
        "Hello, I would like more information about your astronomy programs.",
      type: "CONTACT",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

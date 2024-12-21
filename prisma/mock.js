import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const ARTICLES_COUNT = 50;
const CATEGORIES_COUNT = 10;
const COURSES_COUNT = 100;
const CHAPTERS_COUNT = 500;
const USERS_COUNT = 200;
const LIKES_COUNT = 1000;

async function createMockData() {
  try {
    // Create Articles
    const articles = Array.from({ length: ARTICLES_COUNT }, () => ({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(1),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    // Create Categories
    const categories = Array.from({ length: CATEGORIES_COUNT }, () => ({
      name: faker.commerce.department(),
      rank: faker.number.int({ min: 1, max: 10 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    // Create Users
    const users = Array.from({ length: USERS_COUNT }, () => ({
      email: faker.internet.email(),
      username: faker.internet.username(),
      nickname: faker.person.firstName(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
      sex: faker.helpers.arrayElement(["MALE", "FEMALE", "UNKNOWN"]),
      company: faker.company.name(),
      introduce: faker.lorem.sentence(),
      role: faker.helpers.arrayElement(["NORMAL", "ADMIN"]),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    // Create data in sequence
    await prisma.articles.createMany({ data: articles });
    await prisma.categories.createMany({ data: categories });
    await prisma.users.createMany({ data: users });

    // Get created categories and users for reference
    const createdCategories = await prisma.categories.findMany();
    const createdUsers = await prisma.users.findMany();

    // Create Courses
    const courses = Array.from({ length: COURSES_COUNT }, () => ({
      categoryId: faker.helpers.arrayElement(createdCategories).id,
      userId: faker.helpers.arrayElement(createdUsers).id,
      name: faker.lorem.words(3),
      image: faker.image.url(),
      recommended: faker.datatype.boolean(),
      introductory: faker.datatype.boolean(),
      content: faker.lorem.paragraphs(5),
      likesCount: faker.number.int({ min: 0, max: 1000 }),
      chaptersCount: faker.number.int({ min: 1, max: 20 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    await prisma.courses.createMany({ data: courses });

    // Get created courses for reference
    const createdCourses = await prisma.courses.findMany();

    // Create Chapters
    const chapters = Array.from({ length: CHAPTERS_COUNT }, () => ({
      courseId: faker.helpers.arrayElement(createdCourses).id,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      video: faker.internet.url(),
      rank: faker.number.int({ min: 1, max: 10 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    await prisma.chapters.createMany({ data: chapters });

    // Create Likes
    const likes = Array.from({ length: LIKES_COUNT }, () => ({
      userId: faker.helpers.arrayElement(createdUsers).id,
      courseId: faker.helpers.arrayElement(createdCourses).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    await prisma.likes.createMany({ data: likes });

    // Create Settings
    await prisma.settings.create({
      data: {
        name: faker.company.name(),
        icp: faker.string.alphanumeric(15),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    });

    console.log("Successfully created all mock data");
  } catch (error) {
    console.error("Error creating mock data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the mock data generation
createMockData();

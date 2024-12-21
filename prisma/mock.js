import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const ARTICLES_COUNT = 50; // Number of mock articles to generate

async function createMockArticles() {
  try {
    const articles = [];

    for (let i = 0; i < ARTICLES_COUNT; i++) {
      const article = {
        title: faker.lorem.sentence(), // Generates a unique title
        content: faker.lorem.paragraphs(3), // Generates 3 paragraphs of content
        createdAt: faker.date.past(), // Random date in the past
        updatedAt: faker.date.recent(), // Recent date
      };
      articles.push(article);
    }

    // Batch create articles
    const createdArticles = await prisma.articles.createMany({
      data: articles,
      skipDuplicates: true, // Skip if title already exists (since it's unique)
    });

    console.log(`Successfully created ${createdArticles.count} mock articles`);
  } catch (error) {
    console.error('Error creating mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the mock data generation
createMockArticles();

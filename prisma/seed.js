const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const slug = 'i-am-a-hostage';

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    console.log('Seed post already exists, skipping.');
    return;
  }

  const post = await prisma.post.create({
    data: {
      slug,
      title: 'I am a hostage. Statistically, so are you.',
      description:
        "Recruiters in your LinkedIn inbox aren't real. Here's a way to only talk to humans.",
      published: new Date('2026-04-28'),
      content: `I am a hostage. Statistically, so are you.

Recruiters in your LinkedIn inbox aren't real. Here's a way to only talk to humans.

---

*This is a placeholder. Replace with the actual article content from Peter Duris.*`,
    },
  });

  const categoryName = 'Career';
  let category = await prisma.category.findUnique({ where: { name: categoryName } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName } });
  }

  await prisma.postCategory.create({
    data: { postId: post.id, categoryId: category.id },
  });

  console.log('Seeded post:', post.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

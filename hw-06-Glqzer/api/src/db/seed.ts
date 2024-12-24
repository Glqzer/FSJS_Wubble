import { db, connection } from "./index";
import { decks, cards } from "./schema"; // Import both tables
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(cards); // Delete cards first to avoid foreign key issues
  await db.delete(decks);

  // Reset the auto-increment counters
  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name IN ('decks', 'cards')`,
  );

  console.log("Inserting new seed data...");

  const languages = [
    "English",
    "Chinese",
    "Korean",
    "Spanish",
    "Italian",
    "French",
    "German",
    "Portuguese",
    "Japanese",
    "Russian",
    "Finnish",
    "Vietnamese",
  ];

  // Iterate through the languages to create one deck per language
  for (const language of languages) {
    // Insert the deck with the language title
    const insertedDeck = await db
      .insert(decks)
      .values({
        title: language,
        date: new Date(), // Current date as Unix timestamp
        numberOfCards: 0, // This will be updated later
      })
      .returning({ lastInsertRowid: sql`last_insert_rowid()` });
    const deckId = insertedDeck[0]?.lastInsertRowid as number;

    // Insert between 10 and 20 cards for each deck
    const numberOfCards = faker.number.int({ min: 10, max: 20 });
    for (let j = 0; j < numberOfCards; j++) {
      await db.insert(cards).values({
        deckId,
        front: faker.lorem.sentence({ min: 3, max: 10 }), // Random front content
        back: faker.lorem.sentence({ min: 5, max: 15 }),  // Random back content
        date: new Date(), // Current date as Unix timestamp
      });
    }
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });

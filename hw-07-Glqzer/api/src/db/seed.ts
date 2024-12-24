import { hash } from "@node-rs/argon2";
import { db, connection } from "./index";
import { decks, cards, users } from "./schema"; // Import both tables
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(cards); // Delete cards first to avoid foreign key issues
  await db.delete(decks);
  await db.delete(users);

  // Reset the auto-increment counters
  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name IN ('decks', 'cards', 'users')`,
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
    "Arabic",
    "Hindi",
    "Bengali",
    "Swahili",
    "Turkish",
    "Dutch",
    "Polish",
    "Thai",
    "Greek",
    "Norwegian",
    "Swedish",
    "Danish",
    "Czech",
    "Hungarian",
    "Indonesian",
    "Hebrew",
    "Malay",
    "Urdu",
    "Persian",
    "Tamil",
    "Telugu",
    "Punjabi",
    "Ukrainian",
    "Bulgarian",
    "Slovak",
    "Serbian",
    "Croatian",
    "Estonian",
    "Latvian",
    "Lithuanian",
    "Romanian",
    "Georgian",
    "Armenian",
    "Kazakh",
    "Mongolian",
    "Zulu",
    "Xhosa",
    "Sesotho",
    "Shona",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Afrikaans",
    "Pashto",
    "Kurdish",
    "Sinhala",
    "Nepali",
    "Tibetan",
    "Lao",
    "Khmer",
    "Burmese",
    "Tagalog",
    "Cebuano",
    "Ilocano",
    "Bisaya",
    "Maori",
    "Samoan",
    "Tongan",
    "Fijian",
    "Inuit",
    "Hawaiian",
    "Basque",
    "Catalan",
    "Galician",
    "Occitan",
    "Scottish Gaelic",
    "Irish",
    "Welsh",
    "Cornish",
    "Breton",
    "Esperanto",
    "Latgalian",
    "Tatar",
    "Uzbek",
    "Turkmen",
    "Tajik",
    "Kyrgyz",
    "Uyghur",
    "Azerbaijani",
    "Bashkir",
    "Chuvash",
    "Yakut",
    "Cherokee",
    "Navajo",
    "Quechua",
    "Aymara",
    "Guarani",
    "Mapuche",
    "Nahuatl",
    "Mayan",
    "Twi",
    "Fula",
    "Wolof",
    "Mandinka",
    "Bambara",
    "Sanskrit",
    "Pali",
    "Akkadian",
    "Hittite",
    "Aramaic",
    "Coptic",
    "Latin",
    "Old Norse",
    "Old English",
    "Ancient Greek",
    "Tocharian",
    "Sogdian",
    "Prakrit"
];

  

    // Create sample users
    const sampleUsers = [];
    for (let i = 1; i <= 5; i++) {
      const user = await db
        .insert(users)
        .values({
          name: faker.person.fullName(),
          username: `user-${i}`,
          password_hash: await hash(`pass-${i}`),
        })
        .returning()
        .get();
      sampleUsers.push(user);
    }

  // Iterate through the languages to create one deck per language
  for (const language of languages) {
    // Insert the deck with the language title
    const randomUser = faker.helpers.arrayElement(sampleUsers);
    const insertedDeck = await db
      .insert(decks)
      .values({
        title: language,
        date: new Date(), // Current date as Unix timestamp
        numberOfCards: 0, // This will be updated later
        userId: randomUser.id,
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
        userId: randomUser.id,
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

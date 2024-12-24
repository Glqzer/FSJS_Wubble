import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, connection } from "./index";

async function runMigrations() {
  console.log("Running migrations...");

  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./drizzle" });

  db.run(
    `DROP TRIGGER IF EXISTS increment_card_count;`
  );
  
  db.run(
    `DROP TRIGGER IF EXISTS decrement_card_count;`
  );
  
  db.run(`
      CREATE TRIGGER increment_card_count
      AFTER INSERT ON cards
      BEGIN
          UPDATE decks
          SET numberOfCards = numberOfCards + 1
          WHERE id = NEW.deck_id;
      END;
    `);
  
  db.run(`
      CREATE TRIGGER decrement_card_count
      AFTER DELETE ON cards
      BEGIN
          UPDATE decks
          SET numberOfCards = numberOfCards - 1
          WHERE id = OLD.deck_id;
      END;
    `);

  console.log("Migrations completed successfully.");
}

runMigrations()
  .catch((e) => {
    console.error("Migration failed:");
    console.error(e);
  })
  .finally(() => {
    // Don't forget to close the connection, otherwise the script will hang
    connection.close();
  });

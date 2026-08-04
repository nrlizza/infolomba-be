import db from './src/config/db.config.js';

async function main() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS favorite_lomba (
                id_favorite SERIAL PRIMARY KEY,
                id_user INT NOT NULL,
                id_lomba INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(id_user, id_lomba),
                FOREIGN KEY (id_user) REFERENCES master_user(id_user) ON DELETE CASCADE,
                FOREIGN KEY (id_lomba) REFERENCES lomba(id_lomba) ON DELETE CASCADE
            )
        `);
        console.log('Table favorite_lomba created');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();

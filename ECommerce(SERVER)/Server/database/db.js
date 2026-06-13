import pkg from 'pg';
const { Client } = pkg;

// Use DATABASE_URL (Render/production) or individual vars (local)
const database = process.env.DATABASE_URL
  ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Render PostgreSQL
    })
  : new Client({
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "ecommerce_store",
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || "5432",
    });

export const connectDB = async () => {
    try {
        await database.connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export default database;
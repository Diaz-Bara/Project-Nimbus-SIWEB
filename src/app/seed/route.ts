import postgres from "postgres";
import bcrypt from "bcrypt";

// 🔥 koneksi database dari .env
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

// ================= USERS =================
async function seedUsers(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email TEXT UNIQUE,
      password TEXT
    );
  `;

  const users = [
    { name: "Admin", email: "admin", password: "admin123" },
    { name: "Operator", email: "operator", password: "operator123" },
  ];

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

// ================= SHIPMENTS =================
async function seedShipments(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS shipments (
      id SERIAL PRIMARY KEY,
      awb TEXT,
      origin TEXT,
      destination TEXT,
      weight INT,
      pieces INT,
      status TEXT
    );
  `;

  await sql`
    INSERT INTO shipments (awb, origin, destination, weight, pieces, status)
    VALUES
    ('PET-48201-QX', 'Jakarta', 'Singapore', 425, 12, 'In Transit'),
    ('PET-11023-AL', 'Surabaya', 'Melbourne', 1120, 48, 'Pending QC')
    ON CONFLICT DO NOTHING;
  `;
}

// ================= FLIGHTS =================
async function seedFlights(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS flights (
      id SERIAL PRIMARY KEY,
      code TEXT,
      from_city TEXT,
      to_city TEXT,
      status TEXT
    );
  `;

  await sql`
    INSERT INTO flights (code, from_city, to_city, status)
    VALUES
    ('PT-882', 'Jakarta', 'Singapore', 'ACTIVE'),
    ('PT-914', 'Singapore', 'Hong Kong', 'DELAYED')
    ON CONFLICT DO NOTHING;
  `;
}

// ================= MAIN ROUTE =================
export async function GET() {
  try {
    const result = await sql.begin(async (sql) => {
      await seedUsers(sql);
      await seedShipments(sql);
      await seedFlights(sql);
    });

    return Response.json({
      message: "Database seeded successfully 🚀",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Seeding failed ❌" },
      { status: 500 }
    );
  }
}
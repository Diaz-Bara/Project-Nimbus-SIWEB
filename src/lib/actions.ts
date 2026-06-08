"use server";

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getPasswordForUser } from '@/lib/user-credentials';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
export { sql };
const ITEMS_PER_PAGE = 4;

export async function getNextAwb(): Promise<string> {
  const result = await sql`SELECT COUNT(*)::int AS count FROM shipments`;
  const count = result[0]?.count || 0;
  const nextNum = count + 1;
  return `AWB-${String(nextNum).padStart(3, '0')}`;
}

const SERVICE_RATES: Record<string, number> = {
  "Express Priority": 50000,
  "Standard Cargo": 30000,
  "Economy Cargo": 20000,
};

type UserFormData = {
  name: string;
  email: string;
  empId: string;
  role: string;
  terminal: string;
  status: string;
};

const userSeedData = [
  { name: "Boas Salosa", email: "op1@nimbus.cargo", empId: "ADM-99210", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "12 minutes" },
  { name: "Jay Idzes", email: "op2@nimbus.cargo", empId: "ADM-88432", role: "ADMIN", terminal: "CGK-Main", status: "ACTIVE", verified: true, lastLogin: "2 hours" },
  { name: "Bambang Pamungkas", email: "op3@nimbus.cargo", empId: "OPR-77001", role: "OPERATOR", terminal: "DPS-Terminal", status: "INACTIVE", verified: false, lastLogin: "3 days" },
  { name: "Justin Hubner", email: "op4@nimbus.cargo", empId: "OPR-88544", role: "OPERATOR", terminal: "KNO-Gateway", status: "ACTIVE", verified: true, lastLogin: "5 minutes" },
  { name: "Ayu Kartika", email: "op5@nimbus.cargo", empId: "OPR-92184", role: "OPERATOR", terminal: "SUB-Terminal", status: "ACTIVE", verified: true, lastLogin: "28 minutes" },
  { name: "Raka Pratama", email: "op6@nimbus.cargo", empId: "ADM-11872", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "47 minutes" },
  { name: "Maya Santoso", email: "op7@nimbus.cargo", empId: "OPR-45821", role: "OPERATOR", terminal: "CGK-Cargo", status: "ACTIVE", verified: true, lastLogin: "1 hour" },
  { name: "Fajar Akbar", email: "op8@nimbus.cargo", empId: "OPR-61339", role: "OPERATOR", terminal: "BDO-Gateway", status: "ACTIVE", verified: true, lastLogin: "4 hours" },
  { name: "Nadia Putri", email: "op9@nimbus.cargo", empId: "OPR-50218", role: "OPERATOR", terminal: "MES-Station", status: "INACTIVE", verified: false, lastLogin: "5 days" },
  { name: "Dimas Surya", email: "op10@nimbus.cargo", empId: "ADM-34980", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "6 hours" },
  { name: "Lina Kartika", email: "op11@nimbus.cargo", empId: "OPR-73042", role: "OPERATOR", terminal: "CGK-Main", status: "ACTIVE", verified: true, lastLogin: "8 hours" },
  { name: "Seno Wibowo", email: "op12@nimbus.cargo", empId: "OPR-64127", role: "OPERATOR", terminal: "DPS-Terminal", status: "ACTIVE", verified: true, lastLogin: "9 hours" },
  { name: "Clara Wijaya", email: "op13@nimbus.cargo", empId: "ADM-27091", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "11 hours" },
  { name: "Yusuf Hadi", email: "op14@nimbus.cargo", empId: "OPR-87420", role: "OPERATOR", terminal: "KNO-Gateway", status: "ACTIVE", verified: true, lastLogin: "1 day" },
  { name: "Rani Amelia", email: "op15@nimbus.cargo", empId: "OPR-39514", role: "OPERATOR", terminal: "SUB-Terminal", status: "ACTIVE", verified: false, lastLogin: "1 day" },
  { name: "Kevin Sanjaya", email: "op16@nimbus.cargo", empId: "OPR-55418", role: "OPERATOR", terminal: "CGK-Cargo", status: "INACTIVE", verified: false, lastLogin: "8 days" },
  { name: "Siti Rahma", email: "op17@nimbus.cargo", empId: "OPR-20773", role: "OPERATOR", terminal: "BDO-Gateway", status: "ACTIVE", verified: true, lastLogin: "2 days" },
  { name: "Andi Wijaya", email: "op18@nimbus.cargo", empId: "ADM-77845", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "2 days" },
  { name: "Dewi Lestari", email: "op19@nimbus.cargo", empId: "OPR-69034", role: "OPERATOR", terminal: "MES-Station", status: "ACTIVE", verified: true, lastLogin: "3 days" },
  { name: "Hendra Gunawan", email: "op20@nimbus.cargo", empId: "OPR-81163", role: "OPERATOR", terminal: "CGK-Main", status: "ACTIVE", verified: true, lastLogin: "4 days" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatLastLogin(value: Date | string | null) {
  if (!value) return "Never";

  const date = value instanceof Date ? value : new Date(value);
  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

function mapUserRow(row: any) {
  return {
    id: Number(row.id),
    initials: getInitials(row.name || ""),
    name: row.name || "",
    email: row.email || "",
    empId: row.emp_id || "",
    role: (row.role || "OPERATOR").toUpperCase(),
    terminal: row.terminal || "General Access",
    lastLogin: formatLastLogin(row.last_login),
    status: (row.status || "ACTIVE").toUpperCase(),
  };
}

async function ensureUserSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `;

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS emp_id TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS terminal TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`;

  await sql`UPDATE users SET role = UPPER(role) WHERE role IS NOT NULL`;
  await sql`UPDATE users SET status = UPPER(status) WHERE status IS NOT NULL`;

  for (const user of userSeedData) {
    const passwordHash = await bcrypt.hash(getPasswordForUser(user.email), 10);

    await sql`
      INSERT INTO users (
        name,
        email,
        password,
        role,
        emp_id,
        terminal,
        status,
        verified,
        last_login
      )
      VALUES (
        ${user.name},
        ${user.email},
        ${passwordHash},
        ${user.role},
        ${user.empId},
        ${user.terminal},
        ${user.status},
        ${user.verified},
        NOW() - (${user.lastLogin})::interval
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        emp_id = EXCLUDED.emp_id,
        terminal = EXCLUDED.terminal,
        status = EXCLUDED.status,
        verified = EXCLUDED.verified,
        last_login = COALESCE(users.last_login, EXCLUDED.last_login),
        updated_at = NOW()
    `;
  }
}

const flightSeedData = [
  {
    code: "PT-882",
    aircraft: "Boeing 777-F",
    origin_code: "CGK",
    origin_city: "Jakarta",
    destination_code: "SIN",
    destination_city: "Singapore",
    departure_time: "08:45",
    arrival_time: "10:30",
    status: "ACTIVE",
    progress: 65,
    capacity_tons: 60,
    used_tons: 48,
  },
  {
    code: "PT-914",
    aircraft: "Airbus A330-200F",
    origin_code: "SIN",
    origin_city: "Singapore",
    destination_code: "HKG",
    destination_city: "Hong Kong",
    departure_time: "11:15",
    arrival_time: "15:45",
    status: "DELAY",
    progress: 20,
    capacity_tons: 55,
    used_tons: 42,
  },
  {
    code: "PT-115",
    aircraft: "Boeing 747-8F",
    origin_code: "CGK",
    origin_city: "Jakarta",
    destination_code: "NRT",
    destination_city: "Tokyo",
    departure_time: "13:00",
    arrival_time: "21:15",
    status: "SCHEDULED",
    progress: 0,
    capacity_tons: 70,
    used_tons: 35,
  },
  {
    code: "PT-552",
    aircraft: "Airbus A350-F",
    origin_code: "HKG",
    origin_city: "Hong Kong",
    destination_code: "LHR",
    destination_city: "London",
    departure_time: "16:20",
    arrival_time: "05:10",
    status: "ACTIVE",
    progress: 25,
    capacity_tons: 65,
    used_tons: 51,
  },
  {
    code: "PT-771",
    aircraft: "Boeing 767-F",
    origin_code: "CGK",
    origin_city: "Jakarta",
    destination_code: "DPS",
    destination_city: "Denpasar",
    departure_time: "18:10",
    arrival_time: "20:05",
    status: "ACTIVE",
    progress: 80,
    capacity_tons: 45,
    used_tons: 38,
  },
  {
    code: "PT-330",
    aircraft: "Airbus A321P2F",
    origin_code: "SUB",
    origin_city: "Surabaya",
    destination_code: "KNO",
    destination_city: "Medan",
    departure_time: "09:30",
    arrival_time: "12:10",
    status: "SCHEDULED",
    progress: 0,
    capacity_tons: 32,
    used_tons: 18,
  },
];

async function ensureFlightSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS flights (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE,
      status TEXT
    )
  `;

  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS aircraft TEXT`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS origin_code TEXT`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS origin_city TEXT`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS destination_code TEXT`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS destination_city TEXT`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS departure_time TIME`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS arrival_time TIME`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS capacity_tons INT DEFAULT 0`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS used_tons INT DEFAULT 0`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`;
  await sql`ALTER TABLE flights ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`;

  for (const flight of flightSeedData) {
    await sql`
      INSERT INTO flights (
        code,
        aircraft,
        origin_code,
        origin_city,
        destination_code,
        destination_city,
        departure_time,
        arrival_time,
        status,
        progress,
        capacity_tons,
        used_tons
      )
      VALUES (
        ${flight.code},
        ${flight.aircraft},
        ${flight.origin_code},
        ${flight.origin_city},
        ${flight.destination_code},
        ${flight.destination_city},
        ${flight.departure_time},
        ${flight.arrival_time},
        ${flight.status},
        ${flight.progress},
        ${flight.capacity_tons},
        ${flight.used_tons}
      )
      ON CONFLICT (code) DO UPDATE SET
        aircraft = COALESCE(flights.aircraft, EXCLUDED.aircraft),
        origin_code = COALESCE(flights.origin_code, EXCLUDED.origin_code),
        origin_city = COALESCE(flights.origin_city, EXCLUDED.origin_city),
        destination_code = COALESCE(flights.destination_code, EXCLUDED.destination_code),
        destination_city = COALESCE(flights.destination_city, EXCLUDED.destination_city),
        departure_time = COALESCE(flights.departure_time, EXCLUDED.departure_time),
        arrival_time = COALESCE(flights.arrival_time, EXCLUDED.arrival_time),
        status = COALESCE(flights.status, EXCLUDED.status),
        progress = COALESCE(flights.progress, EXCLUDED.progress),
        capacity_tons = COALESCE(flights.capacity_tons, EXCLUDED.capacity_tons),
        used_tons = COALESCE(flights.used_tons, EXCLUDED.used_tons),
        updated_at = NOW()
    `;
  }
}

async function ensureCargoSchema() {
  await ensureFlightSchema();

  const tables = await sql`
    SELECT
      to_regclass('public.shipments') AS shipments,
      to_regclass('public.shipment_details') AS shipment_details
  `;

  if (!tables[0]?.shipments || !tables[0]?.shipment_details) {
    return;
  }

  await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_name TEXT`;
    await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS item_type TEXT`;
    await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`;
  await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`;
  await sql`ALTER TABLE shipment_details ADD COLUMN IF NOT EXISTS phone_number TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS tracking_logs (
      id SERIAL PRIMARY KEY,
      shipment_id INT REFERENCES shipments(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      location TEXT,
      note TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// ==========================================
// 1. AUTENTIKASI (LOGIN)
// ==========================================
/* moved */

export async function fetchUsers(query: string, currentPage: number) {
  await ensureUserSchema();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql`
      SELECT id, name, email, emp_id, role, terminal, last_login, status
      FROM users
      WHERE
        COALESCE(name, '') ILIKE ${`%${query}%`} OR
        COALESCE(email, '') ILIKE ${`%${query}%`} OR
        COALESCE(emp_id, '') ILIKE ${`%${query}%`} OR
        COALESCE(role, '') ILIKE ${`%${query}%`} OR
        COALESCE(terminal, '') ILIKE ${`%${query}%`} OR
        COALESCE(status, '') ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.map(mapUserRow);
  } catch (error) {
    console.error("Fetch users error:", error);
    return [];
  }
}

export async function fetchUsersCount(query: string) {
  await ensureUserSchema();

  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM users
      WHERE
        COALESCE(name, '') ILIKE ${`%${query}%`} OR
        COALESCE(email, '') ILIKE ${`%${query}%`} OR
        COALESCE(emp_id, '') ILIKE ${`%${query}%`} OR
        COALESCE(role, '') ILIKE ${`%${query}%`} OR
        COALESCE(terminal, '') ILIKE ${`%${query}%`} OR
        COALESCE(status, '') ILIKE ${`%${query}%`}
    `;

    return Number(count[0]?.count || 0);
  } catch (error) {
    console.error("Fetch users count error:", error);
    return 0;
  }
}

export async function fetchUsersPages(query: string) {
  const totalUsers = await fetchUsersCount(query);
  return Math.ceil(totalUsers / ITEMS_PER_PAGE);
}

export async function fetchUserStats() {
  await ensureUserSchema();

  try {
    const data = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status ILIKE 'ACTIVE')::int AS active,
        COUNT(*) FILTER (WHERE status ILIKE 'ACTIVE' AND verified IS TRUE)::int AS verified_active
      FROM users
    `;

    const total = Number(data[0]?.total || 0);
    const active = Number(data[0]?.active || 0);
    const verifiedActive = Number(data[0]?.verified_active || 0);

    return {
      total,
      active,
      verifiedActive,
      verifiedPercent: active > 0 ? Math.round((verifiedActive / active) * 1000) / 10 : 0,
    };
  } catch (error) {
    console.error("Fetch user stats error:", error);
    return { total: 0, active: 0, verifiedActive: 0, verifiedPercent: 0 };
  }
}

export async function fetchRecentAccessLogs(limit = 3) {
  await ensureUserSchema();

  try {
    const data = await sql`
      SELECT name, terminal, role, last_login, status
      FROM users
      WHERE last_login IS NOT NULL
      ORDER BY last_login DESC
      LIMIT ${limit}
    `;

    return data.map((item) => ({
      name: item.name || "Unknown employee",
      terminal: item.terminal || "General Access",
      role: (item.role || "OPERATOR").toUpperCase(),
      status: (item.status || "ACTIVE").toUpperCase(),
      lastLogin: formatLastLogin(item.last_login),
    }));
  } catch (error) {
    console.error("Fetch recent access logs error:", error);
    return [];
  }
}

export async function saveUserAction(userData: UserFormData, id?: number) {
  await ensureUserSchema();

  const UserSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi."),
    email: z.string().email("Email tidak valid."),
    empId: z.string().min(1, "Employee ID wajib diisi."),
    role: z.enum(["ADMIN", "OPERATOR"]),
    terminal: z.string().min(1, "Terminal wajib diisi."),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  });

  const parsed = UserSchema.safeParse({
    ...userData,
    empId: userData.empId?.toUpperCase(),
    role: userData.role?.toUpperCase(),
    status: userData.status?.toUpperCase(),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Form user belum lengkap atau formatnya tidak sesuai.",
    };
  }

  const data = parsed.data;

  try {
    const result = id
      ? await sql`
          UPDATE users
          SET
            name = ${data.name},
            email = ${data.email.toLowerCase()},
            emp_id = ${data.empId},
            role = ${data.role},
            terminal = ${data.terminal},
            status = ${data.status},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, name, email, emp_id, role, terminal, last_login, status
        `
      : await sql`
          INSERT INTO users (
            name,
            email,
            password,
            emp_id,
            role,
            terminal,
            status,
            verified,
            last_login
          )
          VALUES (
            ${data.name},
            ${data.email.toLowerCase()},
            ${await bcrypt.hash("password123", 10)},
            ${data.empId},
            ${data.role},
            ${data.terminal},
            ${data.status},
            TRUE,
            NOW()
          )
          RETURNING id, name, email, emp_id, role, terminal, last_login, status
        `;

    revalidatePath("/users");
    return { success: true, user: mapUserRow(result[0]) };
  } catch (error) {
    console.error("Save user error:", error);
    return {
      success: false,
      error: "Gagal menyimpan user ke database. Periksa email agar tidak duplikat.",
    };
  }
}

// ==========================================
// 2. ZOD VALIDATION SCHEMA (ERROR HANDLING TEXT)
// ==========================================
const ShipmentSchema = z.object({
  awb: z.string().min(1, "AWB tidak boleh kosong."),
  sender_name: z.string().min(1, "Nama pengirim wajib diisi."),
  recipient_name: z.string().min(1, "Nama penerima wajib diisi."),
  weight: z.coerce.number().gt(0, "Berat harus lebih dari 0."),
      status: z.string().min(1, "Status wajib dipilih."),
  shipping_date: z.string().min(1, "Tanggal kirim wajib diisi."),
  service_level: z.string().min(1, "Jenis pengiriman wajib dipilih."),
  item_type: z.string().min(1, "Jenis barang wajib diisi."),
    description: z.string().min(1, "Deskripsi wajib diisi."),
  origin: z.string().min(1, "Kota asal wajib diisi."),
  destination: z.string().min(1, "Kota tujuan wajib diisi."),
  phone_number: z
    .string()
    .regex(/^[0-9+ -]{8,15}$/, "Nomor telepon harus 8-15 digit/karakter.")
});

// ==========================================
// 3. CRUDS DATABASE
// ==========================================
export async function fetchShipments(query: string, currentPage: number) {
  await ensureCargoSchema();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT
        s.id,
        s.awb,
        COALESCE(s.sender_name, '') AS sender_name,
        s.weight,
                COALESCE(s.price, 0) AS price,
        s.status,
        s.shipping_date,
        s.service_level,
        s.description,
        COALESCE(s.item_type, '') AS item_type,
                sd.origin,
        sd.destination,
        sd.recipient_name,
        sd.phone_number
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE
        s.awb ILIKE ${`%${query}%`} OR
        COALESCE(s.sender_name, '') ILIKE ${`%${query}%`} OR
        COALESCE(s.item_type, '') ILIKE ${`%${query}%`} OR
        sd.recipient_name ILIKE ${`%${query}%`} OR
        sd.origin ILIKE ${`%${query}%`} OR
        sd.destination ILIKE ${`%${query}%`}
      ORDER BY s.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data as any[];
  } catch (error) {
    console.error("Fetch shipments error:", error);
    return [];
  }
}

export async function fetchShipmentsPages(query: string) {
  await ensureCargoSchema();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE
        s.awb ILIKE ${`%${query}%`} OR
        COALESCE(s.sender_name, '') ILIKE ${`%${query}%`} OR
        COALESCE(s.item_type, '') ILIKE ${`%${query}%`} OR
        sd.recipient_name ILIKE ${`%${query}%`} OR
        sd.origin ILIKE ${`%${query}%`} OR
        sd.destination ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    return 0;
  }
}

export async function fetchShipmentById(id: number) {
  await ensureCargoSchema();
  try {
    const data = await sql`
      SELECT
        s.id,
        s.awb,
        COALESCE(s.sender_name, '') AS sender_name,
        s.weight,
                COALESCE(s.price, 0) AS price,
        s.status,
        s.shipping_date,
        s.service_level,
        s.description,
        COALESCE(s.item_type, '') AS item_type,
                sd.origin,
        sd.destination,
        sd.recipient_name,
        sd.phone_number
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE s.id = ${id}
      LIMIT 1
    `;

    return data[0] || null;
  } catch (error) {
    console.error("Fetch shipment by id error:", error);
    return null;
  }
}

export async function fetchShipmentStats() {
  await ensureCargoSchema();
  try {
    const data = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status ILIKE '%transit%')::int AS in_transit,
        COUNT(*) FILTER (WHERE status ILIKE '%deliver%')::int AS delivered,
        COUNT(*) FILTER (WHERE status ILIKE '%cancel%')::int AS canceled
      FROM shipments
    `;
    return {
      total: Number(data[0]?.total || 0),
      inTransit: Number(data[0]?.in_transit || 0),
      delivered: Number(data[0]?.delivered || 0),
      canceled: Number(data[0]?.canceled || 0),
    };
  } catch (error) {
    console.error("Fetch shipment stats error:", error);
    return { total: 0, inTransit: 0, delivered: 0, canceled: 0 };
  }
}

export async function fetchRecentShipments(limit = 5) {
  await ensureCargoSchema();
  try {
    const data = await sql`
      SELECT s.id, s.awb, s.status, sd.origin, sd.destination, s.created_at
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      ORDER BY s.id DESC
      LIMIT ${limit}
    `;

    return data as any[];
  } catch (error) {
    console.error("Fetch recent shipments error:", error);
    return [];
  }
}

export async function fetchFlights(query: string, currentPage: number) {
  await ensureFlightSchema();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql`
      SELECT
        id,
        code,
        COALESCE(aircraft, 'Cargo Aircraft') AS aircraft,
        COALESCE(origin_code, 'CGK') AS origin_code,
        COALESCE(origin_city, 'Jakarta') AS origin_city,
        COALESCE(destination_code, 'SIN') AS destination_code,
        COALESCE(destination_city, 'Singapore') AS destination_city,
        TO_CHAR(COALESCE(departure_time, TIME '08:00'), 'HH24:MI') AS departure_time,
        TO_CHAR(COALESCE(arrival_time, TIME '10:00'), 'HH24:MI') AS arrival_time,
        COALESCE(status, 'SCHEDULED') AS status,
        COALESCE(progress, 0) AS progress,
        COALESCE(capacity_tons, 0) AS capacity_tons,
        COALESCE(used_tons, 0) AS used_tons
      FROM flights
      WHERE
        code ILIKE ${`%${query}%`} OR
        COALESCE(aircraft, '') ILIKE ${`%${query}%`} OR
        COALESCE(origin_code, '') ILIKE ${`%${query}%`} OR
        COALESCE(origin_city, '') ILIKE ${`%${query}%`} OR
        COALESCE(destination_code, '') ILIKE ${`%${query}%`} OR
        COALESCE(destination_city, '') ILIKE ${`%${query}%`} OR
        COALESCE(status, '') ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data as any[];
  } catch (error) {
    console.error("Fetch flights error:", error);
    return [];
  }
}

export async function fetchFlightsPages(query: string) {
  await ensureFlightSchema();

  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM flights
      WHERE
        code ILIKE ${`%${query}%`} OR
        COALESCE(aircraft, '') ILIKE ${`%${query}%`} OR
        COALESCE(origin_code, '') ILIKE ${`%${query}%`} OR
        COALESCE(origin_city, '') ILIKE ${`%${query}%`} OR
        COALESCE(destination_code, '') ILIKE ${`%${query}%`} OR
        COALESCE(destination_city, '') ILIKE ${`%${query}%`} OR
        COALESCE(status, '') ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Fetch flights pages error:", error);
    return 0;
  }
}

export async function fetchDashboardFlights(limit = 3) {
  await ensureFlightSchema();

  try {
    const data = await sql`
      SELECT
        id,
        code,
        COALESCE(status, 'SCHEDULED') AS status,
        TO_CHAR(COALESCE(departure_time, TIME '08:00'), 'HH24:MI') AS departure_time,
        TO_CHAR(COALESCE(arrival_time, TIME '10:00'), 'HH24:MI') AS arrival_time,
        COALESCE(origin_code, 'CGK') AS origin_code,
        COALESCE(destination_code, 'SIN') AS destination_code
      FROM flights
      ORDER BY
        CASE
          WHEN status ILIKE 'ACTIVE' THEN 1
          WHEN status ILIKE 'DELAY%' THEN 2
          ELSE 3
        END,
        id ASC
      LIMIT ${limit}
    `;

    return data as any[];
  } catch (error) {
    console.error("Fetch dashboard flights error:", error);
    return [];
  }
}

export async function fetchFlightStats() {
  await ensureFlightSchema();

  try {
    const data = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status ILIKE 'ACTIVE')::int AS active,
        COALESCE(SUM(capacity_tons), 0)::int AS capacity,
        COALESCE(SUM(used_tons), 0)::int AS used
      FROM flights
    `;

    const total = Number(data[0]?.total || 0);
    const active = Number(data[0]?.active || 0);
    const capacity = Number(data[0]?.capacity || 0);
    const used = Number(data[0]?.used || 0);

    return {
      total,
      active,
      capacity,
      used,
      efficiency: capacity > 0 ? Math.round((used / capacity) * 1000) / 10 : 0,
    };
  } catch (error) {
    console.error("Fetch flight stats error:", error);
    return { total: 0, active: 0, capacity: 0, used: 0, efficiency: 0 };
  }
}

export async function saveShipment(formData: any, isUpdate = false, id?: number) {
  const SERVICE_RATES: Record<string, number> = {
    "Express Priority": 50000,
    "Standard Cargo": 30000,
    "Economy Cargo": 20000,
  };

  // Enforce backend price calculation
  const weight = Number(formData.weight) || 0;
  const serviceLevel = formData.service_level || "Express Priority";
  const rate = SERVICE_RATES[serviceLevel] || 0;
  const price = weight * rate;

  let awb = formData.awb;
  if (!isUpdate) {
    // Auto-generate AWB if not provided
    if (!awb) {
      const result = await sql`SELECT COUNT(*)::int AS count FROM shipments`;
      const count = result[0]?.count || 0;
      awb = `AWB-${String(count + 1).padStart(3, '0')}`;
    }
  }

  try {
    await sql.begin(async (sql) => {
      if (isUpdate && id) {
        await sql`
          UPDATE shipments 
          SET
            sender_name = ${formData.sender_name},
            weight = ${weight},
            price = ${price},
            status = ${formData.status},
            shipping_date = ${formData.shipping_date},
            service_level = ${serviceLevel},
            description = ${formData.description},
            item_type = ${formData.item_type || ''},
            updated_at = NOW()
          WHERE id = ${id}
        `;
        await sql`
          UPDATE shipment_details 
          SET
            origin = ${formData.origin},
            destination = ${formData.destination},
            recipient_name = ${formData.recipient_name},
            phone_number = ${formData.phone_number}
          WHERE shipment_id = ${id}
        `;
      } else {
        const newShipment = await sql`
          INSERT INTO shipments (
            awb,
            customer_id,
            flight_id,
            sender_name,
            weight,
            price,
            status,
            shipping_date,
            service_level,
            description,
            item_type
          )
          VALUES (
            ${awb},
            1,
            1,
            ${formData.sender_name},
            ${weight},
            ${price},
            ${formData.status || 'In Transit'},
            ${formData.shipping_date},
            ${serviceLevel},
            ${formData.description || ''},
            ${formData.item_type || ''}
          )
          RETURNING id
        `;
        const newId = newShipment[0].id;
        
        await sql`
          INSERT INTO shipment_details (shipment_id, origin, destination, recipient_name, phone_number)
          VALUES (${newId}, ${formData.origin}, ${formData.destination}, ${formData.recipient_name}, ${formData.phone_number})
        `;
      }
    });

    revalidatePath("/shipments");
    return { success: true };
  } catch (error) {
    console.error("Save shipment error:", error);
    return { success: false, error: "Gagal menyimpan data shipment." };
  }
}

export async function deleteShipmentAction(id: number) {
  await ensureCargoSchema();
  try {
    await sql`DELETE FROM shipments WHERE id = ${id}`;
    revalidatePath('/shipments');
    return { success: true };
  } catch (error) {
    console.error("Delete shipment error:", error);
    return { success: false, error: "Gagal menghapus shipment." };
  }
}

export async function getTrackingByAwb(awb: string) {
  await ensureCargoSchema();

  try {
    const shipment = await sql`
      SELECT
        s.id,
        s.awb,
        s.status,
        s.service_level,
        s.weight,
        COALESCE(s.price, 0) AS price,
        sd.origin,
        sd.destination,
        sd.recipient_name
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE LOWER(s.awb) = LOWER(${awb})
      LIMIT 1
    `;

    if (!shipment[0]) {
      return { success: false, error: "AWB tidak ditemukan." };
    }

    const history = await sql`
      SELECT status, location, note, created_at
      FROM tracking_logs
      WHERE shipment_id = ${shipment[0].id}
      ORDER BY created_at ASC, id ASC
    `;

    return {
      success: true,
      shipment: shipment[0],
      history: history.map((item) => ({
        status: item.status,
        location: item.location,
        note: item.note,
        created_at: item.created_at?.toISOString?.() || item.created_at,
      })),
    };
  } catch (error) {
    console.error("Tracking error:", error);
    return { success: false, error: "Gagal mengambil data tracking." };
  }
}

export async function fetchTrackingOverview() {
  await ensureCargoSchema();

  try {
    const shipments = await fetchRecentShipments(1);
    const shipment = shipments[0];

    if (!shipment) {
      return { shipment: null, history: [] };
    }

    const history = await sql`
      SELECT status, location, note, created_at
      FROM tracking_logs
      WHERE shipment_id = ${shipment.id}
      ORDER BY created_at ASC, id ASC
    `;

    return {
      shipment,
      history: history.map((item) => ({
        status: item.status,
        location: item.location,
        note: item.note,
        created_at: item.created_at?.toISOString?.() || item.created_at,
      })),
    };
  } catch (error) {
    console.error("Fetch tracking overview error:", error);
    return { shipment: null, history: [] };
  }
}

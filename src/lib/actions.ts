"use server";

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 4;

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
  await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pieces INT DEFAULT 1`;
  await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS item_type TEXT`;
  await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS vehicle_type TEXT`;
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
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email atau password salah.';
        default:
          return 'Terjadi kesalahan sistem.';
      }
    }
    throw error;
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
  pieces: z.coerce.number().int().gt(0, "Jumlah pieces harus lebih dari 0."),
  price: z.coerce.number().gte(0, "Tarif pengiriman tidak boleh negatif."),
  status: z.string().min(1, "Status wajib dipilih."),
  shipping_date: z.string().min(1, "Tanggal kirim wajib diisi."),
  service_level: z.string().min(1, "Jenis pengiriman wajib dipilih."),
  item_type: z.string().min(1, "Jenis barang wajib diisi."),
  vehicle_type: z.string().min(1, "Jenis kendaraan wajib diisi."),
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
        COALESCE(s.pieces, 1) AS pieces,
        COALESCE(s.price, 0) AS price,
        s.status,
        s.shipping_date,
        s.service_level,
        s.description,
        COALESCE(s.item_type, '') AS item_type,
        COALESCE(s.vehicle_type, '') AS vehicle_type,
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
        COALESCE(s.pieces, 1) AS pieces,
        COALESCE(s.price, 0) AS price,
        s.status,
        s.shipping_date,
        s.service_level,
        s.description,
        COALESCE(s.item_type, '') AS item_type,
        COALESCE(s.vehicle_type, '') AS vehicle_type,
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
        COUNT(*) FILTER (WHERE status ILIKE '%cancel%')::int AS canceled
      FROM shipments
    `;

    return {
      total: Number(data[0]?.total || 0),
      inTransit: Number(data[0]?.in_transit || 0),
      canceled: Number(data[0]?.canceled || 0),
    };
  } catch (error) {
    console.error("Fetch shipment stats error:", error);
    return { total: 0, inTransit: 0, canceled: 0 };
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

export async function saveShipment(formData: any, isUpdate: boolean, id?: number) {
  await ensureCargoSchema();
  try {
    // Mengecek kelengkapan dan tipe data form menggunakan Zod
    const validatedData = ShipmentSchema.safeParse(formData);
    
    // UGD: Pesan error form tidak lengkap/tipe tidak sesuai
    if (!validatedData.success) {
      console.error(validatedData.error.flatten());
      return { success: false, error: "Form tidak lengkap atau tipe data tidak sesuai DB. Mohon periksa kembali input Anda." };
    }

    if (isUpdate && id) {
      await sql`
        UPDATE shipments 
        SET
          awb = ${formData.awb},
          sender_name = ${formData.sender_name},
          weight = ${Number(formData.weight)},
          pieces = ${Number(formData.pieces)},
          price = ${Number(formData.price)},
          status = ${formData.status},
          shipping_date = ${formData.shipping_date},
          service_level = ${formData.service_level},
          description = ${formData.description},
          item_type = ${formData.item_type},
          vehicle_type = ${formData.vehicle_type},
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

      await sql`
        INSERT INTO tracking_logs (shipment_id, status, location, note)
        VALUES (${id}, ${formData.status}, ${formData.origin}, 'Shipment data updated')
      `;
    } else {
      const newShipment = await sql`
        INSERT INTO shipments (
          awb,
          customer_id,
          flight_id,
          sender_name,
          weight,
          pieces,
          price,
          status,
          shipping_date,
          service_level,
          description,
          item_type,
          vehicle_type
        )
        VALUES (
          ${formData.awb},
          1,
          1,
          ${formData.sender_name},
          ${Number(formData.weight)},
          ${Number(formData.pieces)},
          ${Number(formData.price)},
          ${formData.status},
          ${formData.shipping_date},
          ${formData.service_level},
          ${formData.description},
          ${formData.item_type},
          ${formData.vehicle_type}
        )
        RETURNING id
      `;
      const newId = newShipment[0].id;
      
      await sql`
        INSERT INTO shipment_details (shipment_id, origin, destination, recipient_name, phone_number)
        VALUES (${newId}, ${formData.origin}, ${formData.destination}, ${formData.recipient_name}, ${formData.phone_number})
      `;

      await sql`
        INSERT INTO tracking_logs (shipment_id, status, location, note)
        VALUES (${newId}, ${formData.status}, ${formData.origin}, 'Shipment created')
      `;
    }
    revalidatePath('/shipments');
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Gagal menyimpan data ke database." };
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
        s.pieces,
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

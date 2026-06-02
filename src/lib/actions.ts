"use server";

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 4;

async function ensureCargoSchema() {
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
        COUNT(*) FILTER (WHERE status ILIKE '%pending%' OR status ILIKE '%flag%')::int AS flagged
      FROM shipments
    `;

    return {
      total: Number(data[0]?.total || 0),
      inTransit: Number(data[0]?.in_transit || 0),
      flagged: Number(data[0]?.flagged || 0),
    };
  } catch (error) {
    console.error("Fetch shipment stats error:", error);
    return { total: 0, inTransit: 0, flagged: 0 };
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

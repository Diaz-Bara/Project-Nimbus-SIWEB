"use server";

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 4;

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
  weight: z.coerce.number().gt(0, "Berat harus lebih dari 0."),
  status: z.string().min(1, "Status wajib dipilih."),
  shipping_date: z.string().min(1, "Tanggal kirim wajib diisi."),
  service_level: z.string().min(1, "Jenis pengiriman wajib dipilih."),
  description: z.string().min(1, "Deskripsi wajib diisi."),
  origin: z.string().min(1, "Kota asal wajib diisi."),
  destination: z.string().min(1, "Kota tujuan wajib diisi."),
  phone_number: z.string().min(1, "No Telepon wajib diisi.")
});

// ==========================================
// 3. CRUDS DATABASE
// ==========================================
export async function fetchShipments(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT s.id, s.awb, s.weight, s.status, s.shipping_date, s.service_level, s.description,
             sd.origin, sd.destination, sd.phone_number, 12 AS pieces
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE s.awb ILIKE ${`%${query}%`} OR sd.origin ILIKE ${`%${query}%`} OR sd.destination ILIKE ${`%${query}%`}
      ORDER BY s.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data as any[];
  } catch (error) {
    throw new Error("Gagal mengambil data shipment.");
  }
}

export async function fetchShipmentsPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE s.awb ILIKE ${`%${query}%`} OR sd.origin ILIKE ${`%${query}%`} OR sd.destination ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    return 0;
  }
}

export async function saveShipment(formData: any, isUpdate: boolean, id?: number) {
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
        SET awb = ${formData.awb}, weight = ${formData.weight}, status = ${formData.status}, shipping_date = ${formData.shipping_date}, service_level = ${formData.service_level}, description = ${formData.description}
        WHERE id = ${id}
      `;
      await sql`
        UPDATE shipment_details 
        SET origin = ${formData.origin}, destination = ${formData.destination}, phone_number = ${formData.phone_number}
        WHERE shipment_id = ${id}
      `;
    } else {
      const newShipment = await sql`
        INSERT INTO shipments (awb, customer_id, flight_id, weight, price, status, shipping_date, service_level, description)
        VALUES (${formData.awb}, 1, 1, ${formData.weight}, 0, ${formData.status}, ${formData.shipping_date}, ${formData.service_level}, ${formData.description})
        RETURNING id
      `;
      const newId = newShipment[0].id;
      
      await sql`
        INSERT INTO shipment_details (shipment_id, origin, destination, recipient_name, phone_number)
        VALUES (${newId}, ${formData.origin}, ${formData.destination}, 'Penerima Reguler', ${formData.phone_number})
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
  try {
    await sql`DELETE FROM shipments WHERE id = ${id}`;
    revalidatePath('/shipments');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
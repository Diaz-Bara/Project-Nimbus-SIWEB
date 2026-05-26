"use server";

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 1. READ: Mengambil data dari database
export async function fetchShipments(query: string) {
  try {
    const data = await sql`
      SELECT 
        s.id, 
        s.awb, 
        s.weight, 
        s.status, 
        sd.origin, 
        sd.destination,
        12 AS pieces -- (Dummy pieces karena tidak ada di tabel)
      FROM shipments s
      JOIN shipment_details sd ON s.id = sd.shipment_id
      WHERE s.awb ILIKE ${`%${query}%`}
         OR sd.origin ILIKE ${`%${query}%`}
         OR sd.destination ILIKE ${`%${query}%`}
      ORDER BY s.id DESC
    `;
    return data as any[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Gagal mengambil data shipment.");
  }
}

// 2. CREATE & UPDATE: Menyimpan data ke database
export async function saveShipment(formData: any, isUpdate: boolean, id?: number) {
  try {
    if (isUpdate && id) {
      await sql`
        UPDATE shipments 
        SET awb = ${formData.awb}, weight = ${formData.weight}, status = ${formData.status}
        WHERE id = ${id}
      `;
      await sql`
        UPDATE shipment_details 
        SET origin = ${formData.origin}, destination = ${formData.destination}
        WHERE shipment_id = ${id}
      `;
    } else {
      // Create New
      const newShipment = await sql`
        INSERT INTO shipments (awb, customer_id, flight_id, weight, price, status)
        VALUES (${formData.awb}, 1, 1, ${formData.weight}, 0, ${formData.status})
        RETURNING id
      `;
      const newId = newShipment[0].id;
      
      await sql`
        INSERT INTO shipment_details (shipment_id, origin, destination, recipient_name)
        VALUES (${newId}, ${formData.origin}, ${formData.destination}, 'Penerima Default')
      `;
    }
    revalidatePath('/shipments');
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Gagal menyimpan data." };
  }
}

// 3. DELETE: Menghapus data dari database
export async function deleteShipmentAction(id: number) {
  try {
    await sql`DELETE FROM shipments WHERE id = ${id}`;
    revalidatePath('/shipments');
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}
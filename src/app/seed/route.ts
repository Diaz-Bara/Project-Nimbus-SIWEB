import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {
  try {
    const result = await sql.begin(async (sql) => {
      // DROP TABLE LAMA
      await sql`DROP TABLE IF EXISTS shipment_items, shipment_details, shipments, items, flights, customers, users CASCADE`;

      // ================= 1. MASTER: USERS =================
      await sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          email TEXT UNIQUE,
          password TEXT,
          role TEXT
        );
      `;
      const usersData = Array.from({ length: 10 }, (_, i) => ({
        name: `Operator ${i + 1}`,
        email: `op${i + 1}@nimbus.cargo`,
        password: "password123",
        role: i === 0 ? "Admin" : "Operator"
      }));

      for (const u of usersData) {
        const hash = await bcrypt.hash(u.password, 10);
        await sql`INSERT INTO users (name, email, password, role) VALUES (${u.name}, ${u.email}, ${hash}, ${u.role})`;
      }

      // ================= 2. MASTER: CUSTOMERS =================
      await sql`
        CREATE TABLE customers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          company TEXT
        );
      `;
      const customersData = [
        { name: "Andi Wijaya", company: "PT Tech Corp" },
        { name: "Siti Rahma", company: "CV Logistik Jaya" },
        { name: "Budi Sentosa", company: "PT Budi Sentosa Utama" },
        { name: "Dewi Lestari", company: "PT Global Impor" },
        { name: "Faisal Akbar", company: "Toko Maju" },
        { name: "Rina Melati", company: "Koperasi Makmur" },
        { name: "Hendra Gunawan", company: "PT Ekspor Cepat" },
        { name: "Maya Sari", company: "Sinar Mas" },
        { name: "Tono Supriatna", company: "Indo Trading" },
        { name: "Kevin Sanjaya", company: "PT Karya Anak Bangsa" }
      ];

      for (const cust of customersData) {
        await sql`INSERT INTO customers (name, company) VALUES (${cust.name}, ${cust.company})`;
      }

      // ================= 3. MASTER: FLIGHTS (KEMBALI KE STRUKTUR AWAL) =================
      await sql`
        CREATE TABLE flights (
          id SERIAL PRIMARY KEY,
          code TEXT UNIQUE,
          status TEXT
        );
      `;
      const flights = ["PT-882", "PT-914", "PT-115", "PT-552", "PT-771", "PT-330", "PT-999", "PT-202", "PT-404", "PT-505"];
      for (const code of flights) {
        await sql`INSERT INTO flights (code, status) VALUES (${code}, 'ACTIVE')`;
      }

      // ================= 4. MASTER: ITEMS =================
      await sql`
        CREATE TABLE items (
          id SERIAL PRIMARY KEY,
          name TEXT,
          category TEXT
        );
      `;
      const items = ["Elektronik", "Pakaian", "Makanan Kering", "Obat-obatan", "Dokumen", "Suku Cadang Mesin", "Kosmetik", "Mainan Anak", "Perabotan", "Bahan Kimia Aman"];
      for (const item of items) {
        await sql`INSERT INTO items (name, category) VALUES (${item}, 'General Cargo')`;
      }

      // ================= 5. TRANSAKSI: SHIPMENTS (DITAMBAH 3 KRITERIA BARU) =================
      // Menambahkan: shipping_date, service_level, description
      await sql`
        CREATE TABLE shipments (
          id SERIAL PRIMARY KEY,
          awb TEXT UNIQUE,
          customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
          flight_id INT REFERENCES flights(id) ON DELETE CASCADE,
          weight INT,
          price INT,
          status TEXT,
          shipping_date DATE,
          service_level TEXT,
          description TEXT
        );
      `;
      const awbs = ["AWB-001", "AWB-002", "AWB-003", "AWB-004", "AWB-005", "AWB-006", "AWB-007", "AWB-008", "AWB-009", "AWB-010"];
      const weights = [120, 450, 80, 1500, 310, 620, 95, 1100, 240, 500];
      const prices = [1500000, 4200000, 900000, 12500000, 3200000, 5800000, 1100000, 9800000, 2100000, 4500000];

      for (let i = 0; i < 10; i++) {
        const custId = i < 3 ? 1 : i + 1; 
        const flightId = i + 1;
        
        // Data dummy untuk 3 kolom baru
        const tglKirim = `2026-05-${String(i + 1).padStart(2, '0')}`;
        const serviceLvl = i % 2 === 0 ? 'Express Priority' : 'Standard Cargo';
        const desc = `Barang kargo batch ${i + 1} dalam kondisi baik.`;

        await sql`
          INSERT INTO shipments (awb, customer_id, flight_id, weight, price, status, shipping_date, service_level, description) 
          VALUES (${awbs[i]}, ${custId}, ${flightId}, ${weights[i]}, ${prices[i]}, 'In Transit', ${tglKirim}, ${serviceLvl}, ${desc})
        `;
      }

      // ================= 6. DETAIL TRANSAKSI: SHIPMENT_DETAILS (DITAMBAH 1 KRITERIA BARU) =================
      // Menambahkan: phone_number
      await sql`
        CREATE TABLE shipment_details (
          id SERIAL PRIMARY KEY,
          shipment_id INT UNIQUE REFERENCES shipments(id) ON DELETE CASCADE, 
          origin TEXT,
          destination TEXT,
          recipient_name TEXT,
          phone_number TEXT
        );
      `;
      for (let i = 1; i <= 10; i++) {
        const namaPenerima = `Penerima ${i}`;
        const noTelp = `0812345678${i.toString().padStart(2, '0')}`;
        
        await sql`INSERT INTO shipment_details (shipment_id, origin, destination, recipient_name, phone_number) VALUES (${i}, 'Jakarta', 'Singapore', ${namaPenerima}, ${noTelp})`;
      }

      // ================= 7. JUNCTION TABLE: SHIPMENT_ITEMS =================
      await sql`
        CREATE TABLE shipment_items (
          shipment_id INT REFERENCES shipments(id) ON DELETE CASCADE,
          item_id INT REFERENCES items(id) ON DELETE CASCADE,
          quantity INT,
          PRIMARY KEY (shipment_id, item_id)
        );
      `;
      const junctionData = [
        [1, 1], [1, 2], [1, 3],
        [2, 1], [2, 4],
        [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10], [9, 1], [10, 2]
      ];
      for (const data of junctionData) {
        await sql`INSERT INTO shipment_items (shipment_id, item_id, quantity) VALUES (${data[0]}, ${data[1]}, 10)`;
      }

    });

    return Response.json({ message: "Database seeded successfully! 4 Kriteria Tambahan (Tanpa detail kendaraan) berhasil ditambahkan 🚀" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Seeding failed ❌" }, { status: 500 });
  }
}
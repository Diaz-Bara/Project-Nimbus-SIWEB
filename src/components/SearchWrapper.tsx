import Search from "@/components/search";

export default async function SearchWrapper({ placeholder }: { placeholder: string }) {
  // Memberikan efek delay 1.5 detik agar sejajar dengan komponen lain
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return <Search placeholder={placeholder} />;
}
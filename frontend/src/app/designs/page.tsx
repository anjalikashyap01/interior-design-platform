
// "use client";

// import {  useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   publicDesignApi,
//   type Design,
// } from "@/lib/api";
// import Image from "next/image";

// export default function DesignsPage() {
//   const [designs, setDesigns] = useState<Design[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [roomType, setRoomType] = useState("");
//   const [style, setStyle] = useState("");

//   useEffect(() => {
//   let cancelled = false;

//   async function fetchDesigns() {
//     try {
//       setLoading(true);
//       setError("");

//       const result = await publicDesignApi.getDesigns({
//         search: search.trim() || undefined,
//         roomType: roomType || undefined,
//         style: style || undefined,
//       });

//       if (!cancelled) {
//         setDesigns(result.items ?? []);
//       }
//     } catch (err) {
//       if (!cancelled) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "Failed to load designs."
//         );
//       }
//     } finally {
//       if (!cancelled) {
//         setLoading(false);
//       }
//     }
//   }

//   void fetchDesigns();

//   return () => {
//     cancelled = true;
//   };
// }, [search, roomType, style]);

//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
//       <div className="mx-auto max-w-7xl">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
//             Explore Interior Designs
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Discover designs for your dream space.
//           </p>
//         </header>

//         <section className="mb-8 grid gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-3">
//           <input
//             type="search"
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search designs..."
//             className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
//           />

//           <select
//             value={roomType}
//             onChange={(event) => setRoomType(event.target.value)}
//             className="rounded-lg border border-gray-300 px-4 py-3"
//           >
//             <option value="">All room types</option>
//             <option value="living-room">Living Room</option>
//             <option value="bedroom">Bedroom</option>
//             <option value="kitchen">Kitchen</option>
//             <option value="bathroom">Bathroom</option>
//             <option value="dining-room">Dining Room</option>
//           </select>

//           <select
//             value={style}
//             onChange={(event) => setStyle(event.target.value)}
//             className="rounded-lg border border-gray-300 px-4 py-3"
//           >
//             <option value="">All styles</option>
//             <option value="modern">Modern</option>
//             <option value="minimalist">Minimalist</option>
//             <option value="traditional">Traditional</option>
//             <option value="indian">Indian</option>
//             <option value="royal">Royal</option>
//             <option value="aesthetic">Aesthetic</option>
//           </select>
//         </section>

//         {loading && (
//           <p className="py-12 text-center text-gray-600">
//             Loading designs...
//           </p>
//         )}

//         {!loading && error && (
//           <div className="rounded-lg bg-red-50 p-4 text-red-700">
//             <p>{error}</p>
//             <button
//   type="button"
//   onClick={() => window.location.reload()}
//   className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
// >
//   Try again
// </button>
//           </div>
//         )}

//         {!loading && !error && designs.length === 0 && (
//           <div className="rounded-xl bg-white p-10 text-center shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800">
//               No designs found
//             </h2>
//             <p className="mt-2 text-gray-600">
//               Try changing your search or filters.
//             </p>
//           </div>
//         )}

//         {!loading && !error && designs.length > 0 && (
//           <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {designs.map((design) => (
//               <article
//                 key={design._id}
//                 className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
//               >
//                 <Link href={`/designs/${design.slug}`}>
//                   <div className="aspect-4/3 bg-gray-200">
//                     {design.images?.[0]?.url ? (
//                       <Image
//                         src={design.images[0].url}
//                         alt={
//                           design.images[0].alt || design.title
//                         }
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <div className="flex h-full items-center justify-center text-gray-500">
//                         No image available
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-5">
//                     <div className="mb-2 flex flex-wrap gap-2">
//                       <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
//                         {design.roomType}
//                       </span>
//                       <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
//                         {design.style}
//                       </span>
//                     </div>

//                     <h2 className="text-xl font-semibold text-gray-900">
//                       {design.title}
//                     </h2>

//                     <p className="mt-2 line-clamp-3 text-sm text-gray-600">
//                       {design.description}
//                     </p>

//                     {(design.budgetMin !== undefined ||
//                       design.budgetMax !== undefined) && (
//                       <p className="mt-4 font-medium text-gray-800">
//                         Budget:{" "}
//                         {design.budgetMin !== undefined
//                           ? `₹${design.budgetMin.toLocaleString("en-IN")}`
//                           : "—"}
//                         {" – "}
//                         {design.budgetMax !== undefined
//                           ? `₹${design.budgetMax.toLocaleString("en-IN")}`
//                           : "—"}
//                       </p>
//                     )}
//                   </div>
//                 </Link>
//               </article>
//             ))}
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  publicDesignApi,
  type Design,
} from "@/lib/api";

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchDesigns = async () => {
      try {
        setError("");

        const result = await publicDesignApi.getDesigns({
          search: search.trim() || undefined,
          roomType: roomType || undefined,
          style: style || undefined,
        });

        if (!cancelled) {
          setDesigns(result.items ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load designs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchDesigns();

    return () => {
      cancelled = true;
    };
  }, [search, roomType, style, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Interior Designs
          </h1>

          <p className="mt-2 text-gray-600">
            Discover designs for your dream space.
          </p>
        </header>

        <section className="mb-8 grid gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setLoading(true);
              setSearch(event.target.value);
            }}
            placeholder="Search designs..."
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
          />

          <select
            value={roomType}
            onChange={(event) => {
              setLoading(true);
              setRoomType(event.target.value);
            }}
            className="rounded-lg border border-gray-300 px-4 py-3"
          >
            <option value="">All room types</option>
            <option value="living-room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="kitchen">Kitchen</option>
            <option value="bathroom">Bathroom</option>
            <option value="dining-room">Dining Room</option>
          </select>

          <select
            value={style}
            onChange={(event) => {
              setLoading(true);
              setStyle(event.target.value);
            }}
            className="rounded-lg border border-gray-300 px-4 py-3"
          >
            <option value="">All styles</option>
            <option value="modern">Modern</option>
            <option value="minimalist">Minimalist</option>
            <option value="traditional">Traditional</option>
            <option value="indian">Indian</option>
            <option value="royal">Royal</option>
            <option value="aesthetic">Aesthetic</option>
          </select>
        </section>

        {loading && (
          <p className="py-12 text-center text-gray-600">
            Loading designs...
          </p>
        )}

        {!loading && error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && designs.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No designs found
            </h2>

            <p className="mt-2 text-gray-600">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {!loading && !error && designs.length > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((design) => (
              <article
                key={design._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={`/designs/${design.slug}`}>
                  <div className="aspect-4/3 bg-gray-200">
                    {design.images?.[0]?.url ? (
                      <Image
                        src={design.images[0].url}
                        alt={design.title || "Interior design"}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {design.roomType}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {design.style}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900">
                      {design.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {design.description}
                    </p>

                    {(design.budgetMin !== undefined ||
                      design.budgetMax !== undefined) && (
                      <p className="mt-4 font-medium text-gray-800">
                        Budget:{" "}
                        {design.budgetMin !== undefined
                          ? `₹${design.budgetMin.toLocaleString("en-IN")}`
                          : "—"}
                        {" – "}
                        {design.budgetMax !== undefined
                          ? `₹${design.budgetMax.toLocaleString("en-IN")}`
                          : "—"}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
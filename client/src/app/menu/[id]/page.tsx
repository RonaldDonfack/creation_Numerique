"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchDish();
  }, [id]);

  const fetchDish = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        setDish(null);
      } else {
        setDish(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du plat:", err);
      setDish(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a120b] text-[#d4b27c]">
        <p className="text-2xl animate-pulse">Chargement du plat...</p>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a120b] text-[#d4b27c]">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Plat non trouvé</p>
          <button
            onClick={() => router.push("/menu")}
            className="px-5 py-2 bg-[#8b6f47] hover:bg-[#a98b5a] text-white rounded-lg font-semibold shadow-md transition"
          >
            ← Retour au menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a120b] to-[#3a2f24] text-[#f6e7d8] py-10 px-6">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-10">
        <button
          onClick={() => router.push("/menu")}
          className="px-5 py-2 bg-[#8b6f47] hover:bg-[#a98b5a] text-white rounded-lg font-semibold shadow-md transition"
        >
          ← Retour au menu
        </button>

        <button
          onClick={() => router.push(`/commentaire/${dish.id}`)}
          className="px-5 py-2 bg-[#8b6f47] hover:bg-[#a98b5a] text-white rounded-lg font-semibold shadow-md transition"
        >
          💬 Ajouter un Commentaire
        </button>
      </div>

      {/* PLAT DÉTAIL */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#f8f3e8] text-black rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          {/* IMAGE */}
          <img
            src={dish.image || "/placeholder.jpg"}
            alt={dish.title}
            className="w-full h-96 object-cover"
          />

          {/* CONTENU */}
          <div className="p-10">
            <h1 className="text-5xl font-bold text-[#3b2f2f] mb-4 tracking-wide">
              {dish.title}
            </h1>

            <p className="text-[#6b5a4a] text-lg leading-relaxed mb-8">
              {dish.description}
            </p>

            {/* PRIX */}
            <div className="flex items-center justify-between border-t border-[#d1c5b4] pt-6">
              <p className="text-4xl font-bold text-[#8b6f47]">
                {dish.price} €
              </p>

              <button
                onClick={() => router.push(`/commentaire/${dish.id}`)}
                className="px-8 py-3 bg-[#8b6f47] hover:bg-[#a98b5a] text-white text-lg rounded-lg font-semibold shadow-md transition"
              >
                💬 Commenter ce plat
              </button>
            </div>

            {/* INFOS SUPPLÉMENTAIRES */}
            <div className="mt-8 p-6 bg-[#f5f0e6] rounded-lg border border-[#d1c5b4]">
              <h3 className="text-xl font-semibold text-[#3b2f2f] mb-3">
                À propos de ce plat
              </h3>
              <p className="text-[#6b5a4a]">
                Découvrez les avis et commentaires des clients pour ce plat
                délicieux. Partez en quête des meilleures saveurs de notre
                restaurant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

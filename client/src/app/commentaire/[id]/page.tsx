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

interface Comment {
  id: string;
  menu_id: number;
  titre: string;
  contenu: string;
  user_id: string;
  created_at: string;
  user_email?: string;
}

export default function CommentairePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Formulaire
  const [commentTitle, setCommentTitle] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    if (id) {
      fetchDish();
      fetchComments();
    }
  }, [id]);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      console.log("❌ Pas d'utilisateur authentifié, redirection vers login");
      router.push(`/login?next=/commentaire/${id}`);
      return;
    }
    console.log("✅ Utilisateur authentifié:", data.user.id, data.user.email);
    setUser(data.user);
  };

  const fetchDish = async () => {
    try {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) {
        console.error("Erreur Supabase:", error);
        setDish(null);
      } else {
        setDish(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du plat:", err);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("commentaires")
        .select("*")
        .eq("menu_id", parseInt(id))
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur Supabase fetchComments:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        setComments([]);
      } else {
        setComments(data || []);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des commentaires:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage("❌ Vous devez être connecté pour commenter.");
      return;
    }

    if (!commentTitle.trim() || !commentContent.trim()) {
      setMessage("❌ Veuillez remplir tous les champs.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.from("commentaires").insert({
        menu_id: parseInt(id),
        titre: commentTitle,
        contenu: commentContent,
        user_id: user.id,
      });

      if (error) {
        console.error("Erreur Supabase handleSubmit:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        setMessage(
          "❌ Erreur lors de l'ajout du commentaire. Vérifiez les permissions.",
        );
      } else {
        setMessage("✅ Commentaire ajouté avec succès!");
        setCommentTitle("");
        setCommentContent("");
        await new Promise((resolve) => setTimeout(resolve, 500));
        fetchComments(); // Rafraîchir la liste
      }
    } catch (err) {
      console.error("Erreur catch handleSubmit:", err);
      setMessage("❌ Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a120b] text-[#d4b27c]">
        <p className="text-2xl animate-pulse">
          Vérification de l'authentification...
        </p>
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
      {/* HEADER */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-10">
        <button
          onClick={() => router.push("/menu")}
          className="px-5 py-2 bg-[#8b6f47] hover:bg-[#a98b5a] text-white rounded-lg font-semibold shadow-md transition"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-[#e5c58b]">Commentaires</h1>
      </div>

      {/* PLAT INFO */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="bg-[#f8f3e8] text-black rounded-2xl p-6 shadow-md flex items-center gap-6">
          <img
            src={dish.image || "/placeholder.jpg"}
            alt={dish.title}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-[#3b2f2f] mb-2">
              {dish.title}
            </h2>
            <p className="text-[#6b5a4a] mb-2">{dish.description}</p>
            <p className="text-[#8b6f47] text-xl font-semibold">
              {dish.price} €
            </p>
          </div>
        </div>
      </div>

      {/* FORMULAIRE COMMENTAIRE */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="bg-[#f8f3e8] text-black rounded-2xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-[#3b2f2f] mb-6">
            Ajouter votre commentaire
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6b5a4a] mb-2">
                Titre du commentaire
              </label>
              <input
                type="text"
                value={commentTitle}
                onChange={(e) => setCommentTitle(e.target.value)}
                placeholder="Ex: Délicieux!"
                className="w-full px-4 py-2 border border-[#d1c5b4] rounded-lg bg-white text-black focus:ring-2 focus:ring-[#8b6f47] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6b5a4a] mb-2">
                Votre commentaire
              </label>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Partagez votre avis..."
                rows={5}
                className="w-full px-4 py-2 border border-[#d1c5b4] rounded-lg bg-white text-black focus:ring-2 focus:ring-[#8b6f47] outline-none resize-none"
                required
              ></textarea>
            </div>

            {message && (
              <p className="text-center font-semibold text-[#3b2f2f]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-[#8b6f47] hover:bg-[#a98b5a] text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
            >
              {submitting ? "Envoi en cours..." : "💬 Envoyer le commentaire"}
            </button>
          </form>
        </div>
      </div>

      {/* COMMENTAIRES */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-[#e5c58b] mb-6">
          Commentaires ({comments.length})
        </h3>

        {loading ? (
          <p className="text-center text-[#d4b27c]">
            Chargement des commentaires...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-[#d4b27c]">
            Aucun commentaire pour le moment. Soyez le premier! 👇
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[#f8f3e8] text-black rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-[#3b2f2f]">
                    {comment.titre}
                  </h4>
                  <span className="text-sm text-[#6b5a4a]">
                    {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-[#6b5a4a] mb-2 leading-relaxed">
                  {comment.contenu}
                </p>
                <p className="text-xs text-[#8b6f47] font-semibold">
                  {comment.user_email || "Utilisateur"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

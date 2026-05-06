"""
S.HOT Chatbot Micro-Service
----------------------------
Serveur Flask sur le port 5005.
TF-IDF + cosine_similarity — zéro API externe.
Base de connaissances enrichie avec les données officielles S.HOT.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# BASE DE CONNAISSANCES S.HOT — FORMAT (variantes_questions, réponse)
# Les variantes sont séparées par des espaces pour enrichir le TF-IDF
# ---------------------------------------------------------------------------
knowledge_base = [

    # ── PRODUITS & GAMME ────────────────────────────────────────────────────
    (
        "produits gamme catalogue quels produits vendez vous que vendez vous "
        "baby shot spiruline diamonds powder tablets comprimés paillettes cristaux green gold",
        "S.HOT propose 3 gammes de spiruline premium :\n"
        "🌿 Baby S.HOTs (fioles, cure 30j) — 59 DT\n"
        "💎 Spiruline Diamonds (cristaux) — 59 DT\n"
        "🟢 Spiruline Powder Green Gold (poudre) — 59 DT\n"
        "💊 Spiruline Tablets (comprimés 100g) — 69 DT\n"
        "Chaque format est adapté à un usage différent. Lequel vous intéresse ?"
    ),

    # ── PRIX & TARIFS ───────────────────────────────────────────────────────
    (
        "prix tarif combien coûte coût baby shot diamonds powder tablets comprimés paillettes "
        "59 dt 69 dt cher pas cher promotion",
        "Voici les tarifs S.HOT :\n"
        "• Baby S.HOTs, Spiruline Diamonds, Spiruline Powder : 59 DT chacun\n"
        "• Spiruline Tablets (comprimés 100g) : 69 DT\n"
        "Tous nos produits sont fabriqués en Tunisie avec un pressage à froid pour préserver "
        "100% des nutriments actifs."
    ),

    # ── BABY S.HOTs ─────────────────────────────────────────────────────────
    (
        "baby shot fioles cure 30 jours ampoules liquide format pratique",
        "Les Baby S.HOTs sont des fioles de spiruline liquide, idéales pour une cure de 30 jours. "
        "Format pratique à emporter partout. Prix : 59 DT. "
        "Parfaits pour débuter ou pour les personnes qui n'aiment pas la poudre."
    ),

    # ── SPIRULINE DIAMONDS ──────────────────────────────────────────────────
    (
        "diamonds cristaux spiruline diamonds paillettes cristaux format premium",
        "La Spiruline Diamonds se présente sous forme de cristaux/paillettes séchés à froid. "
        "Ce format préserve au maximum la phycocyanine et la chlorophylle. Prix : 59 DT. "
        "Idéale saupoudrée sur les repas ou dans les smoothies."
    ),

    # ── SPIRULINE POWDER / GREEN GOLD ───────────────────────────────────────
    (
        "powder poudre green gold spiruline poudre verte smoothie masque beauté cuisine",
        "La Spiruline Powder Green Gold est une poudre fine polyvalente. Prix : 59 DT. "
        "Utilisations : smoothies, jus, masques visage, cuisine créative. "
        "Dose recommandée : 1 cuillère à café par jour (environ 3-5g)."
    ),

    # ── SPIRULINE TABLETS / COMPRIMÉS ───────────────────────────────────────
    (
        "tablets comprimés pilules gélules 100g spiruline comprimés pratique voyage",
        "Les Spiruline Tablets sont des comprimés de 100g. Prix : 69 DT. "
        "Posologie : 4 à 6 comprimés par jour, à avaler avec un grand verre d'eau. "
        "Format idéal pour les voyages et les personnes qui n'apprécient pas le goût de la spiruline."
    ),

    # ── TECHNOLOGIE & QUALITÉ ───────────────────────────────────────────────
    (
        "pressage froid technologie fabrication qualité phycocyanine chlorophylle "
        "conservation nutriments procédé production comment fabriqué",
        "S.HOT utilise le pressage à froid (cold-press), une technologie qui préserve "
        "intégralement la phycocyanine (pigment bleu antioxydant) et la chlorophylle. "
        "Contrairement au séchage à haute température, notre procédé garantit une spiruline "
        "vivante avec 100% de ses nutriments actifs."
    ),

    # ── COMPOSITION NUTRITIONNELLE ──────────────────────────────────────────
    (
        "composition valeurs nutritionnelles protéines fer vitamines b b12 acides aminés "
        "nutriments phycocyanine chlorophylle antioxydants minéraux",
        "La spiruline S.HOT contient :\n"
        "• 60% de protéines végétales complètes (tous les acides aminés essentiels)\n"
        "• Fer hautement biodisponible (anti-anémie)\n"
        "• Vitamines B1, B2, B3, B6, B9, B12\n"
        "• Phycocyanine (puissant antioxydant, renforce l'immunité)\n"
        "• Chlorophylle (détox, alcalinisant)\n"
        "• Bêta-carotène, magnésium, calcium, zinc"
    ),

    # ── SPORTIFS ────────────────────────────────────────────────────────────
    (
        "sport sportif musculation endurance récupération acide lactique performance "
        "athlète fitness gym entraînement énergie sport",
        "La spiruline S.HOT est le complément idéal des sportifs :\n"
        "💪 Récupération musculaire accélérée\n"
        "⚡ Boost d'endurance et réduction de la fatigue\n"
        "🔬 Réduction de l'acide lactique (moins de courbatures)\n"
        "🥩 60% de protéines végétales pour la construction musculaire\n"
        "Prendre 30 min avant l'entraînement pour un effet optimal."
    ),

    # ── ANÉMIE & FER ────────────────────────────────────────────────────────
    (
        "anémie fer carence manque fer hémoglobine fatigue chronique sang globules rouges",
        "La spiruline S.HOT est exceptionnellement riche en fer biodisponible — "
        "bien mieux absorbé que le fer des épinards. "
        "Pour maximiser l'absorption du fer : consommez-la le matin avec de la vitamine C "
        "(un jus d'orange frais). Évitez le thé et le café dans l'heure qui suit la prise, "
        "car les tanins bloquent l'absorption du fer."
    ),

    # ── IMMUNITÉ ────────────────────────────────────────────────────────────
    (
        "immunité défenses naturelles système immunitaire phycocyanine antioxydants "
        "maladies infections rhume grippe renforcer",
        "La phycocyanine contenue dans la spiruline S.HOT est un puissant immunostimulant. "
        "Elle stimule la production de globules blancs et neutralise les radicaux libres. "
        "Une cure régulière renforce significativement les défenses naturelles de l'organisme."
    ),

    # ── DÉTOX ───────────────────────────────────────────────────────────────
    (
        "détox détoxification purification corps chlorophylle foie toxines nettoyage "
        "métaux lourds alcalinisant",
        "La chlorophylle de la spiruline S.HOT est un détoxifiant naturel puissant. "
        "Elle aide à éliminer les métaux lourds, alcalinise l'organisme et soutient "
        "la fonction hépatique (foie). Idéale en cure de détox saisonnière."
    ),

    # ── ENFANTS ─────────────────────────────────────────────────────────────
    (
        "enfants enfant bébé croissance dose enfant kids junior famille",
        "La spiruline S.HOT est adaptée aux enfants pour soutenir leur croissance. "
        "Dose recommandée pour les enfants : 1/2 cuillère à café par jour (1-2g), "
        "à mélanger dans un smoothie fruité ou un yaourt. "
        "Riche en protéines, fer et vitamines B, elle compense les carences fréquentes chez les enfants."
    ),

    # ── CONSEILS DE CONSOMMATION ────────────────────────────────────────────
    (
        "comment prendre consommer utiliser quand prendre matin soir posologie "
        "dose dosage conseils utilisation",
        "Conseils d'expert S.HOT :\n"
        "⏰ Le matin à jeun ou au petit-déjeuner (meilleure absorption)\n"
        "🍊 Avec de la vitamine C (jus d'orange) pour maximiser l'absorption du fer\n"
        "🚫 Éviter thé et café dans l'heure suivant la prise (tanins bloquants)\n"
        "📏 Posologie :\n"
        "  • Paillettes/Cristaux : 1 cuillère à café/jour (3-5g)\n"
        "  • Poudre : 1 cuillère à café dans smoothie, jus ou masque\n"
        "  • Comprimés : 4 à 6 comprimés/jour avec eau\n"
        "  • Débutants : commencer par 1g et augmenter progressivement sur 2 semaines"
    ),

    # ── CONTRE-INDICATIONS ──────────────────────────────────────────────────
    (
        "contre-indications contre indications danger risque hémochromatose phénylcétonurie "
        "allergie effets secondaires qui ne doit pas prendre précautions",
        "⚠️ Contre-indications à connaître :\n"
        "• Hémochromatose (surcharge en fer) : déconseillé car la spiruline est très riche en fer\n"
        "• Phénylcétonurie (PKU) : contient de la phénylalanine, à éviter\n"
        "• Allergie aux algues : consulter un médecin avant\n"
        "• Grossesse/allaitement : demander l'avis d'un professionnel de santé\n"
        "• Médicaments anticoagulants : la vitamine K peut interagir\n"
        "En cas de doute, consultez votre médecin. Contactez-nous : contact@shot.tn"
    ),

    # ── LIVRAISON ───────────────────────────────────────────────────────────
    (
        "livraison délai expédition commande tunisie frais livraison gratuite "
        "quand recevoir combien temps",
        "S.HOT livre partout en Tunisie sous 24 à 48 heures. "
        "Livraison rapide et sécurisée. Pour les frais de livraison selon votre région, "
        "contactez-nous à contact@shot.tn ou passez commande directement sur notre site."
    ),

    # ── PAIEMENT ────────────────────────────────────────────────────────────
    (
        "paiement modes règlement carte bancaire virement livraison payer comment payer",
        "S.HOT accepte plusieurs modes de paiement :\n"
        "💳 Paiement en ligne par carte bancaire\n"
        "🏦 Virement bancaire\n"
        "🚪 Paiement à la livraison\n"
        "Pour toute question, contactez-nous à contact@shot.tn"
    ),

    # ── À PROPOS DE S.HOT ───────────────────────────────────────────────────
    (
        "qui est shot marque tunisienne entreprise société haute technologie alimentaire "
        "origine tunisie local made in tunisia",
        "S.HOT (Société de Haute Technologie Alimentaire) est une marque tunisienne "
        "spécialisée dans la production de spiruline premium. "
        "Nous cultivons et transformons notre spiruline localement en Tunisie, "
        "avec des procédés innovants (pressage à froid) pour garantir la meilleure qualité nutritionnelle. "
        "Notre mission : rendre la nutrition de haute performance accessible à tous les Tunisiens."
    ),

    # ── CONTACT ─────────────────────────────────────────────────────────────
    (
        "contact email téléphone service client joindre nous contacter support",
        "Vous pouvez nous contacter par email à contact@shot.tn. "
        "Notre équipe est disponible pour répondre à toutes vos questions sur les produits, "
        "les commandes ou les conseils nutritionnels."
    ),

    # ── RETOUR & GARANTIE ───────────────────────────────────────────────────
    (
        "retour remboursement garantie satisfait insatisfait problème commande",
        "S.HOT offre une garantie satisfaction. "
        "Si vous n'êtes pas satisfait de votre commande, contactez-nous à contact@shot.tn "
        "dans les 7 jours suivant la réception. Nous trouverons une solution."
    ),

    # ── BIENFAITS GÉNÉRAUX ──────────────────────────────────────────────────
    (
        "bienfaits avantages effets bénéfices santé bien-être pourquoi prendre spiruline "
        "à quoi ça sert utilité",
        "La spiruline S.HOT offre des bienfaits multiples :\n"
        "⚡ Énergie & vitalité (combat la fatigue chronique)\n"
        "💪 Performance sportive (protéines, récupération)\n"
        "🩸 Anti-anémie (fer biodisponible)\n"
        "🛡️ Immunité renforcée (phycocyanine)\n"
        "🌿 Détox naturelle (chlorophylle)\n"
        "👶 Croissance des enfants\n"
        "✨ Beauté (peau, cheveux, ongles)\n"
        "C'est l'un des super-aliments les plus complets au monde !"
    ),

    # ── POIDS & MINCEUR ─────────────────────────────────────────────────────
    (
        "poids régime minceur maigrir perte de poids coupe faim satiété métabolisme",
        "La spiruline S.HOT peut soutenir un programme minceur :\n"
        "• Coupe-faim naturel grâce aux protéines (60%)\n"
        "• Boost du métabolisme\n"
        "• Apport nutritionnel complet même en régime restrictif\n"
        "• Maintien de la masse musculaire pendant la perte de poids\n"
        "À combiner avec une alimentation équilibrée et de l'exercice."
    ),

    # ── BEAUTÉ ──────────────────────────────────────────────────────────────
    (
        "beauté peau cheveux ongles masque visage anti-âge collagène brillance teint",
        "La spiruline S.HOT est aussi un allié beauté :\n"
        "✨ Masque visage : mélanger la poudre avec du miel ou du yaourt\n"
        "💆 Améliore l'éclat du teint et réduit les imperfections\n"
        "💇 Renforce les cheveux et les ongles (protéines + vitamines B)\n"
        "🔬 Effets anti-âge grâce aux antioxydants (phycocyanine, bêta-carotène)"
    ),

    # ── SALUTATIONS ─────────────────────────────────────────────────────────
    (
        "bonjour salut hello bonsoir hi coucou",
        "Bonjour ! Je suis l'assistant S.HOT 🌿 "
        "Je peux vous conseiller sur nos produits, les bienfaits de la spiruline, "
        "les prix, la posologie ou la livraison. Comment puis-je vous aider ?"
    ),

    # ── AU REVOIR ───────────────────────────────────────────────────────────
    (
        "merci au revoir bye bonne journée à bientôt",
        "Merci de votre confiance ! 🌿 "
        "N'hésitez pas à revenir si vous avez d'autres questions. "
        "Prenez soin de vous et bonne journée !"
    ),

    # ── AIDE ────────────────────────────────────────────────────────────────
    (
        "aide help que peux tu faire assistant questions possibles",
        "Je peux vous aider sur :\n"
        "🛍️ Nos produits et leurs prix\n"
        "🔬 La composition et les bienfaits de la spiruline\n"
        "👤 Les conseils par profil (sportif, enfant, santé)\n"
        "📏 La posologie et les conseils de consommation\n"
        "⚠️ Les contre-indications\n"
        "🚚 La livraison et le paiement\n"
        "Posez-moi votre question !"
    ),
]

# Sépare questions et réponses
questions = [item[0] for item in knowledge_base]
answers   = [item[1] for item in knowledge_base]

# Entraîne le vectoriseur TF-IDF au démarrage
vectorizer = TfidfVectorizer(
    analyzer="word",
    ngram_range=(1, 2),
    min_df=1,
    sublinear_tf=True,   # atténue les termes très fréquents
)
tfidf_matrix = vectorizer.fit_transform(questions)

print(f"✅ Chatbot S.HOT prêt — {len(questions)} entrées dans la base de connaissances.")


# ---------------------------------------------------------------------------
# ROUTE PRINCIPALE
# ---------------------------------------------------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"error": "Le champ 'message' est requis."}), 400

    user_message = data["message"].strip()
    if not user_message:
        return jsonify({"error": "Le message ne peut pas être vide."}), 400

    user_vec     = vectorizer.transform([user_message.lower()])
    similarities = cosine_similarity(user_vec, tfidf_matrix).flatten()
    best_idx     = int(np.argmax(similarities))
    best_score   = float(similarities[best_idx])

    CONFIDENCE_THRESHOLD = 0.08

    if best_score < CONFIDENCE_THRESHOLD:
        reply = (
            "Je ne suis pas sûr de comprendre votre question. "
            "Pouvez-vous reformuler ? Je peux vous aider sur les produits S.HOT, "
            "les bienfaits de la spiruline, les prix, la posologie ou la livraison."
        )
    else:
        reply = answers[best_idx]

    return jsonify({
        "reply": reply,
        "confidence": round(best_score, 3)
    })


# ---------------------------------------------------------------------------
# ROUTE DE SANTÉ
# ---------------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "S.HOT Chatbot",
        "entries": len(questions)
    })


# ---------------------------------------------------------------------------
# DÉMARRAGE
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005, debug=False)

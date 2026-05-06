from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

app = Flask(__name__)
CORS(app)

# Base de connaissances pour S.HOT - Spiruline
KNOWLEDGE_BASE = [
    {
        "question": "Quels sont les bienfaits de la spiruline?",
        "answer": "La spiruline offre de nombreux bienfaits pour la santé : elle est riche en protéines (60-70%), contient tous les acides aminés essentiels, est une excellente source de vitamines B12, de fer, de magnésium et d'antioxydants. Elle renforce le système immunitaire, améliore l'énergie et la vitalité, aide à la récupération musculaire et soutient la santé cardiovasculaire."
    },
    {
        "question": "Quel est le prix de la spiruline?",
        "answer": "Notre spiruline est proposée au prix de 20 DT par portion. Nous offrons plusieurs formats : en poudre, en comprimés et en portions individuelles. Des remises sont disponibles pour les achats en gros."
    },
    {
        "question": "Livrez-vous en Tunisie?",
        "answer": "Oui, nous livrons partout en Tunisie ! La livraison est rapide et sécurisée. Les frais de livraison dépendent de votre localisation. Nous proposons également le retrait en point de vente pour les clients de la région de Tunis."
    },
    {
        "question": "Comment fonctionne la livraison?",
        "answer": "Nous livrons partout en Tunisie sous 2-3 jours ouvrables. Vous recevrez un numéro de suivi pour suivre votre commande en temps réel. Les frais de livraison varient selon la région. Nous travaillons avec les meilleurs prestataires de logistique."
    },
    {
        "question": "Qui est S.HOT?",
        "answer": "S.HOT est une entreprise tunisienne spécialisée dans la production et la commercialisation de spiruline de haute qualité. Notre mission est de rendre les produits de santé naturels accessibles à tous les Tunisiens en proposant une spiruline pure et biologique directement du producteur au consommateur."
    },
    {
        "question": "D'où vient votre spiruline?",
        "answer": "Notre spiruline est produite en Tunisie dans des conditions optimales et contrôlées. Nous garantissons une qualité premium sans additifs ni conservateurs. Tous nos produits sont testés et certifiés pour la pureté et la qualité."
    },
    {
        "question": "Comment commander?",
        "answer": "Vous pouvez commander directement sur notre site web S.HOT en quelques clics. Sélectionnez le produit, la quantité, ajoutez au panier et procédez au paiement. Plusieurs modes de paiement sont disponibles : carte bancaire, Ooredoo Money, Orange Money et paiement à la livraison."
    },
    {
        "question": "Quels sont les modes de paiement?",
        "answer": "Nous acceptons plusieurs modes de paiement : cartes bancaires (Visa, Mastercard), portefeuilles mobiles (Ooredoo Money, Orange Money) et paiement à la livraison pour votre commodité."
    },
    {
        "question": "La spiruline est-elle biologique?",
        "answer": "Oui, notre spiruline est 100% biologique et produite sans pesticides ni engrais chimiques. Nous respectons les normes de production biologique les plus strictes pour garantir un produit pur et naturel."
    },
    {
        "question": "Puis-je retourner ma commande?",
        "answer": "Oui, nous offrons une garantie de satisfaction. Si vous n'êtes pas satisfait, vous pouvez retourner votre produit sous 7 jours pour un remboursement complet. Contactez notre service client pour lancer une demande de retour."
    },
    {
        "question": "Comment puis-je contacter S.HOT?",
        "answer": "Vous pouvez nous contacter via notre site web, par email ou par téléphone. Notre équipe client est disponible du lundi au vendredi de 9h à 17h pour répondre à toutes vos questions."
    },
    {
        "question": "La spiruline a-t-elle des effets secondaires?",
        "answer": "La spiruline est généralement très bien tolérée et sûre pour la consommation. Elle est adaptée à la plupart des gens. Cependant, si vous êtes allergique aux algues ou si vous prenez des médicaments anticoagulants, consultez votre médecin avant de la consommer."
    },
    {
        "question": "Comment prendre la spiruline?",
        "answer": "La spiruline peut être consommée en poudre (mélangée à vos smoothies, jus ou aliments) ou en comprimés. La dose recommandée est de 3 à 5 grammes par jour. Commencez progressivement si vous débutez pour permettre à votre corps de s'adapter."
    },
    {
        "question": "Bonjour",
        "answer": "Bonjour! Bienvenue chez S.HOT, votre spécialiste de la spiruline de qualité. Comment puis-je vous aider aujourd'hui? Vous pouvez me poser des questions sur nos produits, les prix, la livraison ou les bienfaits de la spiruline."
    },
    {
        "question": "Salut",
        "answer": "Salut! Je suis heureux de vous aider. Que souhaitez-vous savoir sur S.HOT et nos produits de spiruline?"
    }
]

# Préparer les données pour le vecteur TF-IDF
questions = [item["question"] for item in KNOWLEDGE_BASE]
answers = [item["answer"] for item in KNOWLEDGE_BASE]

# Créer le vectoriseur TF-IDF
vectorizer = TfidfVectorizer(analyzer='char', ngram_range=(1, 3))
tfidf_matrix = vectorizer.fit_transform(questions)

@app.route('/chat', methods=['POST'])
def chat():
    """
    Route pour traiter les messages du chatbot
    Reçoit: {"message": "votre message"}
    Retourne: {"response": "réponse du chatbot", "confidence": score}
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({
                'response': 'Veuillez entrer un message.',
                'confidence': 0
            }), 400
        
        # Vectoriser le message utilisateur
        user_vector = vectorizer.transform([user_message])
        
        # Calculer la similarité cosinus
        similarities = cosine_similarity(user_vector, tfidf_matrix)
        best_match_idx = np.argmax(similarities)
        confidence = float(similarities[0][best_match_idx])
        
        # Si la confiance est trop basse, retourner une réponse générique
        if confidence < 0.1:
            response = "Je n'ai pas bien compris votre question. Pouvez-vous reformuler? Je peux répondre à des questions sur la spiruline, les prix, la livraison et S.HOT."
            confidence = 0
        else:
            response = answers[best_match_idx]
        
        return jsonify({
            'response': response,
            'confidence': confidence
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'response': 'Une erreur s\'est produite. Veuillez réessayer.'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Vérifier l'état du service"""
    return jsonify({'status': 'ok', 'service': 'chatbot-service'}), 200

@app.route('/', methods=['GET'])
def index():
    """Route d'accueil du service"""
    return jsonify({
        'service': 'S.HOT Chatbot Service',
        'version': '1.0',
        'endpoints': {
            'chat': 'POST /chat - Envoyer un message au chatbot',
            'health': 'GET /health - Vérifier l\'état du service'
        }
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=False)

import {
  Package,
  User,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  X,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const CommandeDetailModal = ({ commande, onClose }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "En attente":
        return (
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> {status}
          </span>
        );
      case "Validée":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "Annulée":
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "En livraison":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Truck className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy HH:mm", { locale: fr });
  };

  if (!commande) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-in-out">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-pink-50 p-3 rounded-full">
                <ShoppingBag className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Détails de la commande
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
                    #{commande.hashid}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{" "}
                    {formatDate(commande.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Client */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-500" />
                  Client
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{commande.client.nom_clt}</p>
                  <p className="text-xs text-gray-400">
                    ID: {commande.client.hashid_clt}
                  </p>

                  <p>{commande.client.email_clt}</p>
                  <p className="text-xs text-gray-400">
                    Téléphone: {commande.client.tel_clt}
                  </p>
                </div>
              </div>

              {/* Articles */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-500" />
                  Articles ({commande.articles.length})
                </h3>
                <div className="space-y-4">
                  {commande.articles.map((article) => (
                    <div
                      key={article.hashid}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <img
                        src={article.image || "https://via.placeholder.com/80"}
                        alt={article.nom_article}
                        className="w-20 h-20 rounded-lg object-cover shadow-sm border border-gray-100"
                      />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-semibold text-gray-900 text-base truncate">
                          {article.nom_article}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {article.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-bold text-pink-600">
                            {article.prix.toLocaleString("fr-FR")} FCFA
                          </span>
                          <span className="text-sm bg-pink-50 px-2 py-1 rounded-md">
                            x {article.quantite}
                          </span>
                        </div>

                        {article.variations?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {article.variations.map((variation, i) => (
                              <span
                                key={i}
                                className="inline-block bg-pink-50 rounded-full px-3 py-1 text-xs text-pink-700 border border-pink-100 truncate max-w-[200px]">
                                {variation.nom_variation}:{" "}
                                {variation.lib_variation}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              Boutique
                            </span>
                            <p className="text-sm font-medium truncate">
                              {article.boutique.nom_btq}
                            </p>
                            <span className="text-xs font-medium text-gray-500">
                              Email
                            </span>
                            <p className="text-sm truncate">
                              {article.boutique.email_btq}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              ID
                            </span>
                            <p className="text-sm truncate">
                              {article.boutique.hashid_btq}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Contact
                            </span>
                            <p className="text-sm truncate">
                              {article.boutique.tel_btq}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Résumé */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-medium text-gray-900 mb-3">Résumé</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles</span>
                    <span className="font-medium">
                      {commande.prix_total_articles.toLocaleString("fr-FR")}{" "}
                      FCFA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium">
                      {commande.livraison.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 mt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-medium">Total</span>
                    <span className="text-pink-600 font-bold text-lg">
                      {commande.prix_total_commande.toLocaleString("fr-FR")}{" "}
                      FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-medium text-gray-900 mb-3">Statut</h3>
                <div className="flex items-center gap-3">
                  {getStatusBadge(commande.statut)}
                  <span className="text-sm text-gray-600">
                    {formatDate(commande.created_at)}
                  </span>
                </div>
              </div>

              {/* Paiement */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-pink-500" />
                  Paiement
                </h3>
                <div className="text-sm text-gray-600">
                  <p>Moyen: {commande.moyen_de_paiement}</p>
                </div>
              </div>

              {/* Livraison */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  Livraison
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Ville: {commande.localisation.ville}</p>
                  <p>Commune: {commande.localisation.commune}</p>
                  {/* <p>Quartier: {commande.localisation.quartier}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandeDetailModal;

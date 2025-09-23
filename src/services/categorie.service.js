import axiosInstance from "../api/axiosInstance";

// Ajouter une catégorie
const ajouterCategorie = async (categorieData) => {
  const formData = new FormData();
  formData.append("nom_categorie", categorieData.nom_categorie);
  if (categorieData.image_categorie instanceof File) {
    formData.append("image_categorie", categorieData.image_categorie);
  }

  try {
    const response = await axiosInstance.post("/api/categorie/ajout", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lister les catégories
const listerCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/categories");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtenir une catégorie
const obtenirCategorie = async (hashid) => {
  try {
    const response = await axiosInstance.get(`/categorie/${hashid}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Modifier une catégorie
const modifierCategorie = async (hashid, data) => {
  const formData = new FormData();
  formData.append("nom_categorie", data.nom_categorie);
  if (data.image_categorie instanceof File) {
    formData.append("image_categorie", data.image_categorie);
  }

  try {
    const response = await axiosInstance.post(`/api/categorie/${hashid}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Supprimer une catégorie
const supprimerCategorie = async (hashid) => {
  try {
    const response = await axiosInstance.post(`/api/categorie/${hashid}/delete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const CategorieService = {
  ajouterCategorie,
  listerCategories,
  obtenirCategorie,
  modifierCategorie,
  supprimerCategorie,
};

export default CategorieService;

import { toast } from 'sonner';

const ERROR_MESSAGES = {
  auth_login: "Échec de la connexion",
  auth_logout: "Échec de la déconnexion",
  auth_register: "Échec de l'inscription",

  agenda_anime_load: "Échec du chargement de l'agenda des animés",
  agenda_manga_load: "Échec du chargement de l'agenda des mangas",
  anime_load: "Échec du chargement de l'animé",
  chapter_load: "Échec du chargement du chapitre",
  discover_load: "Échec du chargement des découvertes",
  episode_load: "Échec du chargement de l'épisode",
  follows_load: "Échec du chargement des abonnés ou abonnements",
  franchise_load: "Échec du chargement de la franchise",
  library_load: "Échec du chargement de votre bibliothèque",
  manga_load: "Échec du chargement du manga",
  people_load: "Échec du chargement de la personnalité",
  profile_load: "Échec du chargement du profil",
  season_load: "Échec du chargement de la saison",
  staff_load: "Échec du chargement du staff",
  volume_load: "Échec du chargement du tome",

  anime_save: "Échec de l'enregistrement de l'animé",
  chapter_save: "Échec de l'enregistrement du chapitre",
  episode_save: "Échec de l'enregistrement de l'épisode",
  franchise_save: "Échec de l'enregistrement de la franchise",
  manga_save: "Échec de l'enregistrement du manga",
  people_save: "Échec de l'enregistrement de la personnalité",
  profile_edit: "Échec de la modification de votre profil",
  season_save: "Échec de l'enregistrement de la saison",
  staff_save: "Échec de l'enregistrement du staff",
  volume_save: "Échec de l'enregistrement du tome",

  search_load: "Échec de la recherche",
  search_anime_load: "Échec de la recherche d'animés",
  search_manga_load: "Échec de la recherche de mangas",
  search_people_load: "Échec de la recherche de personnalités",
  search_user_load: "Échec de la recherche d'utilisateurs",

  anime_entry_update: "Échec de la modification de votre suivi d'animé",
  chapter_entry_update: "Échec de la modification de votre suivi de chapitre",
  episode_entry_update: "Échec de la modification de votre suivi d'épisode",
  episodes_entry_update: "Échec de la modification de votre suivi d'épisodes",
  follow_update: "Échec de la modification de vos abonnements",
  manga_entry_update: "Échec de la modification de votre suivi de manga",
  volume_entry_update: "Échec de la modification de votre suivi de tome",

  image_upload: "Échec de l'importation de l'image",
};

const notify = {
  error: (type: keyof typeof ERROR_MESSAGES, err?: any) => {
    const message = ERROR_MESSAGES[type] || "Échec de l'opération";
    const description = err?.message || "Une erreur inattendue s'est produite";

    console.error(err);
    toast.error(message, {
      description: description,
    });
  },
};

export default notify;

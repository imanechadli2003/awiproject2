import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ====================
// Interfaces existantes
// ====================
export interface Vendeur {
  VendeurID: number;
  Nom: string;
  Email: string;
  Telephone: string;
}

export interface NewVendeur {
  Nom: string;
  Email: string;
  Telephone: string;
}

export interface Achat {
  AchatID: number;
  Total_Paye: number;
  DateAChat: Date;
}

export interface BilanVendeurSession {
  total_depots: number;
  total_ventes: number;
  total_stocks: number;
  total_gains: number;
  total_comissions: number;
}

export interface Session {
  idSession: number;
  NomSession: string;
  DateDebut: string; // ISO string pour la date
  DateFin?: string;  // Optionnel si la session est toujours active
  pourc_frais_depot: number;
  pourc_frais_vente: number;
  Statut: boolean;   // Indique si la session est active
}

export interface NewSession {
  NomSession: string;
  pourc_frais_depot: number;
  pourc_frais_vente: number;
}

export interface Depot {
  ID_depot: number;
  VendeurID: number;  // Référence au vendeur
  date_depot: Date;
  id_session: number; // Référence à la session
  comission_depot_total: number;
}

export interface NewDepot {
  vendeurId: number;  // Référence au vendeur
  jeux: {
    nomJeu: number;
    prixUnitaire: number; 
    quantite_depose: number;
  }[];
}

export interface JeuxMarque {
  JeuRef_id: number;
  Nom: string;
  Editeur: string;
  Description: string;
}

export interface Game {
  jeuxMarque: any;
  JeuID: number;
  JeuRef_id: number;
  depot_ID: number;
  prix_unitaire: number;
  mise_en_vente: boolean;
  quantite_disponible: number;
}

export interface NewGame {
  JeuRef_id: number;
  depot_ID: number;
  prix_unitaire: number;
  mise_en_vente: boolean;
  quantite_disponible: number;
}

export interface SalesSummary {
  AchatID: number;
  Total_paye: number;
  DateAchat: string;
  comission_vente_total: number;
}

export interface NewAchat {
  selectedGames: { JeuID: number; quantite: number }[]; // Jeux et quantités achetées
}

export interface DepositSummary {
  ID_depot: number;
  VendeurID: number;
  date_depot: string;
  comission_depot_total: number;
}

export interface DashboardMetrics {
  popularGames: Game[];
  salesSummary: SalesSummary[];
  depositSummary: DepositSummary[];
  jeuxStockes: number;
  jeuxVendues: number;
  jeuxInvendus: number;
}

// ====================
// Nouvelles interfaces pour Manager
// ====================
export interface Manager {
  UtilisateurID: number;
  Nom: string;
  Prenom: string;
  Email: string;
  MdP: string;
  Role: "Manager" | "Admin";
}

export interface NewManager {
  Nom: string;
  Prenom: string;
  Email: string;
  MdP: string;
}

// ====================
// Configuration de l'API RTK Query
// ====================
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: 'api',
  tagTypes: ['Games', 'Vendors', 'Marques', 'Depots', 'DashboardMetrics', "Session", "Managers"],
  endpoints: (build) => ({
    // --------------------
    // Endpoints existants
    // --------------------
    getJeux: build.query<Game[], string | void>({
      query: (search) => ({
        url: '/stocks/jeux',
        params: search ? { search } : {}
      }),
      providesTags: ['Games'],
    }),
    getJeuxEnVente: build.query<Game[], string | void>({
      query: (search) => ({
        url: '/stocks/jeuxenvente',
        params: search ? { search } : {}
      }),
      providesTags: ['Games'],
    }),
    getBilanVendeurSession: build.query<
      BilanVendeurSession,
      { vendeurId: number; sessionId: number }
    >({
      query: ({ vendeurId, sessionId }) => ({
        url: `/sessions/bilan/${vendeurId}/${sessionId}`,
      }),
      transformResponse: (response: { BilanVendeurSession: BilanVendeurSession }) =>
        response.BilanVendeurSession,
      providesTags: ['Session'],
    }),
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ['DashboardMetrics']
    }),
    creerDepot: build.mutation<Depot, NewDepot>({
      query: (newdepot) => ({
        url: '/stocks/depot',
        method: 'POST',
        body: newdepot,
      }),
      invalidatesTags: ['Depots'],
    }),
    creerAchat: build.mutation<Achat, NewAchat>({
      query: (newAchat) => ({
        url: '/achats/achat',
        method: 'POST',
        body: newAchat,
      }),
      invalidatesTags: ['Games', 'DashboardMetrics'],
    }),
    getActiveSession: build.query<Session, void>({
      query: () => '/sessions/active',
      providesTags: ['Session'],
    }),
    closeSession: build.mutation<Session, void>({
      query: () => ({
        url: '/sessions/close',
        method: 'PATCH',
      }),
      invalidatesTags: ['Session'],
    }),
    createSession: build.mutation<Session, NewSession>({
      query: (newSession) => ({
        url: '/sessions',
        method: 'POST',
        body: newSession,
      }),
      invalidatesTags: ['Session'],
    }),
    creerVendeur: build.mutation<Vendeur, NewVendeur>({
      query: (newVendeur) => ({
        url: '/vendeurs',
        method: 'POST',
        body: newVendeur,
      }),
      invalidatesTags: ['Vendors'],
    }),
    updateVendeur: build.mutation<Vendeur, { id: number; data: NewVendeur }>({
      query: ({ id, data }) => ({
        url: `/vendeurs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vendors'],
    }),
    getTopVendeurs: build.query<Vendeur[], void>({
      query: () => '/vendeurs/top',
      providesTags: ['Vendors'],
    }),
    mettreEnVente: build.mutation<Game, { id: number; miseEnVente: boolean }>({
      query: ({ id, miseEnVente }) => ({
        url: `stocks/jeux/${id}/mettre-en-vente`,
        method: 'PATCH',
        body: { mise_en_vente: miseEnVente },
      }),
      invalidatesTags: ['Games'],
    }),
    remettre: build.mutation<Game, { id: number; miseEnVente: boolean }>({
      query: ({ id, miseEnVente }) => ({
        url: `stocks/jeux/${id}/remettre`,
        method: 'PATCH',
        body: { mise_en_vente: miseEnVente },
      }),
      invalidatesTags: ['Games'],
    }),
    getSessions: build.query<Session[], void>({
      query: () => '/sessions',
      providesTags: ['Session'],
    }),
    getVendeurs: build.query<Vendeur[], void>({
      query: () => '/stocks/vendeurs',
      providesTags: ['Vendors'],
    }),
    getDepots: build.query<Depot[], void>({
      query: () => '/stocks/depots',
      providesTags: ['Depots'],
    }),
    getVendeurById: build.query<Vendeur, number>({
      query: (id) => `/stocks/vendeurs/${id}`,
      providesTags: ['Vendors'],
    }),
    getAllJeuxMarques: build.query<JeuxMarque[], void>({
      query: () => '/stocks/marques',
      providesTags: ['Marques'],
    }),
    getJeuxMarqueById: build.query<JeuxMarque, number>({
      query: (id) => `/stocks/marques/${id}`,
      providesTags: ['Marques'],
    }),

    // --------------------
    // Nouveaux endpoints pour les Managers
    // --------------------
    getManagers: build.query<Manager[], void>({
      query: () => '/sessions/managers',
      providesTags: ['Managers'],
    }),
    createManager: build.mutation<Manager, NewManager>({
      query: (newManager) => ({
        url: '/sessions/managers',
        method: 'POST',
        body: newManager,
      }),
      invalidatesTags: ['Managers'],
    }),
  }),
});

// ====================
// Hooks générés par RTK Query
// ====================
export const {
  useGetJeuxQuery,
  useMettreEnVenteMutation,
  useCreerDepotMutation,
  useGetVendeursQuery,
  useGetVendeurByIdQuery,
  useGetAllJeuxMarquesQuery,
  useGetJeuxMarqueByIdQuery,
  useGetDashboardMetricsQuery,
  useGetDepotsQuery,
  useRemettreMutation,
  useGetJeuxEnVenteQuery,
  useCreerAchatMutation,
  useGetTopVendeursQuery,
  useCreerVendeurMutation,
  useUpdateVendeurMutation,
  useGetActiveSessionQuery, 
  useCloseSessionMutation,
  useCreateSessionMutation,
  useGetBilanVendeurSessionQuery,
  useGetSessionsQuery,
  // Nouveaux hooks pour les managers
  useGetManagersQuery,
  useCreateManagerMutation,
} = api;

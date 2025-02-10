"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManager = exports.getAllManagers = exports.deleteUtilisateur = exports.updateUtilisateur = exports.createUtilisateur = exports.getAllUtilisateurs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. Récupérer tous les utilisateurs
const getAllUtilisateurs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const utilisateurs = yield prisma.utilisateur.findMany();
        return res.status(200).json(utilisateurs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
});
exports.getAllUtilisateurs = getAllUtilisateurs;
// 2. Créer un utilisateur (rôle à spécifier dans le corps de la requête)
const createUtilisateur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Nom, Prenom, Email, MdP, Role } = req.body;
        // Vérifier que l'utilisateur n'existe pas déjà
        const existingUser = yield prisma.utilisateur.findUnique({
            where: { Email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "L'utilisateur avec cet email existe déjà." });
        }
        const newUser = yield prisma.utilisateur.create({
            data: {
                Nom,
                Prenom,
                Email,
                MdP,
                Role,
            },
        });
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur." });
    }
});
exports.createUtilisateur = createUtilisateur;
// 3. Mettre à jour un utilisateur
const updateUtilisateur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UtilisateurID } = req.params; // Assurez-vous d'avoir ce paramètre dans l'URL
    try {
        const { Nom, Prenom, Email, MdP, Role } = req.body;
        const updatedUser = yield prisma.utilisateur.update({
            where: { UtilisateurID: parseInt(UtilisateurID) },
            data: {
                Nom,
                Prenom,
                Email,
                MdP,
                Role,
            },
        });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
    }
});
exports.updateUtilisateur = updateUtilisateur;
// 4. Supprimer un utilisateur
const deleteUtilisateur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UtilisateurID } = req.params;
    try {
        yield prisma.utilisateur.delete({
            where: { UtilisateurID: parseInt(UtilisateurID) },
        });
        return res.status(204).send(); // No content
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
});
exports.deleteUtilisateur = deleteUtilisateur;
// 5. Récupérer tous les utilisateurs ayant le rôle "Manager"
const getAllManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const managers = yield prisma.utilisateur.findMany({
            where: { Role: 'Manager' },
        });
        return res.status(200).json(managers);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération des managers." });
    }
});
exports.getAllManagers = getAllManagers;
// 6. Créer un utilisateur avec le rôle "Manager"
//    Le rôle est fixé à "Manager" quelle que soit la valeur passée dans le corps de la requête.
const createManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Nom, Prenom, Email, MdP } = req.body;
        // Vérifier qu'un utilisateur avec cet email n'existe pas déjà
        const existingUser = yield prisma.utilisateur.findUnique({
            where: { Email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà." });
        }
        const newManager = yield prisma.utilisateur.create({
            data: {
                Nom,
                Prenom,
                Email,
                MdP,
                Role: 'Manager', // On fixe le rôle Manager
            },
        });
        return res.status(201).json(newManager);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la création du manager." });
    }
});
exports.createManager = createManager;

import { UserRole } from "./enums";

export const USERS = {
    1: {
        id: 1,
        email: "test@devmw.pl",
        username: "mateo",
        plainTextPassword: "test",
        passwordSalt: "o61TA7yaJIsa",
        role: UserRole.USER,
    },
    2: {
        id: 2,
        email: "admin@devmw.pl",
        username: "mateo admin",
        plainTextPassword: "admin",
        passwordSalt: "NydKRjIh4T4X",
        role: UserRole.ADMIN,
    }

};

export const LAYOUTS = {
    1: {
        id: 1,
        name: "Testowa konfiguracja",
        updates: [
            { name: "1", newValue: "Test1223" },
            { name: "3", newValue: "Test6565" },
        ],
        authorId: 1,
    },
    2: {
        id: 2,
        name: "Testowa konfiguracja 2",
        updates: [
            { name: "5", newValue: "Testowa konfiguracja 2 5" },
            { name: "7", newValue: "Testowa konfiguracja 2 7" },
            { name: "9", newValue: "Testowa konfiguracja 2 9" },
            { name: "11", newValue: "Testowa konfiguracja 2 11" },
        ],
        authorId: 1,
    },
};

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, -- Remplacement de AUTOINCREMENT par SERIAL
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE, -- Colonne pour le rôle admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Ajout d'une valeur par défaut pour le champ created_at
);

-- Table des agendas
CREATE TABLE IF NOT EXISTS agendas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Correction pour CURRENT_TIMESTAMP
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ajout de ON DELETE CASCADE pour gérer les dépendances
);

-- Table des routines
CREATE TABLE IF NOT EXISTS routines (
    id SERIAL PRIMARY KEY,
    agenda_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('matinale', 'nocturne')) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE
);

-- Table des habitudes
CREATE TABLE IF NOT EXISTS habits (
    id SERIAL PRIMARY KEY,
    agenda_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT CHECK(frequency IN ('quotidienne', 'hebdomadaire', 'mensuelle')) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE
);

-- Table des évaluations
CREATE TABLE IF NOT EXISTS evaluations (
    id SERIAL PRIMARY KEY,
    agenda_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('roue', 'bilan')) NOT NULL,
    scores TEXT NOT NULL, -- JSON sous forme de string
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

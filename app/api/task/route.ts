import { NextResponse } from "next/server";
import { query } from "../../../lib/postgr_db";
import { verifyToken } from "../../../lib/auth";

// GET: Récupérer toutes les tâches
export async function GET(req: Request) {
  try {
    // Récupérer le token JWT
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Si l'utilisateur est admin, afficher toutes les tâches
    if (user.is_admin) {
      const allTasks = await query("SELECT * FROM tasks");
      return NextResponse.json(allTasks);
    }

    // Sinon, afficher uniquement les tâches de l'utilisateur
    const userTasks = await query("SELECT * FROM tasks WHERE user_id = $1", [
      user.id,
    ]);

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Unable to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST: Ajouter une nouvelle tâche
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
      title,
      user.id,
    ]);

    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Unable to create task" },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour une tâche
export async function PUT(req: Request) {
  try {
    // Récupérer le token JWT
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer les données de la requête
    const { id, title, completed } = await req.json();

    if (!id || (title === undefined && completed === undefined)) {
      return NextResponse.json(
        {
          error: "ID and at least one field (title or completed) are required",
        },
        { status: 400 }
      );
    }

    // Vérifier que la tâche appartient à l'utilisateur
    const tasks = await query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, user.id]
    );

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Task not found or you do not have permission to update it" },
        { status: 403 }
      );
    }

    // Mettre à jour la tâche
    await query(
      "UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 AND user_id = $4",
      [title, completed, id, user.id]
    );

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Unable to update task" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer une tâche
export async function DELETE(req: Request) {
  try {
    // Récupérer le token JWT
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer l'ID de la tâche à supprimer
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Vérifier que la tâche appartient à l'utilisateur
    const tasks = await query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, user.id]
    );

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Task not found or you do not have permission to delete it" },
        { status: 403 }
      );
    }

    // Supprimer la tâche
    await query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
      id,
      user.id,
    ]);

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Unable to delete task" },
      { status: 500 }
    );
  }
}

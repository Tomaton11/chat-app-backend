// src/controllers/workspace.controller.js
import workspaceRepository from "../repositories/worksapce.repository.js";

// Crear workspace
export const createWorkspaceController = async (req, res) => {
  try {
    const { name } = req.body;
    const owner_id = req.user._id;

    const new_workspace = await workspaceRepository.createWorkspace({
      name,
      owner_id,
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "Workspace created!",
      data: {
        new_workspace,
      },
    });
  } catch (error) {
    console.log("error al registrar", error);

    if (error.status) {
      return res.status(error.status).send({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    res.status(500).send({
      status: 500,
      ok: false,
      message: "internal server error",
    });
  }
};

// Workspaces del usuario logueado (los que es owner y miembro)
export const getUserWorkspacesController = async (req, res) => {
  try {
    const user_id = req.user._id;

    console.log("User ID desde token:", user_id);

    const { owned, member } =
      await workspaceRepository.getUserWorkspacesByOwnerAndMembership(user_id);

    console.log("Owned workspaces:", owned.length);
    console.log("Member workspaces:", member.length);

    res.status(200).json({
      ok: true,
      status: 200,
      message: "User workspaces fetched successfully",
      data: {
        owned_workspaces: owned,
        member_workspaces: member,
      },
    });
  } catch (error) {
    console.log("Error fetching user workspaces:", error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal server error",
    });
  }
};

// Workspaces de un usuario por ID (si lo necesitás en alguna ruta /user/:user_id)
export const getUserWorkspacesByIdController = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Falta el ID del usuario",
      });
    }

    const { owned, member } =
      await workspaceRepository.getUserWorkspacesByOwnerAndMembership(user_id);

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Workspaces del usuario obtenidos",
      data: {
        owned_workspaces: owned,
        member_workspaces: member,
      },
    });
  } catch (error) {
    console.error("Error en getUserWorkspacesByIdController:", error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
    });
  }
};

// OBTENER UN WORKSPACE POR ID (el que necesitamos para /workspace/:id en el front)
export const getWorkspaceByIdController = async (req, res) => {
  try {
    const { workspace_id } = req.params;

    const workspace = await workspaceRepository.findWorkspaceById(workspace_id);

    if (!workspace) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Workspace not found",
      });
    }

    // verificar que el usuario logueado es miembro
    if (!workspace.members.some((m) => m.equals(req.user._id))) {
      return res.status(403).json({
        ok: false,
        status: 403,
        message: "No tienes acceso a este workspace",
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Workspace obtenido correctamente",
      data: {
        workspace,
      },
    });
  } catch (error) {
    console.error("Error en getWorkspaceByIdController", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
    });
  }
};

// Invitar usuario a workspace
export const invteUserToWorkspaceController = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { invited_id, workspace_id } = req.params;

    const workspace_found = await workspaceRepository.addNewMember({
      owner_id: user_id,
      invited_id,
      workspace_id,
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "New member",
      data: {
        workspace: workspace_found,
      },
    });
  } catch (error) {
    console.log("error al registrar", error);

    if (error.status) {
      return res.status(error.status).send({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    res.status(500).send({
      status: 500,
      ok: false,
      message: "internal server error",
    });
  }
};

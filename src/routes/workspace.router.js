import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createWorkspaceController,
  invteUserToWorkspaceController,
  getUserWorkspacesController,
  getUserWorkspacesByIdController,
  getWorkspaceByIdController,
} from "../controllers/workspace.controller.js";

const workspace_router = Router();

workspace_router.post("/", authMiddleware, createWorkspaceController);

workspace_router.get("/", authMiddleware, getUserWorkspacesController);

workspace_router.get(
  "/user/:user_id",
  authMiddleware,
  getUserWorkspacesByIdController
);

workspace_router.get(
  "/:workspace_id",
  authMiddleware,
  getWorkspaceByIdController
);

workspace_router.post(
  "/:workspace_id/invite/:invited_id",
  authMiddleware,
  invteUserToWorkspaceController
);

export default workspace_router;

import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  getPublicProjectBySlug,
  publishProject,
  removeProjectImage,
  unpublishProject,
  updateProject,
} from "../services/project/project.service";
import {
  createProjectSchema,
  projectQuerySchema,
  updateProjectSchema,
} from "../schemas/project.schema";

type ProjectUploadFiles = {
  beforeImage?: Express.Multer.File[];
  afterImage?: Express.Multer.File[];
  images?: Express.Multer.File[];
};

const getProjectUploadFiles = (
  req: Express.Request
): ProjectUploadFiles => {
  if (!req.files || Array.isArray(req.files)) {
    return {};
  }

  return req.files as ProjectUploadFiles;
};

export const createProjectController = asyncHandler(
  async (req, res) => {
    console.log("PROJECT BODY:", req.body);
    console.log("PROJECT FILES:", req.files);
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const files = getProjectUploadFiles(req);
    console.log("PROJECT FILES:", files);

    const project = await createProject(
      parsed.data,
      files
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Project created successfully",
      data: project,
    });
  }
);

export const listAdminProjectsController = asyncHandler(
  async (req, res) => {
    const parsed = projectQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid project query",
        parsed.error.flatten()
      );
    }

    const result = await getProjects(parsed.data);

    return sendSuccess(res, {
      message: "Projects fetched successfully",
      data: result,
    });
  }
);

export const listPublicProjectsController = asyncHandler(
  async (req, res) => {
    const parsed = projectQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid project query",
        parsed.error.flatten()
      );
    }

    const result = await getProjects(parsed.data, true);

    return sendSuccess(res, {
      message: "Projects fetched successfully",
      data: result,
    });
  }
);

export const getAdminProjectController = asyncHandler(
  async (req, res) => {
    const project = await getProjectById(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Project fetched successfully",
      data: project,
    });
  }
);

export const getPublicProjectController = asyncHandler(
  async (req, res) => {
    const project = await getPublicProjectBySlug(
      req.params.slug as string
    );

    return sendSuccess(res, {
      message: "Project fetched successfully",
      data: project,
    });
  }
);

export const updateProjectController = asyncHandler(
  async (req, res) => {
    const parsed = updateProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const files = getProjectUploadFiles(req);

    const project = await updateProject(
      req.params.id as string,
      parsed.data,
      files
    );

    return sendSuccess(res, {
      message: "Project updated successfully",
      data: project,
    });
  }
);

export const deleteProjectController = asyncHandler(
  async (req, res) => {
    await deleteProject(req.params.id as string);

    return sendSuccess(res, {
      message: "Project deleted successfully",
    });
  }
);

export const publishProjectController = asyncHandler(
  async (req, res) => {
    const project = await publishProject(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Project published successfully",
      data: project,
    });
  }
);

export const unpublishProjectController = asyncHandler(
  async (req, res) => {
    const project = await unpublishProject(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Project unpublished successfully",
      data: project,
    });
  }
);

export const removeProjectImageController = asyncHandler(
  async (req, res) => {
    const publicId = req.body.publicId;

    if (typeof publicId !== "string" || !publicId.trim()) {
      throw new ApiError(400, "publicId is required");
    }

    const project = await removeProjectImage(
      req.params.id as string,
      publicId
    );

    return sendSuccess(res, {
      message: "Project image removed successfully",
      data: project,
    });
  }
);
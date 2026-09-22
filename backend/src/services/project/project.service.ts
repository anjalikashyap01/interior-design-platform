import { Express } from "express";
import Project, {
  IProject,
  IProjectImage,
} from "../../models/Project";
import {
  CreateProjectInput,
  ProjectQueryInput,
  UpdateProjectInput,
} from "../../schemas/project.schema";
import { ApiError } from "../../utils/api-error";
import {
  createPaginationMeta,
  getPagination,
} from "../../utils/pagination";
import {
  uploadProjectImage,
  deleteProjectImage,
} from "../cloudinary/project-image.service";
import { cleanupProjectImages } from "../cloudinary/project-image-cleanup.service";

const uploadFiles = async (
  files: Express.Multer.File[]
): Promise<IProjectImage[]> => {
  const uploaded: IProjectImage[] = [];

  try {
    for (const file of files) {
      const image = await uploadProjectImage(file);
      uploaded.push(image);
    }

    return uploaded;
  } catch (error) {
    await cleanupProjectImages(uploaded);
    throw error;
  }
};

const findProjectOrThrow = async (
  id: string
): Promise<IProject> => {
  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

export const createProject = async (
  data: CreateProjectInput,
  files: Express.Multer.File[] = []
): Promise<IProject> => {
  const existing = await Project.findOne({ slug: data.slug });

  if (existing) {
    throw new ApiError(
      409,
      "A project with this slug already exists"
    );
  }

  const images = await uploadFiles(files);

  try {
    return await Project.create({
      ...data,
      category: data.category?.toLowerCase(),
      style: data.style?.toLowerCase(),
      materials: data.materials.map((item) =>
        item.toLowerCase()
      ),
      images,
    });
  } catch (error) {
    await cleanupProjectImages(images);
    throw error;
  }
};

export const getProjects = async (
  query: ProjectQueryInput,
  publicOnly = false
) => {
  const { page, limit } = query;
  const { skip } = getPagination({ page, limit });

  const filter: Record<string, unknown> = {};

  if (publicOnly) {
    filter.published = true;
  } else if (query.published !== undefined) {
    filter.published = query.published;
  }

  if (query.category) {
    filter.category = query.category.toLowerCase();
  }

  if (query.style) {
    filter.style = query.style.toLowerCase();
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured;
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { location: { $regex: query.search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Project.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Project.countDocuments(filter),
  ]);

  return {
    items,
    pagination: createPaginationMeta(page, limit, total),
  };
};

export const getProjectById = async (
  id: string
): Promise<IProject> => {
  return findProjectOrThrow(id);
};

export const getPublicProjectBySlug = async (
  slug: string
): Promise<IProject> => {
  const project = await Project.findOne({
    slug: slug.toLowerCase(),
    published: true,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

export const updateProject = async (
  id: string,
  data: UpdateProjectInput,
  files: Express.Multer.File[] = []
): Promise<IProject> => {
  const project = await findProjectOrThrow(id);

  if (data.slug && data.slug !== project.slug) {
    const slugExists = await Project.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (slugExists) {
      throw new ApiError(
        409,
        "A project with this slug already exists"
      );
    }
  }

  const uploadedImages = await uploadFiles(files);

  try {
    const updateData: Record<string, unknown> = {
      ...data,
    };

    if (data.category) {
      updateData.category = data.category.toLowerCase();
    }

    if (data.style) {
      updateData.style = data.style.toLowerCase();
    }

    if (data.materials) {
      updateData.materials = data.materials.map((item) =>
        item.toLowerCase()
      );
    }

    if (uploadedImages.length) {
      updateData.images = [
        ...project.images,
        ...uploadedImages,
      ];
    }

    Object.assign(project, updateData);
    await project.save();

    return project;
  } catch (error) {
    await cleanupProjectImages(uploadedImages);
    throw error;
  }
};

export const deleteProject = async (
  id: string
): Promise<void> => {
  const project = await findProjectOrThrow(id);

  const allImages = [
    ...project.images,
    ...(project.beforeImage ? [project.beforeImage] : []),
    ...(project.afterImage ? [project.afterImage] : []),
  ];

  await cleanupProjectImages(allImages);

  await Project.deleteOne({ _id: id });
};

export const publishProject = async (
  id: string
): Promise<IProject> => {
  const project = await findProjectOrThrow(id);

  project.published = true;
  await project.save();

  return project;
};

export const unpublishProject = async (
  id: string
): Promise<IProject> => {
  const project = await findProjectOrThrow(id);

  project.published = false;
  await project.save();

  return project;
};

export const removeProjectImage = async (
  id: string,
  publicId: string
): Promise<IProject> => {
  const project = await findProjectOrThrow(id);

  const index = project.images.findIndex(
    (image) => image.publicId === publicId
  );

  if (index === -1) {
    throw new ApiError(404, "Project image not found");
  }

  const [image] = project.images.splice(index, 1);

  await project.save();
  await deleteProjectImage(image.publicId);

  return project;
};

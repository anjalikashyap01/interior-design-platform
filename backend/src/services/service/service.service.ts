import Service, {
  IService,
} from "../../models/Service";
import {
  CreateServiceInput,
  ServiceQueryInput,
  UpdateServiceInput,
} from "../../schemas/service.schema";
import { ApiError } from "../../utils/api-error";
import {
  createPaginationMeta,
  getPagination,
} from "../../utils/pagination";

/* =========================================================
   Find Service
========================================================= */

const findServiceOrThrow = async (
  id: string
): Promise<IService> => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

/* =========================================================
   Create Service
========================================================= */

export const createService = async (
  data: CreateServiceInput
): Promise<IService> => {
  const existing = await Service.findOne({
    slug: data.slug,
  });

  if (existing) {
    throw new ApiError(
      409,
      "A service with this slug already exists"
    );
  }

  return Service.create({
    ...data,
    slug: data.slug.toLowerCase(),
    name: data.name.trim(),
    features: data.features.map((item) =>
      item.trim()
    ),
  });
};

/* =========================================================
   Get Services
========================================================= */

export const getServices = async (
  query: ServiceQueryInput,
  publicOnly = false
) => {
  const { page, limit } = query;

  const { skip } = getPagination({
    page,
    limit,
  });

  const filter: Record<string, unknown> = {};

  /* Public catalog */
  if (publicOnly) {
    filter.status = "published";
  } else if (query.status !== undefined) {
    filter.status = query.status;
  }

  /* Featured */
  if (query.featured !== undefined) {
    filter.featured = query.featured;
  }

  /* Search */
  if (query.search) {
    filter.$or = [
      {
        name: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  const [items, total] = await Promise.all([
    Service.find(filter)
      .sort({
        featured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Service.countDocuments(filter),
  ]);

  return {
    items,
    pagination: createPaginationMeta(
      page,
      limit,
      total
    ),
  };
};

/* =========================================================
   Get Service By ID
========================================================= */

export const getServiceById = async (
  id: string
): Promise<IService> => {
  return findServiceOrThrow(id);
};

/* =========================================================
   Get Public Service By Slug
========================================================= */

export const getPublicServiceBySlug = async (
  slug: string
): Promise<IService> => {
  const service = await Service.findOne({
    slug: slug.toLowerCase(),
    status: "published",
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

/* =========================================================
   Update Service
========================================================= */

export const updateService = async (
  id: string,
  data: UpdateServiceInput
): Promise<IService> => {
  const service = await findServiceOrThrow(id);

  /* Check duplicate slug */
  if (
    data.slug &&
    data.slug !== service.slug
  ) {
    const slugExists = await Service.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (slugExists) {
      throw new ApiError(
        409,
        "A service with this slug already exists"
      );
    }
  }

  const updateData: Record<string, unknown> = {
    ...data,
  };

  if (data.slug) {
    updateData.slug =
      data.slug.toLowerCase();
  }

  if (data.name) {
    updateData.name =
      data.name.trim();
  }

  if (data.features) {
    updateData.features =
      data.features.map((item) =>
        item.trim()
      );
  }

  Object.assign(service, updateData);

  await service.save();

  return service;
};

/* =========================================================
   Delete Service
========================================================= */

export const deleteService = async (
  id: string
): Promise<void> => {
  await findServiceOrThrow(id);

  await Service.deleteOne({
    _id: id,
  });
};

/* =========================================================
   Publish Service
========================================================= */

export const publishService = async (
  id: string
): Promise<IService> => {
  const service =
    await findServiceOrThrow(id);

  service.status = "published";

  await service.save();

  return service;
};

/* =========================================================
   Unpublish Service
========================================================= */

export const unpublishService = async (
  id: string
): Promise<IService> => {
  const service =
    await findServiceOrThrow(id);

  service.status = "draft";

  await service.save();

  return service;
};
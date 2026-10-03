import About from "../models/About";
import {
  deleteImage,
} from "./cloudinary/cloudinary.service";
import type {
  CreateAboutInput,
  UpdateAboutInput,
} from "../schemas/about.schema";

export const getAbout = async () => {
  return About.findOne().sort({ createdAt: 1 });
};

export const createAbout = async (
  data: CreateAboutInput
) => {
  const existingAbout = await About.findOne();

  if (existingAbout) {
    throw new Error(
      "About information already exists. Update the existing About page instead."
    );
  }

  return About.create(data);
};

export const updateAbout = async (
  data: UpdateAboutInput
) => {
  const about = await getAbout();

  if (!about) {
    throw new Error("About information not found");
  }

  const oldPublicIds = collectAboutImagePublicIds(about);

  Object.assign(about, data);

  await about.save();

  const newPublicIds = collectAboutImagePublicIds(about);

  const removedPublicIds = oldPublicIds.filter(
    (publicId) => !newPublicIds.includes(publicId)
  );

  await deleteAboutCloudinaryImages(removedPublicIds);

  return about;
};

export const deleteAbout = async () => {
  const about = await getAbout();

  if (!about) {
    throw new Error("About information not found");
  }

  const publicIds = collectAboutImagePublicIds(about);

  await about.deleteOne();

  await deleteAboutCloudinaryImages(publicIds);

  return about;
};

export const deleteAboutImageByPublicId = async (
  publicId: string
) => {
  const about = await getAbout();

  if (!about) {
    throw new Error("About information not found");
  }

  const exists = collectAboutImagePublicIds(about).includes(
    publicId
  );

  if (!exists) {
    throw new Error(
      "The specified image does not belong to the About page"
    );
  }

  await removeImageReference(about, publicId);

  await about.save();

  try {
    await deleteImage(publicId);
  } catch (error) {
    console.error(
      `Failed to delete About image: ${publicId}`,
      error
    );
  }

  return about;
};

const collectAboutImagePublicIds = (
  about: any
): string[] => {
  const publicIds: string[] = [];

  if (Array.isArray(about.hero?.images)) {
    for (const image of about.hero.images) {
      if (image?.publicId) {
        publicIds.push(image.publicId);
      }
    }
  }

  if (about.story?.image?.publicId) {
    publicIds.push(about.story.image.publicId);
  }

  if (about.founder?.photo?.publicId) {
    publicIds.push(about.founder.photo.publicId);
  }

  if (Array.isArray(about.materials)) {
    for (const material of about.materials) {
      if (material?.image?.publicId) {
        publicIds.push(material.image.publicId);
      }
    }
  }

  if (Array.isArray(about.trustedBrands)) {
    for (const brand of about.trustedBrands) {
      if (brand?.logo?.publicId) {
        publicIds.push(brand.logo.publicId);
      }
    }
  }

  if (about.cta?.backgroundImage?.publicId) {
    publicIds.push(
      about.cta.backgroundImage.publicId
    );
  }

  return [...new Set(publicIds)];
};

const deleteAboutCloudinaryImages = async (
  publicIds: string[]
) => {
  for (const publicId of publicIds) {
    try {
      await deleteImage(publicId);
    } catch (error) {
      console.error(
        `Failed to delete About image: ${publicId}`,
        error
      );
    }
  }
};

const removeImageReference = async (
  about: any,
  publicId: string
) => {
  if (Array.isArray(about.hero?.images)) {
    about.hero.images = about.hero.images.filter(
      (image: { publicId?: string }) =>
        image.publicId !== publicId
    );
  }

  if (about.story?.image?.publicId === publicId) {
    about.story.image = undefined;
  }

  if (about.founder?.photo?.publicId === publicId) {
    about.founder.photo = undefined;
  }

  if (Array.isArray(about.materials)) {
    for (const material of about.materials) {
      if (material?.image?.publicId === publicId) {
        material.image = undefined;
      }
    }
  }

  if (Array.isArray(about.trustedBrands)) {
    for (const brand of about.trustedBrands) {
      if (brand?.logo?.publicId === publicId) {
        brand.logo = undefined;
      }
    }
  }

  if (
    about.cta?.backgroundImage?.publicId === publicId
  ) {
    about.cta.backgroundImage = undefined;
  }
};
import { Request, Response } from "express";

import Design from "../models/Design";
import Project from "../models/Project";
import Service from "../models/Service";
import Testimonial from "../models/Testimonial";
import Consultation from "../models/Consultation";

import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";

const ACTIVE_CONSULTATION_STATUSES = [
  "pending",
  "contacted",
  "confirmed",
] as const;

export const getAdminDashboardController = asyncHandler(
  async (_req: Request, res: Response) => {
    const [
      totalDesigns,
      publishedDesigns,
      totalProjects,
      publishedProjects,
      totalServices,
      publishedServices,
      totalTestimonials,
      publishedTestimonials,
      newConsultations,
      contactedConsultations,
      confirmedConsultations,
      completedConsultations,
      recentConsultations,
    ] = await Promise.all([
      Design.countDocuments(),

      Design.countDocuments({
        published: true,
        isArchived: false,
      }),

      Project.countDocuments(),

      Project.countDocuments({
        published: true,
      }),

      Service.countDocuments(),

      Service.countDocuments({
        status: "published",
      }),

      Testimonial.countDocuments(),

      Testimonial.countDocuments({
        status: "published",
      }),

      Consultation.countDocuments({
        status: "pending",
      }),

      Consultation.countDocuments({
        status: "contacted",
      }),

      Consultation.countDocuments({
        status: "confirmed",
      }),

      Consultation.countDocuments({
        status: "completed",
      }),

      Consultation.find({
        status: {
          $in: ACTIVE_CONSULTATION_STATUSES,
        },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return sendSuccess(res, {
      message: "Admin dashboard fetched successfully",
      data: {
        counts: {
          designs: {
            total: totalDesigns,
            published: publishedDesigns,
          },

          projects: {
            total: totalProjects,
            published: publishedProjects,
          },

          services: {
            total: totalServices,
            published: publishedServices,
          },

          testimonials: {
            total: totalTestimonials,
            published: publishedTestimonials,
          },
        },

        consultations: {
          new: newConsultations,

          inProgress:
            contactedConsultations +
            confirmedConsultations,

          contacted: contactedConsultations,
          confirmed: confirmedConsultations,
          completed: completedConsultations,

          recentActive: recentConsultations,
        },
      },
    });
  }
);
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://interior-design-platform-u1fg.onrender.com/api";

  const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  retries = 2
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(input, init);

      // Retry temporary Render errors while the backend is waking up.
      if (
        [502, 503, 504].includes(response.status) &&
        attempt < retries
      ) {
        await sleep(3000 * (attempt + 1));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw error;
      }

      await sleep(3000 * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Request failed after retries");
};

/* =========================================================
   TYPES
========================================================= */

export interface DesignImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface Design {
  _id: string;
  title: string;
  slug: string;
  description: string;
  roomType: string;
  style: string;
  colors: string[];
  materials: string[];
  budgetMin?: number;
  budgetMax?: number;
  tags: string[];
  images: DesignImage[];
  aiEnabled: boolean;
  featured: boolean;
  published: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignListData {
  items: Design[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  category?: string;
  style?: string;
  images: ProjectImage[];
  beforeImage?: ProjectImage;
  afterImage?: ProjectImage;
  materials: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListData {
  items: Project[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image?: string;
  startingPrice?: number;
  features: string[];
  status: "draft" | "published";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListData {
  items: Service[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Testimonial {
  _id: string;
  customerName: string;
  role?: string;
  rating: number;
  content: string;
  imageUrl?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
export interface TestimonialListData {
  testimonials: Testimonial[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminDashboardConsultation {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  consultationType: "online" | "phone" | "site_visit";
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardData {
  counts: {
    designs: {
      total: number;
      published: number;
    };
    projects: {
      total: number;
      published: number;
    };
    services: {
      total: number;
      published: number;
    };
    testimonials: {
      total: number;
      published: number;
    };
  };
  consultations: {
    new: number;
    inProgress: number;
    contacted: number;
    confirmed: number;
    completed: number;
    recentActive: AdminDashboardConsultation[];
  };
}

interface AdminLoginResponse {
  token: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN";
    isActive: boolean;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  details?: unknown;
}

/* =========================================================
   ADMIN AUTH HELPERS
========================================================= */

const getAdminToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("adminToken");
};

const getAdminHeaders = (): HeadersInit => {
  const token = getAdminToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const clearAdminToken = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("adminToken");
  window.dispatchEvent(new Event("admin-auth-changed"));
};

/* =========================================================
   RESPONSE HANDLER
========================================================= */

const handleResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  let data: ApiResponse<T>;

  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status})`
    );
  }

  if (response.status === 401) {
    clearAdminToken();
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =========================================================
   ADMIN AUTH API
========================================================= */

export const adminAuthApi = {
  async login(
    email: string,
    password: string
  ): Promise<AdminLoginResponse> {
    const response = await fetch(
      `${API_URL}/admin/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result =
      await handleResponse<AdminLoginResponse>(
        response
      );

    if (!result.data?.token) {
      throw new Error(
        "Login successful but admin token was not returned"
      );
    }

    localStorage.setItem(
      "adminToken",
      result.data.token
    );

    return result.data;
  },

  logout(): void {
    clearAdminToken();
  },

  isAuthenticated(): boolean {
    return Boolean(getAdminToken());
  },

  getToken(): string | null {
    return getAdminToken();
  },
};



export const adminDashboardApi = {
  async getDashboard(): Promise<AdminDashboardData> {
    const response = await fetch(
      `${API_URL}/admin/dashboard`,
      {
        method: "GET",
        headers: {
          ...getAdminHeaders(),
        },
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<AdminDashboardData>(response);

    if (!result.data) {
      throw new Error(
        result.message ||
          "Dashboard data was not returned by the server"
      );
    }

    return result.data;
  },
};


/* =========================================================
   ADMIN DESIGN API
========================================================= */

export const adminDesignApi = {
  /* -------------------------------------------------------
     GET ALL DESIGNS
  ------------------------------------------------------- */

  async getDesigns(): Promise<DesignListData> {
    const response = await fetch(
      `${API_URL}/admin/designs`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<DesignListData>(
        response
      );

    if (!result.data) {
      return {
        items: [],
      };
    }

    return result.data;
  },

  /* -------------------------------------------------------
     GET SINGLE DESIGN
  ------------------------------------------------------- */

  async getDesign(
    id: string
  ): Promise<Design> {
    const response = await fetch(
      `${API_URL}/admin/designs/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Design>(response);

    if (!result.data) {
      throw new Error("Design not found");
    }

    return result.data;
  },

  /* -------------------------------------------------------
     CREATE DESIGN
  ------------------------------------------------------- */

  async createDesign(
    formData: FormData
  ): Promise<Design> {
    const response = await fetch(
      `${API_URL}/admin/designs`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<Design>(response);

    if (!result.data) {
      throw new Error(
        "Design creation failed"
      );
    }

    return result.data;
  },

  /* -------------------------------------------------------
     UPDATE DESIGN
  ------------------------------------------------------- */

  async updateDesign(
    id: string,
    formData: FormData
  ): Promise<Design> {
    const response = await fetch(
      `${API_URL}/admin/designs/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<Design>(response);

    if (!result.data) {
      throw new Error(
        "Design update failed"
      );
    }

    return result.data;
  },

  /* -------------------------------------------------------
     DELETE DESIGN
  ------------------------------------------------------- */

  async deleteDesign(
    id: string
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/admin/designs/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    await handleResponse(response);
  },

  /* -------------------------------------------------------
     PUBLISH
  ------------------------------------------------------- */

  async publishDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "publish");
  },

  /* -------------------------------------------------------
     UNPUBLISH
  ------------------------------------------------------- */

  async unpublishDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "unpublish");
  },

  /* -------------------------------------------------------
     ARCHIVE
  ------------------------------------------------------- */

  async archiveDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "archive");
  },

  /* -------------------------------------------------------
     UNARCHIVE
  ------------------------------------------------------- */

  async unarchiveDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "unarchive");
  },

  /* -------------------------------------------------------
     GENERIC DESIGN ACTION
  ------------------------------------------------------- */

  async action(
    id: string,
    action:
      | "publish"
      | "unpublish"
      | "archive"
      | "unarchive"
  ): Promise<Design> {
    const response = await fetch(
      `${API_URL}/admin/designs/${encodeURIComponent(id)}/${action}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    const result =
      await handleResponse<Design>(response);

    if (!result.data) {
      throw new Error(
        `Unable to ${action} design`
      );
    }

    return result.data;
  },

  /* -------------------------------------------------------
     DELETE DESIGN IMAGE
  ------------------------------------------------------- */

  async deleteDesignImage(
    id: string,
    publicId: string
  ): Promise<Design> {
    const response = await fetch(
      `${API_URL}/admin/designs/${encodeURIComponent(id)}/images`,
      {
        method: "DELETE",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    const result =
      await handleResponse<Design>(response);

    if (!result.data) {
      throw new Error(
        "Unable to delete design image"
      );
    }

    return result.data;
  },
};

/* =========================================================
   ADMIN PROJECT API
========================================================= */

export const adminProjectApi = {
  async getProjects(): Promise<ProjectListData> {
    const response = await fetch(
      `${API_URL}/admin/projects`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<ProjectListData>(
        response
      );

    return result.data ?? { items: [] };
  },

  async getProject(
    id: string
  ): Promise<Project> {
    const response = await fetch(
      `${API_URL}/admin/projects/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Project>(response);

    if (!result.data) {
      throw new Error("Project not found");
    }

    return result.data;
  },

  async createProject(
    formData: FormData
  ): Promise<Project> {
    const response = await fetch(
      `${API_URL}/admin/projects`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<Project>(response);

    if (!result.data) {
      throw new Error(
        "Project creation failed"
      );
    }

    return result.data;
  },

  async updateProject(
    id: string,
    formData: FormData
  ): Promise<Project> {
    const response = await fetch(
      `${API_URL}/admin/projects/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<Project>(response);

    if (!result.data) {
      throw new Error(
        "Project update failed"
      );
    }

    return result.data;
  },

  async deleteProject(
    id: string
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/admin/projects/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    await handleResponse(response);
  },

  async publishProject(
    id: string
  ): Promise<Project> {
    return this.action(id, "publish");
  },

  async unpublishProject(
    id: string
  ): Promise<Project> {
    return this.action(id, "unpublish");
  },

  async action(
    id: string,
    action: "publish" | "unpublish"
  ): Promise<Project> {
    const response = await fetch(
      `${API_URL}/admin/projects/${encodeURIComponent(id)}/${action}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    const result =
      await handleResponse<Project>(response);

    if (!result.data) {
      throw new Error(
        `Unable to ${action} project`
      );
    }

    return result.data;
  },

  async deleteProjectImage(
    id: string,
    publicId: string
  ): Promise<Project> {
    const response = await fetch(
      `${API_URL}/admin/projects/${encodeURIComponent(id)}/images`,
      {
        method: "DELETE",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    const result =
      await handleResponse<Project>(response);

    if (!result.data) {
      throw new Error(
        "Unable to delete project image"
      );
    }

    return result.data;
  },
};

/* =========================================================
   ADMIN SERVICE API
========================================================= */

export const adminServiceApi = {
  async getServices(): Promise<ServiceListData> {
    const response = await fetch(
      `${API_URL}/admin/services`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<ServiceListData>(
        response
      );

    return result.data ?? { items: [] };
  },

  async getService(
    id: string
  ): Promise<Service> {
    const response = await fetch(
      `${API_URL}/admin/services/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Service>(response);

    if (!result.data) {
      throw new Error("Service not found");
    }

    return result.data;
  },

async createService(formData: FormData): Promise<Service> {
  const response = await fetch(`${API_URL}/admin/services`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: formData,
  });

  const result = await handleResponse<Service>(response);

  if (!result.data) {
    throw new Error("Service creation failed");
  }

  return result.data;
},


 async updateService(
  id: string,
  formData: FormData
): Promise<Service> {
  formData.append("_id", id);

  const response = await fetch(`${API_URL}/admin/services`, {
    method: "PATCH",
    headers: getAdminHeaders(),
    body: formData,
  });

  const result = await handleResponse<Service>(response);

  if (!result.data) {
    throw new Error("Service update failed");
  }

  return result.data;
},

  async deleteService(
    id: string
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/admin/services`,
      {
        method: "DELETE",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      }
    );

    await handleResponse(response);
  },

  async publishService(
    id: string
  ): Promise<Service> {
    const response = await fetch(
      `${API_URL}/admin/services/publish`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      }
    );

    const result =
      await handleResponse<Service>(response);

    if (!result.data) {
      throw new Error("Unable to publish service");
    }

    return result.data;
  },

  async unpublishService(
    id: string
  ): Promise<Service> {
    const response = await fetch(
      `${API_URL}/admin/services/unpublish`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      }
    );

    const result =
      await handleResponse<Service>(response);

    if (!result.data) {
      throw new Error("Unable to unpublish service");
    }

    return result.data;
  },
};

/* =========================================================
   ADMIN TESTIMONIAL API
========================================================= */

export const adminTestimonialApi = {
  /* GET ALL TESTIMONIALS */

  async getTestimonials(): Promise<TestimonialListData> {
    const response = await fetch(
      `${API_URL}/admin/testimonials`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<TestimonialListData>(response);

    return result.data ?? {
      testimonials: [],
    };
  },

  /* GET SINGLE TESTIMONIAL */

  async getTestimonial(id: string): Promise<Testimonial> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Testimonial>(response);

    if (!result.data) {
      throw new Error("Testimonial not found");
    }

    return result.data;
  },

  /* CREATE TESTIMONIAL */

  async createTestimonial(
    formData: FormData
  ): Promise<Testimonial> {
    const response = await fetch(
      `${API_URL}/admin/testimonials`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<Testimonial>(response);

    if (!result.data) {
      throw new Error("Testimonial creation failed");
    }

    return result.data;
  },

  /* UPDATE TESTIMONIAL */

  async updateTestimonial(
    id: string,
    formData: FormData
  ): Promise<Testimonial> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<Testimonial>(response);

    if (!result.data) {
      throw new Error("Testimonial update failed");
    }

    return result.data;
  },

  /* DELETE TESTIMONIAL */

  async deleteTestimonial(id: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    await handleResponse(response);
  },

  /* PUBLISH TESTIMONIAL */

  async publishTestimonial(
    id: string
  ): Promise<Testimonial> {
    return this.action(id, "publish");
  },

  /* UNPUBLISH TESTIMONIAL */

  async unpublishTestimonial(
    id: string
  ): Promise<Testimonial> {
    return this.action(id, "unpublish");
  },

  /* GENERIC TESTIMONIAL ACTION */

  async action(
    id: string,
    action: "publish" | "unpublish"
  ): Promise<Testimonial> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${encodeURIComponent(id)}/${action}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    const result =
      await handleResponse<Testimonial>(response);

    if (!result.data) {
      throw new Error(
        `Unable to ${action} testimonial`
      );
    }

    return result.data;
  },
};

/* =========================================================
   ADMIN ABOUT API
========================================================= */

export const adminAboutApi = {
  async getAbout(): Promise<About> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<About>(response);

    if (!result.data) {
      throw new Error(
        "About information not found"
      );
    }

    return result.data;
  },

  async createAbout(
    payload: Omit<About, "_id" | "createdAt" | "updatedAt">
  ): Promise<About> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "POST",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result =
      await handleResponse<About>(response);

    if (!result.data) {
      throw new Error(
        "About information creation failed"
      );
    }

    return result.data;
  },

  async updateAbout(
    payload: Partial<About>
  ): Promise<About> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result =
      await handleResponse<About>(response);

    if (!result.data) {
      throw new Error(
        "About information update failed"
      );
    }

    return result.data;
  },

  async deleteAbout(): Promise<void> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    await handleResponse(response);
  },

  async uploadImages(
    files: File[]
  ): Promise<AboutImage[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(
      `${API_URL}/admin/about/images`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: formData,
      }
    );

    const result =
      await handleResponse<{
        images: AboutImage[];
      }>(response);

    if (!result.data?.images) {
      throw new Error(
        "About images upload failed"
      );
    }

    return result.data.images;
  },

  async deleteImage(
    publicId: string
  ): Promise<About> {
    const response = await fetch(
      `${API_URL}/admin/about/images`,
      {
        method: "DELETE",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    const result =
      await handleResponse<About>(response);

    if (!result.data) {
      throw new Error(
        "Unable to delete About image"
      );
    }

    return result.data;
  },
};



/* =========================================================
   PUBLIC ABOUT API
========================================================= */

export const publicAboutApi = {
  async getAbout(): Promise<About> {
    const response = await fetchWithRetry(
  `${API_URL}/about`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<About>(response);

    if (!result.data) {
      throw new Error(
        "About information not found"
      );
    }

    return result.data;
  },
}; 




/* =========================================================
   PUBLIC TESTIMONIAL API
========================================================= */

export const publicTestimonialApi = {
  async getTestimonials(): Promise<Testimonial[]> {
    const response = await fetchWithRetry(
      `${API_URL}/testimonials`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Testimonial[]>(response);

    return result.data ?? [];
  },
};


/* =========================================================
   PUBLIC DESIGN API
========================================================= */

export interface PublicDesignQuery {
  page?: number;
  limit?: number;
  roomType?: string;
  style?: string;
  color?: string;
  material?: string;
  featured?: boolean;
  search?: string;
}

export const publicDesignApi = {
  async getDesigns(
    query: PublicDesignQuery = {}
  ): Promise<DesignListData> {
    const params = new URLSearchParams();

    if (query.page !== undefined) {
      params.set("page", String(query.page));
    }

    if (query.limit !== undefined) {
      params.set("limit", String(query.limit));
    }

    if (query.roomType) {
      params.set("roomType", query.roomType);
    }

    if (query.style) {
      params.set("style", query.style);
    }

    if (query.color) {
      params.set("color", query.color);
    }

    if (query.material) {
      params.set("material", query.material);
    }

    if (query.featured !== undefined) {
      params.set("featured", String(query.featured));
    }

    if (query.search) {
      params.set("search", query.search);
    }

    const response = await fetchWithRetry(
      `${API_URL}/designs?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<DesignListData>(response);

    return result.data ?? {
      items: [],
    };
  },

  async getDesignBySlug(
    slug: string
  ): Promise<Design> {
    const response = await fetchWithRetry(
      `${API_URL}/designs/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Design>(response);

    if (!result.data) {
      throw new Error("Design not found");
    }

    return result.data;
  },
};


/* =========================================================
   PUBLIC PROJECT API
========================================================= */

export const publicProjectApi = {
  async getProjects(): Promise<ProjectListData> {
    const response = await fetchWithRetry(`${API_URL}/projects`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await handleResponse<ProjectListData>(response);

    return result.data ?? { items: [] };
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const response = await fetchWithRetry(
      `${API_URL}/projects/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result = await handleResponse<Project>(response);

    if (!result.data) {
      throw new Error("Project not found");
    }

    return result.data;
  },
};


/* =========================================================
   PUBLIC SERVICE API
========================================================= */

export const publicServiceApi = {
  async getServices(): Promise<ServiceListData> {
    const response = await fetchWithRetry(`${API_URL}/services`, {
      method: "GET",
      cache: "no-store",
    });

    const result =
      await handleResponse<ServiceListData>(response);

    return result.data ?? {
      items: [],
    };
  },

  async getServiceBySlug(slug: string): Promise<Service> {
    const response = await fetchWithRetry(
      `${API_URL}/services/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Service>(response);

    if (!result.data) {
      throw new Error("Service not found");
    }

    return result.data;
  },
};


/* =========================================================
   PUBLIC CONSULTATION API
========================================================= */

export interface CreateConsultationPayload {
  name: string;
  phone: string;
  email?: string;
  consultationType:
    | "online"
    | "phone"
    | "site_visit";
  userId?: string;
  leadId?: string;
  selectedDesignId?: string;
  roomImage?: {
    url: string;
    publicId: string;
  };
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
}

export interface Consultation {
  _id: string;
  name: string;
  phone: string;
  consultationType:
    | "online"
    | "phone"
    | "site_visit";
  userId?: string;
  leadId?: string;
  selectedDesignId?: string;
  roomImage?: {
    url: string;
    publicId: string;
    alt?: string;
  };
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
  status:
    | "pending"
    | "contacted"
    | "confirmed"
    | "completed"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export const publicConsultationApi = {
  async createConsultation(
    payload: CreateConsultationPayload
  ): Promise<Consultation> {
    const response = await fetch(`${API_URL}/consultations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result =
      await handleResponse<Consultation>(response);

    if (!result.data) {
      throw new Error("Failed to create consultation");
    }

    return result.data;
  },
};
/* =========================================================
   OFFICE API
========================================================= */

export interface OfficeHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface OfficeSocialHandle {
  platform: string;
  url: string;
}

export interface Office {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;

  showSocialHandles: boolean;
  socialHandles: OfficeSocialHandle[];

  workingHours: {
    monday: OfficeHours;
    tuesday: OfficeHours;
    wednesday: OfficeHours;
    thursday: OfficeHours;
    friday: OfficeHours;
    saturday: OfficeHours;
    sunday: OfficeHours;
  };

  createdAt: string;
  updatedAt: string;
}
export interface OfficePayload {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;

  showSocialHandles: boolean;
  socialHandles: OfficeSocialHandle[];

  workingHours: {
    monday: OfficeHours;
    tuesday: OfficeHours;
    wednesday: OfficeHours;
    thursday: OfficeHours;
    friday: OfficeHours;
    saturday: OfficeHours;
    sunday: OfficeHours;
  };
}

export const adminOfficeApi = {
  async getOffice(): Promise<Office> {
    const response = await fetch(
      `${API_URL}/admin/office`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Office>(response);

    if (!result.data) {
      throw new Error("Office information not found");
    }

    return result.data;
  },

  async createOffice(
    payload: OfficePayload
  ): Promise<Office> {
    const response = await fetch(
      `${API_URL}/admin/office`,
      {
        method: "POST",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result =
      await handleResponse<Office>(response);

    if (!result.data) {
      throw new Error("Office creation failed");
    }

    return result.data;
  },

  async updateOffice(
    payload: Partial<OfficePayload>
  ): Promise<Office> {
    const response = await fetch(
      `${API_URL}/admin/office`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result =
      await handleResponse<Office>(response);

    if (!result.data) {
      throw new Error("Office update failed");
    }

    return result.data;
  },

  async deleteOffice(): Promise<void> {
    const response = await fetch(
      `${API_URL}/admin/office`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    await handleResponse(response);
  },
};

/* =========================================================
   PUBLIC OFFICE API
========================================================= */

export const publicOfficeApi = {
  async getOffice(): Promise<Office> {
    const response = await fetchWithRetry(
      `${API_URL}/office`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<Office>(response);

    if (!result.data) {
      throw new Error("Office information not found");
    }

    return result.data;
  },
};

/* =========================================================
   ABOUT TYPES
========================================================= */

export interface AboutImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface AboutProcessStep {
  number: string;
  title: string;
  description?: string;
}

export interface AboutMaterial {
  name: string;
  image?: AboutImage;
}

export type AboutBrandRelationship =
  | "used"
  | "preferred-supplier"
  | "certified-partner"
  | "official-partner"
  | "other";

export interface AboutBrand {
  name: string;
  logo?: AboutImage;
  category?: string;
  website?: string;
  relationship: AboutBrandRelationship;
  description?: string;
  visible: boolean;
}

export interface AboutTrustPoint {
  title: string;
  description: string;
}

export interface AboutFounderHighlight {
  value: string;
  label: string;
}

export interface About {
  _id: string;

  hero: {
    heading: string;
    description: string;
    images: AboutImage[];
  };

  story: {
    heading: string;
    content: string;
    image?: AboutImage;
  };

  designPhilosophy: {
    heading: string;
    content: string;
  };

  founder: {
    name: string;
    role: string;
    bio: string;
    photo?: AboutImage;
    highlights: AboutFounderHighlight[];
  };

  processSteps: AboutProcessStep[];

  materials: AboutMaterial[];

  trustedBrands: AboutBrand[];

  trustPoints: AboutTrustPoint[];

  cta: {
    heading: string;
    description: string;
    buttonText: string;
    backgroundImage?: AboutImage;
  };

  createdAt: string;
  updatedAt: string;
}




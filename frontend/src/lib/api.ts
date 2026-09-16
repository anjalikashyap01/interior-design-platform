
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";


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

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  details?: unknown;
}

interface DesignListData {
  designs: Design[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("adminToken");
};



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



export const adminDesignApi = {
  

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
      await handleResponse<DesignListData>(response);

    return (
      result.data ?? {
        designs: [],
      }
    );
  },

  

  async getDesign(id: string): Promise<Design> {
    const response = await fetch(
      `${API_URL}/admin/designs/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    const result =
      await handleResponse<{ design: Design }>(
        response
      );

    if (!result.data?.design) {
      throw new Error("Design not found");
    }

    return result.data.design;
  },

 

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
      await handleResponse<{ design: Design }>(
        response
      );

    if (!result.data?.design) {
      throw new Error(
        "Design creation failed"
      );
    }

    return result.data.design;
  },


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
      await handleResponse<{ design: Design }>(
        response
      );

    if (!result.data?.design) {
      throw new Error(
        "Design update failed"
      );
    }

    return result.data.design;
  },

  

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

  

  async publishDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "publish");
  },

  

  async unpublishDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "unpublish");
  },

  

  async archiveDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "archive");
  },

 

  async unarchiveDesign(
    id: string
  ): Promise<Design> {
    return this.action(id, "unarchive");
  },

 

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
      await handleResponse<{ design: Design }>(
        response
      );

    if (!result.data?.design) {
      throw new Error(
        `Unable to ${action} design`
      );
    }

    return result.data.design;
  },

  

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
      await handleResponse<{ design: Design }>(
        response
      );

    if (!result.data?.design) {
      throw new Error(
        "Unable to delete design image"
      );
    }

    return result.data.design;
  },
}
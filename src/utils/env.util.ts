type ENV_TYPE = {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE: string;
    AUTH_COOKIE_TOKEN: string;
    JWT_SECRET: string;
}

export const ENV = import.meta.env as unknown as ENV_TYPE;
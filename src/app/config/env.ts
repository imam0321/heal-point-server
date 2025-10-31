import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    FRONTEND_URL: string;
    BCRYPT_SALT_ROUND: string;
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_CLOUD_API_KEY: string;
        CLOUDINARY_CLOUD_API_SECRET: string;
    };
    JWT: {
        JWT_ACCESS_SECRET: string;
        JWT_ACCESS_EXPIRES: string;
        JWT_REFRESH_SECRET: string;
        JWT_REFRESH_EXPIRES: string;
    },
    OPEN_ROUTER_API_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string
    EMAIL_SENDER: {
        SMTP_HOST: string;
        SMTP_POST: string;
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_FROM: string;
    };
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariable: string[] = [
        "PORT",
        "DATABASE_URL",
        "NODE_ENV",
        "FRONTEND_URL",
        "BCRYPT_SALT_ROUND",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_CLOUD_API_KEY",
        "CLOUDINARY_CLOUD_API_SECRET",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "OPEN_ROUTER_API_KEY",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "SMTP_HOST",
        "SMTP_POST",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_FROM",
    ];

    requiredEnvVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_CLOUD_API_KEY: process.env.CLOUDINARY_CLOUD_API_KEY as string,
            CLOUDINARY_CLOUD_API_SECRET: process.env.CLOUDINARY_CLOUD_API_SECRET as string,
        },
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        },
        OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY as string,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_POST: process.env.SMTP_POST as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
    };
};

export const envVars = loadEnvVariables();
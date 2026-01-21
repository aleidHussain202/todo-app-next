import { z } from 'zod';



// Schema for creating a new user
export const registerSchema = z.object({

    // name constraints
    name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

    // email constraints
    email: z.email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),

    // password constraints
    password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});


// Schema for creating/updating todos (tasks)
export const todoSchema = z.object({

    // text constraints
    text: z.string()
    .min(5, "Task must be at least 5 characters")
    .max(500, "Task must be less than 500 characters")
    .trim()
    .transform(text => text.replace(/<[^>]*>/g, '')),
});

export const todoUpdateSchema = z.object({
  id: z.uuid("Invalid todo ID"),
  completed: z.boolean().optional(),
  text: z.string()
    .min(1)
    .max(500)
    .trim()
    .transform(text => text.replace(/<[^>]*>/g, ''))
    .optional(),
});


export const todoDeleteSchema = z.object({
  id: z.uuid("Invalid todo ID"),
});
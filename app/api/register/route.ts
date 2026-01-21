import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import z from "zod";

export async function POST(request: Request){
    // Get the data from the request to body 
    const body = await request.json();

    // run the body through the validation schema
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: z.flattenError(validation.error) }, 
      { status: 400 });
    }
    
    // destruct the data returned from validation
    const {name, email, password } = validation.data; 
    // Check if all fields exist


    // Check if user already exist 
    const existing = await prisma.user.findUnique({where: {email}});   
    if (existing) { return NextResponse.json(
    { error: 'Email already registered' },
    { status: 409 }
  ); }

    // Hash the password under 10 rounds of salt
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user in the database
    const user = await prisma.user.create({data: {
        name,
        email,
        password: hashedPassword
    }})

return NextResponse.json(
  { message: "User created successfully!" },
  { status: 201 } // 201 = Created
);

}
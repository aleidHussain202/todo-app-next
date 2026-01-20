import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(request: Request){
    // Get the data from the request body via destructuring
    const {name, email, password } = await request.json();
    
    // Check if all fields exist
    if (!name || !email || !password) { return NextResponse.json(
    { error: 'All fields are required' },
    { status: 400 }
  ); }

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
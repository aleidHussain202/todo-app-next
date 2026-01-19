
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'
// [STEP 1] GET: Fetch all todos
// export async function GET() {
//   1. Use prisma.todo.findMany({ orderBy: { createdAt: 'desc' } }) to fetch todos
//   2. Return the data using NextResponse.json(...)
// }





export async function GET(request: Request){

    // Get the session to find out who is logged in
    const session = await auth();

    //If no session, user is not logged in ie reject the request
    if(!session || !session.user?.email) {
        return NextResponse.json(
            {error: 'Unauthorized'},
            {status: 401}
        )
    }

    // Find the user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) { return NextResponse.json([]); }

    const todos = await prisma.todo.findMany({
        where: { userId: user.id },
        orderBy: {createdAt: 'desc'}
    });

    return NextResponse.json(todos);
}

// [STEP 2] POST: Create a new todo
// export async function POST(request: Request) {
//   1. Get the body: const body = await request.json();
//   2. Validate: if (!body.text) return NextResponse.json({ error: 'Text required' }, { status: 400 });
//   3. Create: const todo = await prisma.todo.create({ data: { text: body.text } });
//   4. Return the new todo
// }
export async function POST(request: Request){
    // Get the session to find out who is logged in
    const session = await auth()

    //If no session, user is not logged in ie reject the request
    if(!session || !session.user?.email) {
        return NextResponse.json(
            {error: 'Unauthorized'},
            {status: 401}
        )
    }

    // Get the text from the request
    const {text} = await request.json();
    if (!text){
        return NextResponse.json({error: 'Text required'}, {status: 400})
    }

    //Find the user in the database using their email
    const user = await prisma.user.findUnique({
        where: {email: session.user.email }
    });

    // Check if he user exist
    if(!user) {
        return NextResponse.json(
            { error: 'User not found!' },
            { status: 404 }
        )
    };

    // Create the todo task and associate it with userId
    const todo = await prisma.todo.create({
        data: {
            text: text,
            userId: user.id
        }
    });

    return NextResponse.json(todo);
}


// [STEP 3] PUT: Update a todo (toggle completed or edit text)
// export async function PUT(request: Request) {
//   1. Get body: const { id, completed, text } = await request.json();
//   2. Update: await prisma.todo.update({ where: { id }, data: { ... } });
//   3. Return the updated todo
// }


export async function PUT (request: Request){
    const {id, completed, text } = await request.json();

    // Get the session to find out who is logged in
    const session = await auth()

    //If no session, user is not logged in ie reject the request
    if(!session || !session.user?.email) {
        return NextResponse.json(
            {error: 'Unauthorized'},
            {status: 401}
        )
    }

    // Find the user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });
    
    if(!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }

    const updatedTodo = await prisma.todo.update({
        where: {
            id: id,
            userId: user.id
        },
        data: {
            completed: completed,
            text: text

        }
    });

    return NextResponse.json(updatedTodo);
}



// [STEP 4] DELETE: Remove a todo
// export async function DELETE(request: Request) {
//   1. Get body: const { id } = await request.json();
//   2. Delete: await prisma.todo.delete({ where: { id } });
//   3. Return success message
// }

export async function DELETE(request: Request) {

    // Get the session to find out who is logged in
    const session = await auth()

    //If no session, user is not logged in ie reject the request
    if(!session || !session.user?.email) {
        return NextResponse.json(
            {error: 'Unauthorized'},
            {status: 401}
        )
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    // Find the user
    if (!user) { return NextResponse.json(
        { error: 'User not found!'},
        { status: 404 }
    );}

    
    const { id } = await request.json();


    // Delete only if the todo belongs to this user
    await prisma.todo.delete({
        where: {
            id: id,
            userId: user.id
        }
    });

    return NextResponse.json({success: true});
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const {dinnerSlotId, roomNumber, peopleNumber} =await req.json();
    const result = await prisma.reservation.create({
        data:{
            dinnerSlotId,
            roomNumber: roomNumber,
            guestCount: peopleNumber,
        },
    });
    console.log(result)
    return NextResponse.json(result);
}

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const dinnerSlotId_1 = searchParams.get("dinnerSlotId_1")
    const dinnerSlotId_2 = searchParams.get("dinnerSlotId_2")

    const foundData = await prisma.reservation.findMany({
        where: {
            OR:[
                {dinnerSlotId:Number(dinnerSlotId_1)},
                {dinnerSlotId:Number(dinnerSlotId_2)},
            ]
        },
        include: {
            dinnerSlot: true,
        },
    });
    console.log(foundData)
    return NextResponse.json(foundData);
}
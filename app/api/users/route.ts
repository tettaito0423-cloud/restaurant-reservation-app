import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const {
        date,
        roomNumber, 
        adultCount, 
        childMealCount,
        childNoMealCount, 
        checkin, 
        checkout, 
        dietaryRestrictions, 
        comment,
    } = await req.json();
    const reservation = await prisma.reservation.create({
        data:{
            roomNumber: roomNumber,
            adultCount: adultCount,
            childMealCount: childMealCount,
            childNoMealCount: childNoMealCount,
            checkin: checkin,
            checkout: checkout,
            dietaryRestrictions: dietaryRestrictions,
            comment: comment,
        },
        
    });
    return NextResponse.json(reservation);
}

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date")

    const foundData = await prisma.stay.findMany({
        where: {
            date: {
                gte: new Date(`${date}T00:00:00+09:00`),
                lt: new Date(`${date}T23:59:59.999+09:00`),
            }
        },
        include: {
            reservation: true,
            dinners: {
                include: {dinnerSlot: true}
            },
            breakfasts: {
                include: {breakfastSlot: true}
            },
        },
    });
    return NextResponse.json(foundData);
}
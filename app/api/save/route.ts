import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  const {date, slots} =await req.json();

  //既存データを削除
  const startDate = new Date(`${date}T00:00:00+09:00`);
  const endDate = new Date(`${date}T23:59:59.999+09:00`);
  endDate.setDate(endDate.getDate() + 1);
  await prisma.dinnerSlot.deleteMany({
    where:{
      dinnerStartAt:{
        gte: startDate,
        lt: endDate,
      }
    }
  });

  //データを登録
  //フルコースのスケジュールを登録したら自動でハーフコース（18:15）も作らる。
  const data = slots.map((time:string)=>({
    dinnerStartAt: new Date(`${date}T${time}:00`),
  }))
  const result = await prisma.dinnerSlot.createMany({
    data,
  });
  return NextResponse.json(result);
}


export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const datesParams = searchParams.get("dates");
  const dates = datesParams ? datesParams.split(","): [];


  if(dates.length === 0){
    return NextResponse.json([]);
  }else if(dates.length === 1){
    const start = new Date(dates[0]);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const dateData = await prisma.dinnerSlot.findMany({
      where: {
        dinnerStartAt: {
          gte: start,
          lt: end
        }
      }
    })
    return NextResponse.json(dateData);
  }else{
    const foundData = await prisma.dinnerSlot.findMany({
      where: {
        dinnerStartAt: {
          gte: new Date(dates[0]),
          lt: new Date(dates[1]),
        },
      },
    });
    return NextResponse.json(foundData);
  }
}
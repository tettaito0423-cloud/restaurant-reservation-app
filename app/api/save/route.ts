import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  const {date, times} =await req.json();

  //既存データを削除
  const startDate = new Date(`${date}T00:00:00+09:00`);
  const endDate = new Date(`${date}T23:59:59.999+09:00`);
  endDate.setDate(endDate.getDate() + 1);
  await prisma.dinnerSlot.deleteMany({
    where:{
      startAt:{
        gte: startDate,
        lt: endDate,
      }
    }
  });

  //データを登録
  const data = times.map((time:string)=>({
    startAt: new Date(`${date}T${time}:00`),
  }))
  const result = await prisma.dinnerSlot.createMany({
    data,
  });
  return NextResponse.json(result);
}


export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date")
  if(date){
    const startDate = new Date(`${date}T00:00:00+09:00`);
    const endDate = new Date(`${date}T00:00:00+09:00`);
    endDate.setDate(endDate.getDate() + 1);

    const foundData = await prisma.dinnerSlot.findMany({
      where: {
        startAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
    const newData = foundData.map(item=>{
      const hour = String(item.startAt.getHours());
      const minute = String(item.startAt.getMinutes()).padStart(2, '0');
      return {...item, startAt:`${hour}:${minute}`};
    })
    console.log(newData)
    return NextResponse.json(newData);
  };

  const data = await prisma.dinnerSlot.findMany();
  return NextResponse.json(data);
}
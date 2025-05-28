import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Prodict";


//Config cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
    try {
        const { userID } = getAuth(request)


        const isSeller = await authSeller(userID)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "not authorized" })
        }
        const forData = await request.formData()

        const name = formData.get("name")
        const description = forData.get("description")
        const category = forData.get("category")
        const price = forData.get("price")
        const offerPrice = forData.get('offerPrice')

        const files = forData.getAll('images')

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "no files uploaded" })
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve, rejects) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) {
                                rejects(error)
                            } else {
                                resolve(result)
                            }
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = result.map(result => result.secure_url)

        await connectDB()
        const newProduct = await Product.create({
            userID,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            dte: Date.now()
        })

        return NextResponse.json({ success: true, message: "Upload successfull", newProduct })

    } catch (error) {
        NextResponse.json({ success: false, message: error.message })
    }
}
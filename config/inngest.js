import { Inngest } from "inngest";
import connectDB from './db'

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Ecommers-Test" });


// Inngest Function to save useer data to a database
export const syncUserCreateion = inngest.createFunction(
    {
        id: 'sync-uer-from-Clerk'
    },
    { event: 'clerk/user.create' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_addresses,
            name: first_name + " " + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

//Inngest Fuction to Update user data in database
export const syncUserUpdateion = Inngest.createFunction(
    {
        id: 'update-uer-from-Clerk'
    },
    { event: 'clerk/user.update' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_addresses,
            name: first_name + " " + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngestr Fuction to delete user data in database
export const syncDeletion = Inngest.createFunction(
    {
        id: 'delete-uer-from-Clerk'
    },
    { event: 'clerk/user.delete' },
    async ({ event }) => {
        const { id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)
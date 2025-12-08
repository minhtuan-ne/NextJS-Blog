import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";

export default async function DashboardRoute() {
    return (
        <h1>Hello from the dashboard</h1>
    )
}
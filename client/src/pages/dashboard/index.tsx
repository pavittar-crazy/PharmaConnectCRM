import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Lead, Order, Task } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { data: leads } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/orders"] });
  const { data: tasks } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  const leadsData = [
    { name: "New", value: leads?.filter(l => l.status === "New").length || 0 },
    { name: "Contacted", value: leads?.filter(l => l.status === "Contacted").length || 0 },
    { name: "Converted", value: leads?.filter(l => l.status === "Converted").length || 0 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{leads?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {orders?.filter(o => o.status !== "Delivered").length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {tasks?.filter(t => t.status === "Pending").length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

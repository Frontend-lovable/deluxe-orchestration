import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    value: "12",
    label: "Active projects",
    color: "text-primary",
  },
  {
    value: "34",
    label: "BRDs Created",
    color: "text-primary",
  },
  {
    value: "08",
    label: "Team Members",
    color: "text-primary",
  },
  {
    value: "28",
    label: "Days Average",
    color: "text-primary",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-border">
          <CardContent className="p-6 text-center">
            <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
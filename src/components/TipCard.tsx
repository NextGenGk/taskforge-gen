
import { Tip } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryColors = {
  marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  finance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  operations: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  legal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  sales: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  customer_service: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  human_resources: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  technology: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  administration: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  strategy: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

interface TipCardProps {
  tip: Tip;
}

const TipCard = ({ tip }: TipCardProps) => {
  return (
    <Card className="task-card card-hover h-full flex flex-col border animate-fade-in">
      <CardHeader className="p-4 pb-2 flex flex-row items-start gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
        <div>
          <CardTitle className="text-lg font-semibold leading-tight">{tip.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2 flex-grow">
        <p className="text-sm text-muted-foreground">
          {tip.content}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Badge className={cn("text-xs font-medium", categoryColors[tip.category])}>
          {tip.category.replace("_", " ")}
        </Badge>
        {tip.source && (
          <span className="text-xs text-muted-foreground">Source: {tip.source}</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default TipCard;

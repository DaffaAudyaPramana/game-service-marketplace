import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  price: string;
}

export default function ServiceCard({ title, description, price }: Props) {
  return (
    <Card className="p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>

      <p className="font-medium mb-4">{price}</p>

      <Button className="w-full">
        Order Now
      </Button>
    </Card>
  );
}
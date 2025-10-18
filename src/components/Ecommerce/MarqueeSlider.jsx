// PromoMarquee.jsx
import { Apple, Truck, Tag } from "lucide-react";
import Marquee from "react-fast-marquee";

const items = [
  { id: 1, icon: Apple, text: "Tu local experto en Apple" },
  { id: 2, icon: Truck, text: "Envíos a todo el país" },
  { id: 3, icon: Tag, text: "Descuentos en productos seleccionados" },
];

export const Marque = () => {
  return (
    <div className="w-full bg-gray-100">
      <Marquee gradient={false} speed={50} autoFill={true}>
        {items.map((i) => (
          <div
            key={i.id}
            className="flex flex-row items-center gap-2 px-8 py-2 text-sm font-medium text-gray-800"
          >
            <i.icon className="w-4 h-4 text-blue-600" />
            <span>{i.text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

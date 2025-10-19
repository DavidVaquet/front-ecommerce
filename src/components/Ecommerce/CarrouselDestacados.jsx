import { Carousel } from "@material-tailwind/react";
import { ProductCard } from "./ProductCard";

export function CarouselDestacados({ destacados = [] }) {
  const mitad = Math.ceil(destacados.length / 2);
  const primeraMitad = destacados.slice(0, mitad);
  const segundaMitad = destacados.slice(mitad);

  
  const slidePaddingX = "px-4 sm:px-6 lg:px-10 xl:px-20";

  return (
    <Carousel
      className="relative"
      navigation={({ setActiveIndex, activeIndex }) => {
        const onLeft = () => setActiveIndex(0);
        const onRight = () => setActiveIndex(1);
        const firstActive = activeIndex === 0;

        return (
          
          <div
            className={[
              "absolute inset-x-0 bottom-4 z-50",
              "flex",                      
              slidePaddingX,
            ].join(" ")}
          >
            <button
              type="button"
              onClick={onLeft}
              className={[
                "h-2 lg:h-2 rounded-full transition-all flex-1",
                firstActive ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400",
              ].join(" ")}
              aria-label="Ver primera mitad de destacados"
            />
            <button
              type="button"
              onClick={onRight}
              className={[
                "h-2 lg:h-2 rounded-full transition-all flex-1",
                !firstActive ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400",
              ].join(" ")}
              aria-label="Ver segunda mitad de destacados"
            />
          </div>
        );
      }}
    >
      {/* Slide 0 */}
      <div className={[slidePaddingX, "pt-4 pb-12"].join(" ")}>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {primeraMitad.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>

      {/* Slide 1 */}
      <div className={[slidePaddingX, "pt-4 pb-12"].join(" ")}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {segundaMitad.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </Carousel>
  );
}

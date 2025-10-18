import { Carousel, Button } from "@material-tailwind/react";

export function CarouselTransition() {
  return (
    <Carousel
      transition={{ type: "tween", duration: 1 }}
      autoplay={true}
      autoplayDelay={5000}
      loop
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 z-50">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`block h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "bg-black scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
      className="h-[588px] w-full relative"
    >

      {/* --- Slide 1 --- */}
      <div className="relative h-full w-full">
        <img
          src="/imagenes/iphone-17-pro.jpg"
          alt="iPhone 17 Pro"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-[105px] right-[382px]">
          <a href="#">
            <Button className="bg-gray-50 normal-case text-[13px] px-6 py-[10px] text-black rounded-[50px] hover:bg-orange-800">
              Avisame cuando llegue
            </Button>
          </a>
        </div>
      </div>

      {/* --- Slide 2 --- */}
      <div className="relative h-full w-full">
        <img
          src="/imagenes/iPhone-17-desktop.jpg"
          alt="iPhone 17"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-[135px] left-[470px]">
          <a href="#">
            <Button className="bg-black hover:bg-gray-800 normal-case text-[13px] px-6 py-[10px] text-white rounded-[50px]">
              Avisame cuando llegue
            </Button>
          </a>
        </div>
      </div>

      {/* --- Slide 3 --- */}
      <div className="relative h-full w-full">
        <img
          src="/imagenes/iPhone-air-desktop.jpg"
          alt="iPhone Air"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-[150px] left-[412px]">
          <a href="#">
            <Button className="bg-black hover:bg-gray-800 normal-case text-[13px] px-6 py-[10px] text-white rounded-[50px]">
              Avisame cuando llegue
            </Button>
          </a>
        </div>
      </div>

      {/* --- Slide 4 --- */}
      <div className="relative h-full w-full">
        <img
          src="/imagenes/airpods-pro3-desktop.jpg"
          alt="AirPods Pro 3"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-[120px] left-[480px]">
          <a href="#">
            <Button className="bg-black hover:bg-gray-800 normal-case text-[13px] px-6 py-[10px] text-white rounded-[50px]">
              Avisame cuando llegue
            </Button>
          </a>
        </div>
      </div>

      {/* --- Slide 5 --- */}
      <div className="relative h-full w-full">
        <img
          src="/imagenes/watch-ultra-3-desktop.jpg"
          alt="Apple Watch Ultra 3"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-[95px] left-[452px]">
          <a href="#">
            <Button className="bg-gray-50 normal-case text-[13px] px-6 py-[10px] text-black rounded-[50px] hover:bg-gray-300">
              Avisame cuando llegue
            </Button>
          </a>
        </div>
      </div>
    </Carousel>
  );
}

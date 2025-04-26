"use client";

import Image from "next/image";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const eventData = [
  {
    mainImage: "/image1.png",
    overlayImage1: "/image2.png",
    overlayImage2: "/image3.png",
    title: "",
    date: ""
  }
];

export function LatestEvents() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-12 space-y-4">
          <h2 className="from-white to-gray-400 text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            TRENDING & NEARBY PRODUCTS
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Discover trending items and the best deals from stores near you, tailored for your location.
          </p>
        </div>

        {/* Events Gallery */}
        <div className="relative w-full flex justify-center">
          {eventData.map((event, index) => (
            <div 
              key={index} 
              className="relative w-full md:w-[75%] max-w-7xl"
            >
              {/* Main large image container */}
              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
                <Image
                  src={event.mainImage}
                  alt="Main Event"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {event.date}
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full text-lg transition-all duration-300 hover:scale-105">
                    View Gallery
                  </Button>
                </div>
              </div>

              {/* Bottom left overlapping image */}
              <div className="absolute bottom-[-60px] left-[-100px] sm:left-[-140px] md:left-[-160px] w-[45%] sm:w-[35%] h-[250px] sm:h-[300px] rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
                <Image
                  src={event.overlayImage1}
                  alt="Event detail 1"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Top right overlapping image */}
              <div className="absolute top-[-60px] right-[-100px] sm:right-[-140px] md:right-[-160px] w-[45%] sm:w-[35%] h-[250px] sm:h-[300px] rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-transparent z-10" />
                <Image
                  src={event.overlayImage2}
                  alt="Event detail 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
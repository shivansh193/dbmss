import React from 'react';
import { ArrowRightCircle } from 'lucide-react';

const AlternatingSections = () => {
  const sections = [
    {
      title: "Vendor Analytics Dashboard",
      description: "Monitor your business growth with real-time sales data, customer insights, and product performance. Visualize your reach and optimize for local demand.",
      image: "/Campaign.png",
      features: [
        "Real-time sales tracking",
        "Customer and location insights",
        "Popular product analytics",
        "Performance by region"
      ]
    },
    {
      title: "Location-Based Performance",
      description: "See which products are trending in different neighborhoods and optimize your inventory for local demand. Understand customer preferences by area.",
      image: "/Analytics.png",
      features: [
        "Location-based product trends",
        "Store performance heatmaps",
        "Customer demand forecasting"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-32">
      {sections.map((section, index) => (
        <div 
          key={index}
          className={`flex flex-col gap-16 items-center group ${
            index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity" />
            <img
              src={section.image}
              alt={section.title}
              className="rounded-2xl w-full shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <p className="text-gray-600 text-gray-600 text-lg leading-relaxed">
                {section.description}
              </p>
            </div>

            <ul className="space-y-4">
              {section.features.map((feature, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center gap-4 group/item"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-600 group-hover/item:scale-150 transition-transform" />
                  <span className="text-gray-900 group-hover/item:text-blue-600 transition-colors">
                    {feature}
                  </span>
                  <ArrowRightCircle className="w-5 h-5 text-blue-600 opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                </li>
              ))}
            </ul>

            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow group/button">
              <span className="flex items-center gap-2">
                Learn more
                <ArrowRightCircle className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlternatingSections;
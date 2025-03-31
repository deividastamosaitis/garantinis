import React from "react";
import { useState } from "react";

const Atnaujinimai = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  // Sample data for updates
  const updates = [
    {
      id: 1,
      date: "2025 03 31",
      type: "Atnaujinimas",
      title: "Klientų paieška",
      description:
        "Klientai puslapyje paieška galima per kliento Vardą Pavardę, telefono numerį ar prekės SN",
      highlights: [
        "Atsidaro REDAGUOTI mygtukas nukreipiantis į redagavimo puslapi",
        "Redaguoti puslapyje galime ištrinti, redaguoti prekes",
        "Redaguoti puslapyje galime ištrinti, redaguoti kliento info",
      ],
    },
  ];

  // Filter updates based on active filter
  const filteredUpdates =
    activeFilter === "all"
      ? updates
      : updates.filter((update) => update.type === activeFilter);
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Atnaujinimai
            </h1>
          </div>

          {/* Updates timeline */}
          <div className="space-y-8">
            {filteredUpdates.map((update) => (
              <div
                key={update.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div className="flex items-center mb-3 sm:mb-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mr-3 bg-green-100 text-green-800">
                        {update.type}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {update.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{update.description}</p>

                  {update.highlights && update.highlights.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Pataisyta:
                      </h3>
                      <ul className="space-y-2">
                        {update.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredUpdates.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Atnaujinimai;

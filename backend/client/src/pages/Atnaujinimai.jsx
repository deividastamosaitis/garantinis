import React from "react";
import { useState } from "react";

const Atnaujinimai = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  // Sample data for updates
  const updates = [
    {
      id: 1,
      date: "2025 08 14",
      type: "Atnaujinimas",
      title: "VĖL Servisas UPDATE",
      description: "RMA nuorodos, atsakymai klientui",
      highlights: [
        "Nuo šiol atsakymus/klausimus klientui dėl serviso siunčiam TIK PER SISTEMA, pačiame bilieto viduje yra laukelis: 'atsakyti klientui', parašom žinutę - siunčiam",
        "Klientas atsakymą mums atrašo TIK Į SERVISAS@GPSMEISTRAS.LT el.paštą, jį nukopijuojam ir įklijuojam į sistemą (kaip ir anksčiau), jei reikia atrašyti - per SISTEMA. servisas@gpsmeistras.lt el.paštą naudojam tik skaitymui",
        "Pagal 'tiekėjo RMA kodą' šalia kodo atsiranda URL nuorodą, ją paspaudus nukeliauji į tiekėjo RMA puslapi. Lengviau sekti statusus, informacija",
      ],
    },
    {
      id: 1,
      date: "2025 08 12",
      type: "Atnaujinimas",
      title: "Servisu update",
      description: "papildomi mygtukai, filtracijos, pagražinta",
      highlights: [
        "Serviso peržiūros puslapyje atsirado mygtukas 'Siųsti į RMTools', nuo šiol nebereikia rašyti ranka laiškų :) (pridėtas yra prie kiekvieno siuntimo deividas@gpsmeistras.lt paštas papildomai) .",
        "Paspaudus mygtuką 'Siųsti į RMTools' iššoką langas su užpildyto serviso informacija, ją galima keisti, papildyti, trinti.",
        "SVARBU!! NUOTRAUKOS ar VAIZDO ĮRAŠAI prie laiško automatiškai neprisideda, tad išsiunčiam į RMTools laukiam kol susikuria bilietas ir įkeliam rankiniu būdu, taip pat nepamirštam pakoreguoti 'Išorinio serviso' skilties",
        "Nuo šiol nuotraukos/vaizdo įrašai rodomi thumbnail dydžiu, paspaudus ant jų tik tuomet padidėja. (galima ir su rodyklėm ant klaviatūros pereidinėti per įrašus)",
        "Pakeistas patogesnis (mano nuomonę) serviso peržiūros puslapio dizainas, švaresnis (ačiū ChatGPT), reikalingesnė informacija perkelta į viršutinę dalį.",
        "Įdėta serviso puslapyje filtracija su filtravimo mygtukais (skliausteliuose rodo tų kategorijų įrašų skaičių)",
        "Serviso puslapyje 'Uždaryti' statusą turintys įrašai keliauja į apačią (nebesimaišo tarp vis dar vykdomų)",
        "Žyyyymiaai labiau pajudėta su užklausų siuntimais klientui, manau greitu metu pašto nebereiks :D",
      ],
    },
    {
      id: 1,
      date: "2025 08 04",
      type: "Atnaujinimas",
      title: "Garantiniu ir serviso UPDATE",
      description: "UPDAIT",
      highlights: [
        "Galima atsisiųst excel garantiniu prekes, kad Vidas galėtų įrašyt daugiau kamerų jei reikia.",
        "Servise galima suvesti papildomą raktažodį (matosi tik mum) dėl greitesnės filtracijos",
        "Serviso lentelėje galima greičiau atsifiltruot su raktažodžiu (matomas tik mum)",
        "Serviso užklausų istorija saugoja iki 5 žinučių",
        "Kiekvienam RMA sukuriamas QR kodas, jį nuskanavus nukeliauji tiesiogiai į peržiūros puslapi (tereik būt tam pačiam tinkle).",
      ],
    },
    {
      id: 1,
      date: "2025 06 23",
      type: "Atnaujinimas",
      title: "Garantinių redagavimas",
      description: "RAMUTĖ DIEVAS",
      highlights: [
        "Nuo šiol galima redaguoti garantinius TIK RAMUTEI IR RIČARDUI, niekam kitam.",
        "Redaguoti mygtuku mato tik Ramutė su Ričardu",
      ],
    },
    {
      id: 1,
      date: "2025 05 21",
      type: "Atnaujinimas",
      title: "Garantinių pildymas",
      description: "Galima dubliuoti suvesta prekę",
      highlights: [
        "Pašalinant prekę išmetamas patvirtinimas ar tikrai reikia pašalinti,",
      ],
    },
    {
      id: 1,
      date: "2025 05 20",
      type: "Atnaujinimas",
      title: "Klientai",
      description: "Patobulinta paieška, optimizuota",
      highlights: [
        "Suvedus kliento rekvizitų dali meta visus su tuo susijusius klientus,",
        "Atnaujintas klientų atvaizdavimas, atskirtos prekės nuo klientų",
        "Matoma kokia prekė priklauso klientui, galima iškart redaguoti krepšelį",
      ],
    },
    {
      id: 2,
      date: "2025 04 11",
      type: "Atnaujinimas",
      title: "Alkotesteriai",
      description: "Alkotesterių kalibravimo vedimas, metam exceli nafik",
      highlights: [
        "Suvedus kontaktą atsinaujinam buseną butinai,",
        "Vėliau galima bus siųsti SMS tiesiogiai per čia, paspaudus vieną knopkę (teksto rašyt nereiks)",
        "Viskas vienoj vietoj, niekur blaškytis nereikia",
      ],
    },

    {
      id: 3,
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
                        Padaryta:
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

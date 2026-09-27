/**
 * Knowledge for the website AI assistant (src/app/api/chat).
 *
 * Condensed from the OSLEOS brochure (D:/Osleos_Brochure.pdf, pages 3–9,
 * 19–31, 33–34) and docs/CLIENT_CHANGES.md. English only — the assistant
 * answers in Bangla itself when asked in Bangla.
 *
 * How it is used (retrieval-augmented generation, see src/lib/rag):
 * - `companyOverview` is part of the small, cached system prompt and is sent
 *   with every request. Keep it short and stable.
 * - `assistantKnowledge` is NOT sent as a whole. It is split into search
 *   chunks at every "# Heading" (long sections are split further by line), and
 *   only the chunks relevant to a question are sent. So: one topic per
 *   heading, one fact per line, and write each line so it makes sense on its
 *   own (repeat the product/solution name instead of "it").
 *
 * Contact numbers, products, FAQs etc. are indexed straight from site.ts,
 * products.ts and the dictionaries — don't duplicate them here.
 */

export const companyOverview = `
OSLEOS is a Bangladesh solar and energy-solutions company based in Dhaka (tagline: "Powering Today. Preserving Tomorrow."), delivering solar solutions for 15 years. It designs, supplies, installs and maintains complete solar power systems for homes, businesses, industries, institutions, agriculture and commercial facilities: Tier-1 solar panels, on-grid / off-grid / hybrid inverters, lithium and lead-acid batteries, charge controllers, voltage stabilizers, protection equipment, mounting structures, cables and monitoring. Approach: Assess -> Design -> Install -> Monitor -> Maintain. Every product and system is quote-only: pricing depends on the site and design, so customers send the Information Sheet or message the team on WhatsApp.
`.trim();

export const assistantKnowledge = `
# About OSLEOS
- OSLEOS is a Bangladesh solar and energy-solutions company based in Dhaka. Tagline: "Powering Today. Preserving Tomorrow."
- Delivering solar solutions for 15 years.
- "We don't just sell solar. We solve energy problems." Solar should be a properly engineered energy solution designed around the customer's electricity consumption, operating requirements and financial objectives, not just an equipment purchase.
- Serves homes, businesses, industries, institutions, agriculture and commercial facilities.
- Mission: help Bangladesh move toward cleaner, smarter and more efficient energy by making renewable energy practical, measurable and financially meaningful.
- Approach: Assess -> Design -> Install -> Monitor -> Maintain.
- OSLEOS deals with the whole solar power system, including voltage stabilizers.
- Peak solar module efficiency in our range: up to 24.1%.

# Why OSLEOS
1. Customer-specific design - one system does not fit everyone.
2. Financial approach - we evaluate the economics, not just the equipment.
3. Complete energy solutions - generation, storage, backup and monitoring.
4. Long-term support - installation is only the beginning of the relationship.
5. Smart energy management - performance, efficiency and measurable savings.

# What we supply (complete equipment package, one trusted partner)
- Solar panels: high-efficiency PV modules for residential, commercial and industrial use.
- Solar inverters: on-grid, off-grid and hybrid.
- Battery storage: lithium and lead-acid batteries for backup and energy storage.
- Mounting structures: durable, corrosion/weather-resistant, rooftop and ground-mount.
- Protection equipment: DC/AC isolators, SPD, MCB, MCCB, breakers and distribution boards.
- Cables and MC4 connectors.
- Monitoring systems (app/web dashboards).
- Voltage stabilizers.
- Complete solar systems, from components to full system configuration.

# Partner brands
- PV modules: Trina Solar, Jinko Solar, LONGi, JA Solar, Canadian Solar, Astronergy.
- Inverters: Sungrow, Huawei, Solis, GoodWe, Growatt, Crown, Deye.
- Balance-of-system / electrical brands we use: Delixi Electric, CHNT, SAKO, CNC Electric, Tengen, Zhengxi.

# Core solutions
Solar PV systems (rooftop and ground-mounted), battery energy storage, hybrid power (solar + grid + generator), industrial solar, energy monitoring and management, net metering (grid-connected), EV charging, operation & maintenance, energy auditing.

# Which system is right?
- On-grid: uses solar during the day, stays connected to the utility grid; grid tops up when solar is not enough; surplus can be exported where net metering applies. No battery, does NOT work during outages. Ideal for homes, offices and commercial buildings with a reliable grid.
- Off-grid: independent of the grid; solar charges a battery via a charge controller and an off-grid inverter supplies loads, including at night. Ideal for remote areas.
- Hybrid: solar + battery + grid through a hybrid inverter; uses solar normally, stores energy, and backs up selected loads during outages. Ideal for homes and businesses wanting both savings and backup (useful against load-shedding).

# Named OSLEOS solutions
- Solar Bill Zero: we analyse electricity bills, daily consumption, peak demand, operating hours, rooftop area, load profile, solar potential and grid consumption; the customer receives a customised design, estimated monthly generation, estimated bill reduction, investment & payback analysis and a net-metering assessment. For factories, offices, restaurants, hotels, hospitals, schools, commercial buildings. Objective: maximum practical reduction in electricity cost.
- Solar PowerGuard: solar + battery + grid + backup power. "Solar power when you have it, battery power when you need it." Keeps critical operations running during outages. For restaurants, pharmacies, clinics, diagnostic centres, offices, retail stores, small industries.
- Solar-as-a-Service: for eligible commercial and industrial customers, OSLEOS can explore structured financing and energy-service arrangements so they can go solar without a large upfront investment. Steps: energy assessment, system design, financing/service structure, installation, operation & monitoring, long-term savings. Eligibility is decided case by case.
- Hybrid Factory Power: solar + battery + grid + generator combined into one engineered power solution; lower energy costs, reduced generator fuel, better reliability. For factories, workshops, warehouses, cold storage, commercial facilities.
- Solar Coldchain: solar designed around refrigeration loads for cold storage, frozen food, fisheries, food processing, agricultural storage.
- Solar Irrigation / solar water pumping: PV modules -> MPPT pump controller -> (inverter) -> submersible or surface pump -> storage tank / pipeline -> sprinkler or drip irrigation, with optional water-level sensor automation. Reduces diesel dependence. Solar Irrigation-as-a-Service may be explored for selected projects. Actual pump, array and tank sizing is engineered per site.
- Roof to Revenue: turns unused commercial/industrial rooftops into clean-energy assets (roof assessment, solar potential study, design, financial analysis, installation, monitoring).
- Solar Parking: solar carports with optional battery storage and EV charging, for malls, hotels, offices, universities, hospitals.
- Energy Guardian: ongoing monthly monitoring - solar generation, grid consumption, generator usage, battery performance, estimated savings, performance alerts, maintenance recommendations.
- Solar Lift: solar/hybrid power for passenger elevators in residential and commercial buildings; requires project-specific engineering after assessing the elevator and building.

# Our process (from requirement to solar power)
1. Consultation / customer requirement  2. Energy audit (bills and consumption)  3. Site survey (roof, electrical system, shading, space)  4. Engineering & design (capacity, inverter, battery if needed, protection)  5. Equipment selection and financial analysis (generation, savings, payback)  6. Professional installation, testing and commissioning  7. System handover with user guidance, then monitoring  8. After-sales support: maintenance, troubleshooting and optimisation.

# Information Sheet (what we need for a quote)
Electricity bill (amount and month), monthly consumption (kWh), total connected load, available roof area (sq ft or sq m), building type (residential / commercial / industrial / other), operating hours (hours per day, days per week), backup requirement (yes/no, duration, priority loads), and existing power source (grid only, generator, grid + generator, other).

# Why solar matters in Bangladesh
Growing electricity demand, load-shedding and power interruptions, heat increasing cooling loads, limited urban land (rooftops are the best resource). Rooftop solar with battery backup gives energy security, lower bills and a cleaner future.
`.trim();

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
OSLEOS is a Bangladesh solar and energy-solutions company based in Dhaka (tagline: "Powering Today. Preserving Tomorrow."), established in 2010 and providing solar solutions to its respected clients ever since. It designs, supplies, installs and maintains complete solar power systems for homes, businesses, industries, institutions, agriculture and commercial facilities: Tier-1 solar panels, on-grid / off-grid / hybrid inverters, lithium and lead-acid batteries, charge controllers, voltage stabilizers, protection equipment, mounting structures, cables and monitoring. Approach: Assess -> Design -> Install -> Monitor -> Maintain. Every product and system is quote-only: pricing depends on the site and design, so customers send the Information Sheet or message the team on WhatsApp.
`.trim();

export const assistantKnowledge = `
# About OSLEOS
- OSLEOS is a Bangladesh solar and energy-solutions company based in Dhaka. Tagline: "Powering Today. Preserving Tomorrow."
- When was OSLEOS established / founded? OSLEOS was established in 2010. Since then, OSLEOS has been providing solar solutions to its respected clients.
- Delivering solar solutions since 2010 (15+ years of experience).
- "We don't just sell solar. We solve energy problems." Solar should be a properly engineered energy solution designed around the customer's electricity consumption, operating requirements and financial objectives, not just an equipment purchase.
- Serves homes, businesses, industries, institutions, agriculture and commercial facilities.
- Mission: help Bangladesh move toward cleaner, smarter and more efficient energy by making renewable energy practical, measurable and financially meaningful.
- Approach: Assess -> Design -> Install -> Monitor -> Maintain.
- OSLEOS deals with the whole solar power system, including voltage stabilizers.
- Peak solar module efficiency in our range: up to 24.1%.

# OSLEOS leadership team
- Engr. Banzir Hazra — Head of Engineering. BEng Architectural Engineering and MSc Renewable Energy Engineering, Heriot-Watt University. Leads the engineering vision and the design of efficient, reliable solar energy systems.
- Engr. Safuan Chowdhury — Chief Engineer. BEng Electrical and Electronic Engineering, University of Greater Manchester. Leads engineering operations, technical quality and system performance.
- Engr. Kiran Mathew — Advisor. BEng (Hons) Architectural Engineering, Heriot-Watt University; MSc Renewable Energy and Energy Efficiency (REMENA), University of Kassel (Germany) and ENIM (Tunisia). Advises on renewable energy strategy and system optimisation.
- Advocate Kh. Maksudul Hasan (Shobuj) — Corporate Legal Advisor. LL.B. (Honours), LL.M.; Advocate, Supreme Court of Bangladesh; Additional Public Prosecutor, Special Tribunal-19 and Additional Metropolitan Sessions Judge Court-11, Dhaka; Library Secretary and Executive Committee Member, Dhaka Bar Association (2026–27). Advises on corporate affairs, regulatory compliance and risk management.
- The team is shown on the About page (/{lang}/about).

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
- Huawei products supplied by OSLEOS: SUN2000 smart solar inverters, LUNA2000 smart energy storage systems (LiFePO4, 5 kWh modules, 5–30 kWh) and SUN2000 smart PV optimizers (module-level). Huawei smart features: AI-powered arc-fault protection, smart energy management, intelligent monitoring, smart I-V curve diagnosis and intelligent system diagnostics.
- Voltage stabilizer brands: SAKO, CNC Electric, Tengen (also CHNT, Zhengxi and Delixi Electric stabilizers).
- Balance-of-system / electrical brands we use: Delixi Electric, CHNT, CNC Electric, Tengen, Zhengxi.
- SAKO is supplied for voltage stabilizers only, not inverters.

# Core solutions
Solar PV systems (rooftop and ground-mounted), battery energy storage, hybrid power (solar + grid + generator), industrial solar, energy monitoring and management, net metering (grid-connected), EV charging, operation & maintenance, energy auditing.

# Which system is right?
- On-grid: uses solar during the day, stays connected to the utility grid; grid tops up when solar is not enough; surplus can be exported where net metering applies. No battery, does NOT work during outages. Ideal for homes, offices and commercial buildings with a reliable grid.
- Off-grid: independent of the grid; solar charges a battery via a charge controller and an off-grid inverter supplies loads, including at night. Ideal for remote areas.
- Hybrid: solar + battery + grid through a hybrid inverter; uses solar normally, stores energy, and backs up selected loads during outages. Ideal for homes and businesses wanting both savings and backup (useful against load-shedding).

# Named OSLEOS solutions
- Hybrid Factory Power: solar + battery + grid + generator combined into one engineered power solution; lower energy costs, reduced generator fuel, better reliability. For factories, workshops, warehouses, cold storage, commercial facilities.
- Solar Coldchain: solar designed around refrigeration loads for cold storage, frozen food, fisheries, food processing, agricultural storage.
- Solar Irrigation / solar water pumping: PV modules -> MPPT pump controller -> (inverter) -> submersible or surface pump -> storage tank / pipeline -> sprinkler or drip irrigation, with optional water-level sensor automation. Reduces diesel dependence. Solar Irrigation-as-a-Service may be explored for selected projects. Actual pump, array and tank sizing is engineered per site.
- Solar Parking: solar carports with optional battery storage and EV charging, for malls, hotels, offices, universities, hospitals.
- Energy Guardian: ongoing monthly monitoring - solar generation, grid consumption, generator usage, battery performance, estimated savings, performance alerts, maintenance recommendations.
- Solar Lift: solar/hybrid power for passenger elevators in residential and commercial buildings; requires project-specific engineering after assessing the elevator and building.

# Our process (from requirement to solar power)
1. Consultation / customer requirement  2. Energy audit (bills and consumption)  3. Site survey (roof, electrical system, shading, space)  4. Engineering & design (capacity, inverter, battery if needed, protection)  5. Equipment selection and financial analysis (generation, savings, payback)  6. Professional installation, testing and commissioning  7. System handover with user guidance, then monitoring  8. After-sales support: maintenance, troubleshooting and optimisation.

# Measurement Form (what we need for a quote)
- The Measurement Form (Solar Project Measurement Form) is the quote form on the website at /{lang}/quote. It collects the initial information needed for a preliminary quotation and is sent to OSLEOS on WhatsApp.
- Project details: project name, project type, project location, factory / company name, contact person, designation, phone / WhatsApp, email, Google Maps link and project site photos.
- Operation & electricity: daily operating hours (8, 12, 16, 24 hours or other), transformer capacity (kVA), generator capacity (kVA), approximate daily (kWh/day) and monthly (kWh/month) consumption, sanction load, connected load, maximum active load and average active load (kVA), a list of loads with capacity and operating time, and electricity bill copies of the last 6 months.
- Roof & site: approximate roof length and width, roof type (RCC, tin, metal sheet, other). Roof structure: roof height and purlin-to-purlin distance.
- Backup & hybrid: backup load capacity (kW), backup time (hours), maximum load-shedding time (hours).
- Inverter & cable route: inverter location, distance from inverter to MDB and to the backup load SDB (metres).
- Project objective: minimise electricity bill, backup support, less grid dependence, green energy, net-metering export; whether an AI-integrated system or a self-cleaning solar system is required; off-grid, on-grid or hybrid; backup hours if hybrid.
- Customers can add PDF, JPG or PNG files (site photos, electricity bills). Files are not uploaded to the website: after the form opens WhatsApp, phones can share the files straight to the OSLEOS WhatsApp chat; otherwise the customer attaches them in the chat.
- If a customer is unsure about a value, they can leave it blank or share the electricity bill and site photos with OSLEOS.
- MDB = Main Distribution Board. SDB = Sub Distribution Board for selected essential (backup) circuits. Sanction load = load approved by the electricity provider. Connected load = total rated capacity of all connected equipment.

# How the OSLEOS AI assistant can help you
- The OSLEOS AI assistant is available on the website 24/7 and answers in English, Chinese, Spanish, French or Bangla.
- The OSLEOS AI assistant explains solar basics in simple words: on-grid vs off-grid vs hybrid systems, batteries, inverters, net metering and voltage stabilizers.
- The OSLEOS AI assistant helps customers pick the right OSLEOS solution for a home, shop, office, factory, farm or institution.
- The OSLEOS AI assistant gives details on the products and partner brands OSLEOS supplies (Trina, Jinko, LONGi, Sungrow, Huawei, Deye and more).
- The OSLEOS AI assistant explains the government rooftop-solar incentive and how OSLEOS can help customers use it.
- The OSLEOS AI assistant tells customers exactly what information is needed for a quote and guides them to the Measurement Form (quote form, /{lang}/quote), and can then send site photos and electricity bills (PDF, JPG, PNG) on WhatsApp.
- The OSLEOS AI assistant shares OSLEOS contact details, office address and working hours, and can hand the conversation over to the team on WhatsApp.
- The OSLEOS AI assistant does not give prices: every system is designed and quoted by the OSLEOS engineering team after assessing the site.

# Why solar matters in Bangladesh
Growing electricity demand, load-shedding and power interruptions, heat increasing cooling loads, limited urban land (rooftops are the best resource). Rooftop solar with battery backup gives energy security, lower bills and a cleaner future.
`.trim();

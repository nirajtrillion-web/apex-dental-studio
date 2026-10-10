---

# APEX DENTAL & MULTI-NICHE LOCAL BUSINESS RULES

Act as an Elite Full-Stack Engineer and Conversion Rate Optimization (CRO) Architect.\
Strictly adhere to the following project standards, components, and validation rules:

==================================================

1. MANDATORY CONVERSION PILLARS (DENTAL PLATFORM)\
   ==================================================

2. Direct Phone Links (`tel:`):

   - Bandra West Helpline: [+91 98201 23456](tel:+919820123456)
   - Kandivali East Helpline: [+91 98206 54321](tel:+919820654321)
   - Sticky mobile bar (&lt; 768px) must initiate native dialing on tap.

3. Clickable Google Maps Redirection:

   - Bandra Location Card:\
     URL: <https://www.google.com/maps/search/?api=1&query=Linking+Road+Bandra+West+Mumbai+Dental> (target="\_blank")
   - Kandivali Location Card:\
     URL: <https://www.google.com/maps/search/?api=1&query=Thakur+Village+Kandivali+East+Mumbai+Dental> (target="\_blank")

4. Floating Contextual WhatsApp Widget:

   - Fixed at bottom-6 right-6 (z-50).
   - Dynamic message target: <https://wa.me/919820123456?text=Hi%20Apex%20Dental,%20I%20want%20to%20book%20a%20consultation>.

5. Form Validation & Database Persistence:

   - Validate patient phone numbers using 10-digit Indian regex: ^\[6-9\]\\d{9}$
   - Save all appointments directly to Supabase table `appointments`.
   - Fire a `canvas-confetti` trigger and toast notification upon booking.

# ==================================================\
2. DOCTOR ROLES & SEGREGATED STAFF PORTALS

1. Doctors on Platform:
   - Dr. Sameer Merchant, MDS (Implantologist & Cosmetic Surgeon)
   - Dr. Ananya Parekh, MDS (Orthodontist & Clear Aligners Specialist)\
     Portrait: <https://images.unsplash.com/photo-1594824813583-04e3b1c55355?auto=format&fit=crop&w=800&q=80>
2. Staff Authentication (/staff/login):
   - [sameer@apexdental.in](mailto:sameer@apexdental.in) -&gt; Sees ONLY Dr. Sameer's assigned patients.
   - [ananya@apexdental.in](mailto:ananya@apexdental.in) -&gt; Sees ONLY Dr. Ananya's assigned patients.
3. Doctor Dashboard Actions:
   - Status toggles: "Confirmed", "Completed", "Cancelled".
   - Direct patient call link (`tel:`).

# ==================================================\
3. BEFORE & AFTER TRANSFORMATION GALLERY

- Render 15 dental transformation cases with category tabs (All, Aligners, Whitening, Veneers, Implants, Cosmetic).
- Include an interactive before/after split slider for each case.

# ==================================================\
4. PLAYWRIGHT QA

- Validate on mobile viewport (375x812): zero horizontal scroll overflow (`scrollWidth <= innerWidth`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

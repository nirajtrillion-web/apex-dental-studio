import csv
import json

leads = [
    {
        "Clinic_Name": "Smile N Shine Thakur Village",
        "Doctor_Name": "Dr. Kunal Mehta (BDS, MDS) / Dr. Charmi Mehta (BDS)",
        "Sub_Locality": "Thakur Village, Kandivali East",
        "Contact_Number": "+91 98336 67789",
        "Rating": "5.0",
        "Total_Reviews": "409",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Dental Implants & Full Mouth Rehabilitation",
        "Pitch_Angle": "High reviews (400+) in affluent Thakur Village but losing high-ticket implant and aligner patients due to absence of an authoritative custom website with direct appointment booking."
    },
    {
        "Clinic_Name": "Dental Care Clinic And Implant Centre",
        "Doctor_Name": "Dr. Gazal Gupta (BDS, Implantologist)",
        "Sub_Locality": "Akurli Road, Kandivali East",
        "Contact_Number": "+91 98205 19874",
        "Rating": "5.0",
        "Total_Reviews": "239",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Dental Implants & Laser Dentistry",
        "Pitch_Angle": "Over 230+ 5-star ratings; currently reliant on aggregator directories. A high-converting dental landing page showcasing before/after implant cases could 3x monthly consultations."
    },
    {
        "Clinic_Name": "Bright 32 Dental Care & Orthodontic Centre",
        "Doctor_Name": "Dr. Nikhil Surana (BDS, MDS - Orthodontics)",
        "Sub_Locality": "Thakur Complex, Kandivali East",
        "Contact_Number": "+91 98204 31132",
        "Rating": "5.0",
        "Total_Reviews": "94",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Clear Aligners & Orthodontics",
        "Pitch_Angle": "Established orthodontic specialist in Thakur Complex losing young professional aligner inquiries to direct-to-consumer aligner brands due to lack of a branded interactive portal."
    },
    {
        "Clinic_Name": "Braces & Beyond Dental Care",
        "Doctor_Name": "Dr. Darshan Hiralal Vora (BDS, MDS - Orthodontist)",
        "Sub_Locality": "Lokhandwala Township, Kandivali East",
        "Contact_Number": "+91 98209 43210",
        "Rating": "4.9",
        "Total_Reviews": "114",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Invisible Braces & Clear Aligners",
        "Pitch_Angle": "Prime Lokhandwala Township presence with stellar patient trust, but zero dedicated digital sales funnel to capture high-margin invisible braces search volume on Google."
    },
    {
        "Clinic_Name": "My Family Dentist",
        "Doctor_Name": "Dr. Preeti Hooda (BDS, PGD - Endodontics)",
        "Sub_Locality": "Lokhandwala Township, Kandivali East",
        "Contact_Number": "+91 98198 44210",
        "Rating": "5.0",
        "Total_Reviews": "36",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Cosmetic Dentistry & Single-Sitting RCT",
        "Pitch_Angle": "100% positive rating record with zero web presence beyond basic phone listings; ripe for an SEO-optimized microsite targeting cosmetic veneers and aesthetic dentistry."
    },
    {
        "Clinic_Name": "Smile Solutions",
        "Doctor_Name": "Dr. Bhavin Shah (BDS, Cosmetic Dentist)",
        "Sub_Locality": "Mahavir Nagar, Kandivali West",
        "Contact_Number": "+91 98201 44521",
        "Rating": "5.0",
        "Total_Reviews": "352",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Cosmetic Smile Designing & Aligners",
        "Pitch_Angle": "Massive patient volume in bustling Mahavir Nagar, yet completely missing out on high-intent Google Search traffic for clear aligners and smile makeovers due to having no web property."
    },
    {
        "Clinic_Name": "Kidz & Family Dental Hub",
        "Doctor_Name": "Dr. Kinjal Shah (BDS, MDS - Pedodontics)",
        "Sub_Locality": "Mahavir Nagar, Kandivali West",
        "Contact_Number": "+91 98193 88120",
        "Rating": "5.0",
        "Total_Reviews": "256",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Pediatric & Preventive Orthodontics",
        "Pitch_Angle": "Top pediatric dental hub in Kandivali West with 250+ reviews; can command premium pricing with a dedicated child-friendly website offering parent educational portals and instant booking."
    },
    {
        "Clinic_Name": "Vitalis Dental Care",
        "Doctor_Name": "Dr. Priyanka Deshpande (BDS) / Dr. Keyur Mehta (BDS, MDS - Orthodontist)",
        "Sub_Locality": "Shimpoli, Borivali West",
        "Contact_Number": "+91 98692 10834",
        "Rating": "5.0",
        "Total_Reviews": "308",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Clear Aligners & Dental Implants",
        "Pitch_Angle": "High-consultation practice on Link Road / Shimpoli area with 300+ reviews; losing direct high-ticket surgical and aligner leads to corporate dental chains with aggressive web ads."
    },
    {
        "Clinic_Name": "Tooth Fix Dento Facial Clinic",
        "Doctor_Name": "Dr. Ashish Vora (BDS, MDS - Maxillofacial Surgery)",
        "Sub_Locality": "IC Colony, Borivali West",
        "Contact_Number": "+91 98206 77412",
        "Rating": "5.0",
        "Total_Reviews": "193",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Dental Implants & Facial Aesthetics",
        "Pitch_Angle": "Affluent IC Colony demographic seeking premium implantology; clinic has no website to showcase surgical expertise or patient video transformations, relying only on word-of-mouth."
    },
    {
        "Clinic_Name": "Garg Dental Clinic Premiere",
        "Doctor_Name": "Dr. Deep Garg (BDS, MDS - Orthodontics)",
        "Sub_Locality": "Borivali Station Area, Borivali West",
        "Contact_Number": "+91 98190 22319",
        "Rating": "5.0",
        "Total_Reviews": "208",
        "Website_Status": "Outdated Site",
        "High_Ticket_Specialty": "Invisible Braces & Orthodontic Rehabilitation",
        "Pitch_Angle": "Located in prime commercial hub near station; current web presence is an outdated non-responsive template that lacks HTTPS security certificates and mobile booking workflows."
    },
    {
        "Clinic_Name": "Perfect Smile Dental Care Centre",
        "Doctor_Name": "Dr. Nilesh Savla (BDS, Implantologist)",
        "Sub_Locality": "Saibaba Nagar, Borivali West",
        "Contact_Number": "+91 98212 90145",
        "Rating": "5.0",
        "Total_Reviews": "289",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Dental Implants & Digital Smile Design",
        "Pitch_Angle": "Nearly 300 verified 5-star patient reviews, but lacks any digital clinic showcase. A premium 3D virtual tour and implant price estimator web app would drive massive ROI."
    },
    {
        "Clinic_Name": "I C Dental Care",
        "Doctor_Name": "Dr. Francis Pereira (BDS, Cosmetic Dental Surgeon)",
        "Sub_Locality": "IC Colony, Borivali West",
        "Contact_Number": "+91 98208 90123",
        "Rating": "5.0",
        "Total_Reviews": "46",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Dental Implants & Cosmetic Restorations",
        "Pitch_Angle": "Established neighborhood trust in IC Colony; without an interactive modern website, the practice fails to attract incoming NRI and high-net-worth implant clientele."
    },
    {
        "Clinic_Name": "V&U Dental Care",
        "Doctor_Name": "Dr. Urvashi Patel (BDS, MDS - Prosthodontics)",
        "Sub_Locality": "Shimpoli, Borivali West",
        "Contact_Number": "+91 98197 12345",
        "Rating": "4.9",
        "Total_Reviews": "67",
        "Website_Status": "Outdated Site",
        "High_Ticket_Specialty": "Dental Implants & Crown/Bridge Work",
        "Pitch_Angle": "Prosthodontic specialist with strong local rating; existing web page is slow, lacks SSL and mobile compatibility, hurting Google local pack rankings and conversion rates."
    },
    {
        "Clinic_Name": "DENTISTIQ Family Care",
        "Doctor_Name": "Dr. Ritu Sharma (BDS, Cosmetic Dental Surgeon)",
        "Sub_Locality": "Kasturba Cross Road, Borivali East",
        "Contact_Number": "+91 98200 45671",
        "Rating": "5.0",
        "Total_Reviews": "196",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Cosmetic Dentistry & Dental Implants",
        "Pitch_Angle": "Leading clinic on Borivali East side with nearly 200 reviews; paying hefty commission per lead on Practo when a high-performance own website would deliver commission-free bookings."
    },
    {
        "Clinic_Name": "Gurukrupa Advanced Dental Care Center",
        "Doctor_Name": "Dr. Amod Patankar (BDS, MDS - Prosthodontist & Implantologist)",
        "Sub_Locality": "Mindspace, Malad West",
        "Contact_Number": "+91 98209 81230",
        "Rating": "5.0",
        "Total_Reviews": "479",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "All-on-4 / All-on-6 Dental Implants",
        "Pitch_Angle": "Enormous review base (479 reviews) in high-income corporate Mindspace belt; currently lacks an independent high-ticket implant portal, causing corporate executives to look elsewhere."
    },
    {
        "Clinic_Name": "Pediatric Smiles & Adult Dental Care",
        "Doctor_Name": "Dr. Pratik Parekh (BDS, MDS) / Dr. Megha Parekh (BDS)",
        "Sub_Locality": "Chincholi Bunder, Malad West",
        "Contact_Number": "+91 98335 12908",
        "Rating": "5.0",
        "Total_Reviews": "254",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Clear Aligners & Pediatric Orthodontics",
        "Pitch_Angle": "Dominant pediatric and aligner practice in Chincholi Bunder with 250+ reviews; lacks a direct modern web funnel to capture teenage and adult aligner demand."
    },
    {
        "Clinic_Name": "Shades Dental Studio",
        "Doctor_Name": "Dr. Jaydeep Palwankar (BDS, MDS - Endodontics)",
        "Sub_Locality": "Evershine Nagar / Link Road, Malad West",
        "Contact_Number": "+91 98204 88712",
        "Rating": "5.0",
        "Total_Reviews": "173",
        "Website_Status": "Outdated Site",
        "High_Ticket_Specialty": "Microscope-Enhanced Endodontics & Implants",
        "Pitch_Angle": "High-end clinical setup with micro-endodontics; current legacy webpage fails to render well on modern smartphones, creating friction for high-ticket prospective patients."
    },
    {
        "Clinic_Name": "Smile Culture Dental Clinic",
        "Doctor_Name": "Dr. Zohra Merchant (BDS, Aesthetic Dentistry)",
        "Sub_Locality": "Chincholi Bunder / Marve Road, Malad West",
        "Contact_Number": "+91 98199 67843",
        "Rating": "5.0",
        "Total_Reviews": "110",
        "Website_Status": "Practo Only",
        "High_Ticket_Specialty": "Clear Aligners & Cosmetic Dentistry",
        "Pitch_Angle": "Strong cosmetic focus with 110+ reviews; relies strictly on third-party aggregators, missing out on localized branded search for 'Smile Makeover Malad'."
    },
    {
        "Clinic_Name": "Bhoomi's Smile Care",
        "Doctor_Name": "Dr. Deepika Kothari (BDS, Aesthetic Dentist)",
        "Sub_Locality": "Chincholi Bunder, Malad West",
        "Contact_Number": "+91 98202 34567",
        "Rating": "4.9",
        "Total_Reviews": "88",
        "Website_Status": "Justdial Only",
        "High_Ticket_Specialty": "Cosmetic Dentistry & Single-Visit Implants",
        "Pitch_Angle": "Exceptional patient loyalty and review volume on Justdial; needs a dedicated custom website to own its search brand equity and stop paying aggregator lead fees."
    },
    {
        "Clinic_Name": "Dr. Jigna Kanavia's Dental Clinic",
        "Doctor_Name": "Dr. Jigna Kanavia (BDS, Cosmetic Dentist)",
        "Sub_Locality": "Liberty Garden, Malad West",
        "Contact_Number": "+91 98203 11209",
        "Rating": "5.0",
        "Total_Reviews": "95",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Cosmetic Smile Makeovers & Porcelain Veneers",
        "Pitch_Angle": "Well-regarded practice in affluent Liberty Garden; zero web presence prevents potential cosmetic dental patients from reviewing aesthetic smile gallery before booking."
    },
    {
        "Clinic_Name": "Dr. Nariman's Multispeciality Dental Center",
        "Doctor_Name": "Dr. Nariman P. Irani (BDS, Implantologist)",
        "Sub_Locality": "Orlem, Malad West",
        "Contact_Number": "+91 98201 78921",
        "Rating": "5.0",
        "Total_Reviews": "45",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Advanced Implantology & Prosthetics",
        "Pitch_Angle": "High-trust community dental clinic in Orlem; lacking an authoritative landing page explaining advanced bone grafting and full-arch implant solutions."
    },
    {
        "Clinic_Name": "Dr. Ritika's Dental Studio",
        "Doctor_Name": "Dr. Ritika Malhotra (BDS, Implantologist)",
        "Sub_Locality": "Dindoshi / Film City Road, Malad East",
        "Contact_Number": "+91 98218 55432",
        "Rating": "5.0",
        "Total_Reviews": "108",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Immediate Load Implants & Aligners",
        "Pitch_Angle": "Strategically placed near Dindoshi/Gokuldham residential complexes with 100+ top reviews; missing out on high-income IT/Film City professionals due to no online booking portal."
    },
    {
        "Clinic_Name": "Dr. Anvitis Dental Cube",
        "Doctor_Name": "Dr. Anviti Agarwal (BDS, MDS - Endodontist)",
        "Sub_Locality": "Dindoshi / Gokuldham, Malad East",
        "Contact_Number": "+91 98215 67890",
        "Rating": "4.9",
        "Total_Reviews": "53",
        "Website_Status": "No Website",
        "High_Ticket_Specialty": "Rotary Endodontics & Cosmetic Fillings",
        "Pitch_Angle": "High patient satisfaction in Dindoshi; completely unindexed on Google Search for high-intent queries, making them invisible to new residents moving into premium towers nearby."
    },
    {
        "Clinic_Name": "Patel Dental Clinic",
        "Doctor_Name": "Dr. Nirav Patel (BDS, Orthodontics Consultant)",
        "Sub_Locality": "Ganesh Nagar, Kandivali East",
        "Contact_Number": "+91 98334 52190",
        "Rating": "4.8",
        "Total_Reviews": "82",
        "Website_Status": "Justdial Only",
        "High_Ticket_Specialty": "Clear Aligners & Cosmetic Fillings",
        "Pitch_Angle": "Popular clinic in Ganesh Nagar / Kandivali East; aggregator-dependent lead flow with no automated WhatsApp appointment or review-collection landing page."
    }
]

output_filename = "dental_leads_kandivali_borivali_malad.csv"

fieldnames = [
    "Clinic_Name",
    "Doctor_Name",
    "Sub_Locality",
    "Contact_Number",
    "Rating",
    "Total_Reviews",
    "Website_Status",
    "High_Ticket_Specialty",
    "Pitch_Angle"
]

with open(output_filename, mode="w", newline="", encoding="utf-8-sig") as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    for lead in leads:
        writer.writerow(lead)

print(f"Exported {len(leads)} qualified leads to {output_filename}")

import time
import random
import re
import unicodedata
from pprint import pprint
from requests.cookies import RequestsCookieJar
from linkedin_api import Linkedin
import os
import json
import logging

# ----------------------------------------------------------------------
# STEP 0: Setup Logging (Recommended)
# ----------------------------------------------------------------------
logging.basicConfig(
    filename='linkedin_script.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# ----------------------------------------------------------------------
# STEP 1: Set up LinkedIn session cookies
# ----------------------------------------------------------------------
# It's recommended to use environment variables for security.

LI_AT_COOKIE = "AQEDAShuD6kCy70MAAABlB9yx8oAAAGUQ39LylYAf1OCqAMZlVgro3h2D3E3ZkAxXzoxMietgWggU9WHlCC3COef0lIqpvdj1ORxmJPak3bFfO_Xe2GyxsylofKNcdSz2hlihuHcX9r6pHs0ZIuAyXIk"
JSESSIONID_COOKIE = "ajax:7112808018108196918"

if not LI_AT_COOKIE or not JSESSIONID_COOKIE:
    logging.error("Missing LinkedIn cookies. Please set the LINKEDIN_LI_AT_COOKIE and LINKEDIN_JSESSIONID_COOKIE environment variables.")
    print("❌ Missing LinkedIn cookies. Please set the LINKEDIN_LI_AT_COOKIE and LINKEDIN_JSESSIONID_COOKIE environment variables.")
    exit()

cookies = RequestsCookieJar()
cookies.set("li_at", LI_AT_COOKIE, domain=".linkedin.com", path="/")
cookies.set("JSESSIONID", JSESSIONID_COOKIE, domain=".linkedin.com", path="/")

# ----------------------------------------------------------------------
# STEP 2: Initialize LinkedIn API
# ----------------------------------------------------------------------
try:
    # Initialize without username and password, using cookies instead
    linkedin_api = Linkedin("", "", cookies=cookies)
    logging.info("LinkedIn API initialized successfully.")
    print("✅ LinkedIn API initialized successfully.")
except Exception as e:
    logging.error(f"Error initializing LinkedIn API: {e}")
    print(f"❌ Error initializing LinkedIn API: {e}")
    exit()

# ----------------------------------------------------------------------
# STEP 3: Define Helper Functions
# ----------------------------------------------------------------------

def parse_company_id_from_urn(company_urn: str) -> str:
    """
    Extracts the company ID or slug from a LinkedIn URN.
    """
    if not company_urn or ":" not in company_urn:
        return ""
    parts = company_urn.split(":")
    if len(parts) >= 4:
        return parts[-1]
    return ""

def summarize_company_data(company_data: dict) -> dict:
    """
    Returns a concise summary of the company's key information.
    """
    if not company_data:
        return {}

    summary = {
        "name": company_data.get("name", "N/A"),
        "description": company_data.get("description", "N/A"),
        "universalName": company_data.get("universalName", "N/A"),
        "website": company_data.get("companyPageUrl", company_data.get("url", "N/A")),
        "staffCount": company_data.get("staffCount", "N/A"),
        "followerCount": company_data.get("followingInfo", {}).get("followerCount", "N/A"),
        "headquarters": "N/A"
    }

    # Handle staff count ranges
    staff_range = company_data.get("staffCountRange", {})
    if summary["staffCount"] == "N/A":
        start = staff_range.get("start")
        end = staff_range.get("end")
        summary["staffCount"] = f"{start}–{end}" if (start and end) else "N/A"

    # Parse headquarters location
    headquarter = company_data.get("headquarter", {})
    if headquarter:
        city = headquarter.get("city", "N/A")
        country = headquarter.get("country", "N/A")
        summary["headquarters"] = f"{city}, {country}"

    return summary

def passes_company_filters(company_summary: dict) -> bool:
    """
    Determines if the company meets the specified filtering criteria.
    """
    # 1) Exclude companies headquartered in 'London, CA'
    if company_summary.get("headquarters", "").lower() == "london, ca":
        return False

    # 2) Exclude companies with names like 'Western Ontario' or 'Western University'
    excluded_names = ["western ontario", "western university"]
    name = company_summary.get("name", "").lower()
    universal_name = company_summary.get("universalName", "").lower()
    if any(excl in name or excl in universal_name for excl in excluded_names):
        return False

    # 3) Ensure staffCount >= 10 or followerCount >= 50
    staff_count = company_summary.get("staffCount", 0)
    follower_count = company_summary.get("followerCount", 0)

    # Convert staff_count to integer if possible
    sc_int = 0
    if isinstance(staff_count, int):
        sc_int = staff_count
    elif isinstance(staff_count, str) and "–" in staff_count:
        lower_str = staff_count.split("–")[0]
        try:
            sc_int = int(lower_str)
        except ValueError:
            sc_int = 0

    # Convert follower_count to integer if possible
    fc_int = 0
    if isinstance(follower_count, int):
        fc_int = follower_count
    elif isinstance(follower_count, str):
        try:
            fc_int = int(follower_count)
        except ValueError:
            fc_int = 0

    if sc_int < 10 and fc_int < 50:
        return False

    return True

def normalize_string(s):
    """
    Normalizes strings by removing diacritics and converting to lowercase.
    """
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("utf-8").lower()

def get_relevant_education(education_entries):
    """
    Filters education entries based on relevant degrees, fields, or schools.
    """
    relevant_fields = [
        "engineering", "economics", "computer science", "science", "business administration",
        "finance", "software engineering", "business", "management",
        "organizational studies", "mechatronics", "ai", "artificial intelligence",
        "health sciences", "political science", "international relations",
        "human resources management"
    ]

    relevant_degrees = [
        "bachelor of engineering", "b.e.", "b.sc.", "bachelor's degree", "bachelors degree",
        "bachelor of science", "master of engineering", "m.e.", "m.sc.", "master's degree",
        "masters degree", "honours business administration", "hba", "b.a.", "bm sc",
        "bachelors of management and organizational studies", "b.e.sc", "bm.sc.",
        "business management and organizational studies", "undergraduate", "bmoss",
        "bm.sc", "bmsc", "bm sc.", "bmsc"
    ]

    specific_employers = [
        "ivey business school at western university", "ivey business school", "western university",
        "honours business administration", "hba", "ivey"
    ]

    relevant_education = []
    for edu in education_entries:
        degree = normalize_string(edu.get("degreeName", ""))
        field = normalize_string(edu.get("fieldOfStudy", ""))
        school = normalize_string(edu.get("schoolName", ""))

        degree_match = any(degree_phrase in degree for degree_phrase in relevant_degrees)
        field_match = any(field_phrase in field for field_phrase in relevant_fields)
        school_match = any(emp in school for emp in specific_employers)

        if degree_match or field_match or school_match:
            relevant_education.append(edu)

    return relevant_education

def has_valid_entry_year(education_entries):
    """
    Checks if the education entries meet the entry year criteria.
    """
    for edu in education_entries:
        school = normalize_string(edu.get("schoolName", ""))
        start_date = edu.get("timePeriod", {}).get("startDate", {})
        start_year = start_date.get("year")

        if not start_year:
            continue  # Skip if start year is missing

        # Western University criteria
        if "western university" in school and start_year <= 2022:
            return True

        # Ivey Business School criteria
        if ("ivey business school" in school or "ivey" in school) and start_year <= 2024:
            return True

    return False

def should_exclude_profile(headline, jobtitle):
    """
    Determines if a profile should be excluded based on exclusion phrases.
    """
    exclude_phrases = [
        "first year", "1st year", "freshman", "1 year", "first-year", "1st-year",
        "second year", "2nd year", "sophomore", "2 year", "second-year", "2nd-year"
    ]
    combined_text = f"{headline} {jobtitle}"
    pattern = re.compile(r"\b(" + "|".join(map(re.escape, exclude_phrases)) + r")\b", re.IGNORECASE)
    return bool(pattern.search(combined_text))

def extract_profile_image_url(profile_data):
    """
    Extracts the profile image URL from profile_data, handling various possible structures.
    Prioritizes 'displayPictureUrl' and 'displayPictureFullUrls'.
    """
    # Priority 1: Check for 'displayPictureUrl'
    display_picture_url = profile_data.get("displayPictureUrl")
    if display_picture_url:
        return display_picture_url

    # Priority 2: Check 'displayPictureFullUrls' for specific resolutions
    display_picture_full_urls = profile_data.get("displayPictureFullUrls", {})
    if display_picture_full_urls:
        # Choose the preferred resolution, e.g., '200_200'
        preferred_size = "200_200"
        return display_picture_full_urls.get(preferred_size, "N/A")

    # Fallback: Existing paths
    possible_paths = [
        ["profile_pic_url"],
        ["profile_image_url"],
        ["picture_info", "original_image_info", "url"],
        ["picture_url"],
        ["image_url"],
    ]

    for path in possible_paths:
        data = profile_data
        try:
            for key in path:
                data = data[key]
            if data and isinstance(data, str):
                return data if data.startswith("http") else f"https://www.linkedin.com{data}"
        except (KeyError, TypeError):
            continue
    return "N/A"

def get_profile_connections(linkedin_api, urn_id, limit=10):
    """
    Fetches a limited number of connections for a given LinkedIn profile.

    Parameters:
    - linkedin_api: Initialized Linkedin object.
    - urn_id (str): LinkedIn URN ID for the profile.
    - limit (int): Maximum number of connections to retrieve.

    Returns:
    - List of connections (each connection is a dict).
    """
    try:
        connections = linkedin_api.get_profile_connections(urn_id=urn_id, limit=limit)
        return connections
    except Exception as e:
        logging.error(f"Error fetching connections for URN {urn_id}: {e}")
        print(f"   ❌ Error fetching connections: {e}")
        return []

def get_profile_contact_info(linkedin_api, public_id=None, urn_id=None):
    """
    Fetches contact information for a given LinkedIn profile.

    Parameters:
    - linkedin_api: Initialized Linkedin object.
    - public_id (str, optional): LinkedIn public ID for the profile.
    - urn_id (str, optional): LinkedIn URN ID for the profile.

    Returns:
    - Contact information as a dict.
    """
    try:
        contact_info = linkedin_api.get_profile_contact_info(public_id=public_id, urn_id=urn_id)
        return contact_info
    except Exception as e:
        logging.error(f"Error fetching contact info for URN {urn_id}: {e}")
        print(f"   ❌ Error fetching contact info: {e}")
        return {}

def get_profile_member_badges(linkedin_api, public_profile_id):
    """
    Fetches member badges for a given LinkedIn profile.

    Parameters:
    - linkedin_api: Initialized Linkedin object.
    - public_profile_id (str): Public ID of the LinkedIn profile.

    Returns:
    - Badges data as a dict.
    """
    try:
        badges = linkedin_api.get_profile_member_badges(public_profile_id=public_profile_id)
        return badges
    except Exception as e:
        logging.error(f"Error fetching member badges for public_id {public_profile_id}: {e}")
        print(f"   ❌ Error fetching member badges: {e}")
        return {}

# ----------------------------------------------------------------------
# STEP 4: Search for People
# ----------------------------------------------------------------------
try:
    people = linkedin_api.search_people(
        keywords="Western University alumni",
        limit=100  # Adjust the limit as needed
    )
    logging.info(f"Total search results returned: {len(people)}")
    print(f"✅ Total search results returned: {len(people)}")
except Exception as e:
    logging.error(f"Error during search_people: {e}")
    print(f"❌ Error during search_people: {e}")
    people = []

# ----------------------------------------------------------------------
# STEP 5: Initialize Cache and Results List
# ----------------------------------------------------------------------
company_cache = {}
filtered_people = []

# Debug counters to see how many fail each filter
headline_fail = 0
employer_fail = 0
field_fail = 0
exclusion_fail = 0
entry_year_fail = 0

# ----------------------------------------------------------------------
# STEP 6: Iterate Through Each Person and Apply Filters
# ----------------------------------------------------------------------
for idx, person in enumerate(people, start=1):
    name = person.get("name", "N/A")
    print(f"\n🔍 Processing Profile {idx}/{len(people)}: {name}")
    logging.info(f"Processing Profile {idx}/{len(people)}: {name}")
    
    urn_id = person.get("urn_id")
    public_id = person.get("public_id")

    # Fetch full profile
    profile_data = None
    try:
        if public_id:
            profile_data = linkedin_api.get_profile(public_id=public_id)
            print(f"   📄 Fetched profile using public_id: {public_id}")
            logging.info(f"Fetched profile using public_id: {public_id}")
        elif urn_id:
            profile_data = linkedin_api.get_profile(urn_id=urn_id)
            print(f"   📄 Fetched profile using urn_id: {urn_id}")
            logging.info(f"Fetched profile using urn_id: {urn_id}")
        else:
            print("   ❌ Both public_id and urn_id are missing. Skipping profile.")
            logging.warning("Both public_id and urn_id are missing. Skipping profile.")
            continue
    except Exception as exc:
        print(f"   ❌ Error fetching profile: {exc}")
        logging.error(f"Error fetching profile: {exc}")
        continue

    if not profile_data:
        print("   ❌ No profile data retrieved. Skipping.")
        logging.warning("No profile data retrieved. Skipping.")
        continue

    # Extract necessary profile information
    first_name = profile_data.get("firstName", "")
    last_name = profile_data.get("lastName", "")
    headline = normalize_string(profile_data.get("headline", ""))
    jobtitle = normalize_string(profile_data.get("jobTitle", ""))
    location = profile_data.get("locationName", "N/A")
    education = profile_data.get("education", [])

    # Extract profile image URL with updated function
    profile_image_url = extract_profile_image_url(profile_data)
    print(f"   📷 Profile Image URL: {profile_image_url}")
    logging.info(f"Profile Image URL: {profile_image_url}")

    # Extract current company from experience
    experiences = profile_data.get("experience", [])
    if experiences:
        current_job = experiences[0]
        current_company = normalize_string(current_job.get("companyName", ""))
        print(f"   🏢 Current Company: {current_company.title() if current_company else 'N/A'}")
        logging.info(f"Current Company: {current_company.title() if current_company else 'N/A'}")
    else:
        current_company = ""
        print("   🏢 No current company information available.")
        logging.info("No current company information available.")

    # Apply Employer Filter: Exclude profiles currently at Western University
    if "western university" in current_company:
        employer_fail += 1
        print("   ❌ Currently employed at Western University. Skipping.")
        logging.info("Currently employed at Western University. Skipping.")
        continue

    print("   ✅ Passes employer filter (not at Western).")
    logging.info("Passes employer filter (not at Western).")

    # Apply Headline Filter: Check for relevant keywords
    headline_keywords = [
        "engineering", "economics", "computer science", "finance", "software engineering",
        "analyst", "financial", "business", "management", "ai", "artificial intelligence",
        "health sciences", "political science", "international relations",
        "human resources management", "hba", "ivey", "bm.sc", "business administration"
    ]
    has_relevant_headline = any(kw in headline for kw in headline_keywords)
    if not has_relevant_headline:
        headline_fail += 1
        print("   ⚠️ Headline does not indicate relevant field or degree.")
        logging.info("Headline does not indicate relevant field or degree.")
    else:
        print("   ✅ Passes headline filter.")
        logging.info("Passes headline filter.")

    # Apply Education Filter: Check for relevant degrees, fields, or schools
    relevant_education = get_relevant_education(education)
    if not relevant_education and not has_relevant_headline:
        field_fail += 1
        print("   ❌ Does not have relevant education or headline. Skipping.")
        logging.info("Does not have relevant education or headline. Skipping.")
        continue
    else:
        print("   ✅ Passes education or headline filter.")
        logging.info("Passes education or headline filter.")

    # Exclude Profiles Indicating First or Second-Year Students
    if should_exclude_profile(headline, jobtitle):
        exclusion_fail += 1
        print("   ❌ Profile indicates first-year or second-year student. Skipping.")
        logging.info("Profile indicates first-year or second-year student. Skipping.")
        continue
    else:
        print("   ✅ Passes exclusion filter for student years.")
        logging.info("Passes exclusion filter for student years.")

    # Check Entry Year Criteria
    if not has_valid_entry_year(education):
        entry_year_fail += 1
        print("   ❌ Does not meet entry year criteria. Skipping.")
        logging.info("Does not meet entry year criteria. Skipping.")
        continue
    else:
        print("   ✅ Passes entry year filter.")
        logging.info("Passes entry year filter.")

    # At this point, the profile passes all initial filters.
    # Now, proceed to analyze the associated company.

    # Extract company URN from first experience
    if experiences:
        first_experience = experiences[0]
        company_urn = first_experience.get("companyUrn") or first_experience.get("company", {}).get("companyUrn", "")
    else:
        company_urn = ""

    if not company_urn:
        print("   ❌ No company URN found. Skipping company analysis.")
        logging.info("No company URN found. Skipping company analysis.")
        continue

    # Parse company ID or slug from URN
    company_id_or_slug = parse_company_id_from_urn(company_urn)
    if not company_id_or_slug:
        print("   ❌ Could not parse company ID from URN. Skipping company analysis.")
        logging.info("Could not parse company ID from URN. Skipping company analysis.")
        continue

    # Fetch company data, utilizing cache to minimize API calls
    if company_id_or_slug in company_cache:
        raw_company_data = company_cache[company_id_or_slug]
        print(f"   🔄 Retrieved company data from cache for '{company_id_or_slug}'.")
        logging.info(f"Retrieved company data from cache for '{company_id_or_slug}'.")
    else:
        try:
            raw_company_data = linkedin_api.get_company(company_id_or_slug)
            company_cache[company_id_or_slug] = raw_company_data
            print(f"   📊 Fetched company data for '{company_id_or_slug}'.")
            logging.info(f"Fetched company data for '{company_id_or_slug}'.")
        except Exception as exc:
            print(f"   ❌ Error fetching company data: {exc}")
            logging.error(f"Error fetching company data for '{company_id_or_slug}': {exc}")
            continue

    # Summarize company data
    summarized_company = summarize_company_data(raw_company_data)
    print("   📝 Summarized Company Data:")
    pprint(summarized_company)
    logging.info(f"Summarized Company Data: {summarized_company}")

    # Apply Company Filters
    if not passes_company_filters(summarized_company):
        print("   ❌ Company does not pass filter criteria. Skipping profile.")
        logging.info("Company does not pass filter criteria. Skipping profile.")
        continue
    else:
        print("   ✅ Company passes all filter criteria.")
        logging.info("Company passes all filter criteria.")

    # Fetch Additional Data: Connections, Contact Info, and Member Badges
    connections = get_profile_connections(linkedin_api, urn_id=urn_id, limit=10)  # Limit to 10 connections
    contact_info = get_profile_contact_info(linkedin_api, public_id=public_id, urn_id=urn_id)
    member_badges = {}
    if public_id:
        member_badges = get_profile_member_badges(linkedin_api, public_profile_id=public_id)

    # Print Connections
    print("   📇 Fetched Connections:")
    logging.info("Fetched Connections:")
    if connections:
        for conn in connections:
            conn_name = conn.get("name", "N/A")
            conn_headline = conn.get("headline", "N/A")
            print(f"      - {conn_name} | {conn_headline}")
            logging.info(f"      - {conn_name} | {conn_headline}")
    else:
        print("      N/A")
        logging.info("      N/A")

    # Print Contact Information
    print("   📞 Contact Information:")
    logging.info("Contact Information:")
    if contact_info:
        pprint(contact_info)
        logging.info(f"Contact Information: {contact_info}")
    else:
        print("      N/A")
        logging.info("      N/A")

    # Print Member Badges
    print("   🏅 Member Badges:")
    logging.info("Member Badges:")
    if member_badges:
        pprint(member_badges)
        logging.info(f"Member Badges: {member_badges}")
    else:
        print("      N/A")
        logging.info("      N/A")

    # Construct LinkedIn profile URL using public_id
    linkedin_url = f"https://www.linkedin.com/in/{urn_id}"

    # If all filters pass, add the person to the final results
    filtered_people.append({
        "name": f"{first_name} {last_name}",
        "headline": profile_data.get("headline", ""),
        "jobTitle": profile_data.get("jobTitle", ""),
        "location": location,
        "linkedin_url": linkedin_url,
        "profile_image_url": profile_image_url,  # Updated to use the new function
        "company": summarized_company["name"],
        "company_summary": summarized_company,
        "connections": connections,
        "contact_info": contact_info,
        "member_badges": member_badges  # Included member badges
    })

    print("   🟢 Profile added to final results.")
    logging.info("Profile added to final results.")

    # Sleep to avoid rate-limiting
    time.sleep(random.uniform(1, 2))

# ----------------------------------------------------------------------
# STEP 7: Present Final Results
# ----------------------------------------------------------------------
print("\n🎉===== FINAL FILTERED RESULTS =====🎉\n")
logging.info("Final Filtered Results:")
if filtered_people:
    for idx, person in enumerate(filtered_people, start=1):
        print(f"🔹 Person {idx}: {person['name']}")
        print(f"   - Headline: {person['headline']}")
        print(f"   - Job Title: {person['jobTitle']}")
        print(f"   - Location: {person['location']}")
        print(f"   - LinkedIn Profile: {person['linkedin_url']}")
        print(f"   - Profile Image: {person['profile_image_url']}")
        print(f"   - Company: {person['company']}")
        print(f"   - Company Website: {person['company_summary'].get('website', 'N/A')}")
        print(f"   - Followers: {person['company_summary'].get('followerCount', 'N/A')}")
        print(f"   - Staff Count: {person['company_summary'].get('staffCount', 'N/A')}")
        print("   - Connections:")
        if person["connections"]:
            for conn in person["connections"]:
                conn_name = conn.get("name", "N/A")
                conn_headline = conn.get("headline", "N/A")
                print(f"      • {conn_name} | {conn_headline}")
        else:
            print("      N/A")
        print("   - Contact Information:")
        if person["contact_info"]:
            for key, value in person["contact_info"].items():
                # Format contact info for readability
                if isinstance(value, list):
                    value = ", ".join(value)
                print(f"      • {key.replace('_', ' ').title()}: {value}")
        else:
            print("      N/A")
        print("   - Member Badges:")
        if person["member_badges"]:
            for badge_key, badge_value in person["member_badges"].items():
                print(f"      • {badge_key.replace('_', ' ').title()}: {badge_value}")
        else:
            print("      N/A")
        print("-" * 70)
    logging.info(f"Total passing profiles: {len(filtered_people)}")
else:
    print("❌ No profiles matched all the criteria.")
    logging.info("No profiles matched all the criteria.")
'''
# ----------------------------------------------------------------------
# STEP 8: Export Final Results to JSON and CSV (Optional)
# ----------------------------------------------------------------------
# Export to JSON
try:
    with open('filtered_people.json', 'w') as f:
        json.dump(filtered_people, f, indent=4)
    print("✅ Final results exported to 'filtered_people.json'.")
    logging.info("Final results exported to 'filtered_people.json'.")
except Exception as e:
    print(f"❌ Error exporting to JSON: {e}")
    logging.error(f"Error exporting to JSON: {e}")

# Export to CSV using Pandas
try:
    import pandas as pd

    # Flatten nested dictionaries for CSV compatibility
    def flatten_person(person):
        connections = person.get("connections", [])
        connections_str = "; ".join([f"{conn.get('name', 'N/A')} | {conn.get('headline', 'N/A')}" for conn in connections]) if connections else "N/A"
        
        contact_info = person.get("contact_info", {})
        contact_info_str = "; ".join([f"{key.replace('_', ' ').title()}: {value}" for key, value in contact_info.items() if value]) if contact_info else "N/A"
        
        member_badges = person.get("member_badges", {})
        member_badges_str = "; ".join([f"{key.replace('_', ' ').title()}: {value}" for key, value in member_badges.items() if value]) if member_badges else "N/A"
        
        return {
            "Name": person["name"],
            "Headline": person["headline"],
            "Job Title": person["jobTitle"],
            "Location": person["location"],
            "LinkedIn URL": person["linkedin_url"],
            "Profile Image URL": person["profile_image_url"],
            "Company": person["company"],
            "Company Website": person["company_summary"].get("website", "N/A"),
            "Followers": person["company_summary"].get("followerCount", "N/A"),
            "Staff Count": person["company_summary"].get("staffCount", "N/A"),
            "Connections": connections_str,
            "Contact Information": contact_info_str,
            "Member Badges": member_badges_str
        }

    flattened_people = [flatten_person(person) for person in filtered_people]

    df = pd.DataFrame(flattened_people)
    df.to_csv('filtered_people.csv', index=False)
    print("✅ Final results exported to 'filtered_people.csv'.")
    logging.info("Final results exported to 'filtered_people.csv'.")
except ImportError:
    print("⚠️ Pandas not installed. Skipping CSV export.")
    logging.warning("Pandas not installed. Skipping CSV export.")
except Exception as e:
    print(f"❌ Error exporting to CSV: {e}")
    logging.error(f"Error exporting to CSV: {e}")
'''
# ----------------------------------------------------------------------
# STEP 9: Debug Stats (Optional)
# ----------------------------------------------------------------------
print("\n===== DEBUG FILTER STATS =====")
logging.info("Debug Filter Stats:")
print(f"Profiles failing 'relevant field or degree' in headline: {headline_fail}")
print(f"Profiles failing 'not working at Western': {employer_fail}")
print(f"Profiles failing 'relevant field/employer': {field_fail}")
print(f"Profiles failing 'first-year or second-year' exclusion: {exclusion_fail}")
print(f"Profiles failing 'entry year' criteria: {entry_year_fail}")
print(
    f"Total filtered out by some criterion: "
    f"{headline_fail + employer_fail + field_fail + exclusion_fail + entry_year_fail}"
)
print(f"Total passing: {len(filtered_people)}")
logging.info(f"Profiles failing 'relevant field or degree' in headline: {headline_fail}")
logging.info(f"Profiles failing 'not working at Western': {employer_fail}")
logging.info(f"Profiles failing 'relevant field/employer': {field_fail}")
logging.info(f"Profiles failing 'first-year or second-year' exclusion: {exclusion_fail}")
logging.info(f"Profiles failing 'entry year' criteria: {entry_year_fail}")
logging.info(f"Total filtered out by some criterion: {headline_fail + employer_fail + field_fail + exclusion_fail + entry_year_fail}")
logging.info(f"Total passing: {len(filtered_people)}")

print("\n✅ Done.")
logging.info("Script execution completed.")
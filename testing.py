from linkedin_api import Linkedin
from requests.cookies import RequestsCookieJar
import re
import time
import random
import unicodedata

# ----------------------------------------------------------------------
# STEP 1: Set up LinkedIn session cookies
# ----------------------------------------------------------------------
LI_AT_COOKIE = "AQEDAShuD6kBf7LcAAABlADH33oAAAGUJNRjelYAvwyBkadPnAleFPfzwL9gGkiKdDvk2O2w-AQ5u4Cy1H_sSOuK1O55neZClOFPnn81yzxCzmWuAYVq7l1TKljG5kQjfY5MSToDrn6QyOEKUNYKrhiB"  # Replace with your LinkedIn li_at cookie
JSESSIONID_COOKIE = "ajax:7112808018108196918"  # Replace with your JSESSIONID cookie


cookies = RequestsCookieJar()
cookies.set("li_at", LI_AT_COOKIE, domain=".linkedin.com", path="/")
cookies.set("JSESSIONID", JSESSIONID_COOKIE, domain=".linkedin.com", path="/")

# ----------------------------------------------------------------------
# STEP 2: Initialize the Linkedin object with cookies
# ----------------------------------------------------------------------
try:
    linkedin_api = Linkedin("", "", cookies=cookies)
    print("LinkedIn API initialized successfully.")
except Exception as e:
    print(f"Error initializing LinkedIn API: {e}")
    exit()

# ----------------------------------------------------------------------
# STEP 3: Search for people by keyword ("Western University alumni")
# ----------------------------------------------------------------------
try:
    people = linkedin_api.search_people(
        keywords="Western University alumni",  # Keyword search for alumni
        limit=100,  # Adjust as needed
    )
    print(f"Total search results returned: {len(people)}")
except Exception as e:
    print(f"Error during search_people: {e}")
    people = []

# ----------------------------------------------------------------------
# STEP 4: Define filtering criteria
# ----------------------------------------------------------------------

# Define undergraduate fields with more variations
relevant_fields = [
    "engineering",
    "economics",
    "computer science",
    "science",
    "business administration",
    "finance",
    "software engineering",
    "business",
    "management",
    "organizational studies",
    "mechatronics",
    "ai",
    "artificial intelligence",
    "health sciences",
    "political science",
    "international relations",
    "human resources management",
    "business administration and management",
]

# Define relevant degrees with more variations
relevant_degrees = [
    "bachelor of engineering",
    "b.e.",
    "b.sc.",
    "bachelor's degree",
    "bachelors degree",
    "bachelor of science",
    "master of engineering",
    "m.e.",
    "m.sc.",
    "master's degree",
    "masters degree",
    "honours business administration",
    "hba",
    "b.a.",
    "bm sc",
    "bachelors of management and organizational studies",
    "b.e.sc",
    "bm.sc.",
    "business management and organizational studies",
    "undergraduate",
    "bmoss",
    "bm.sc",
    "bmsc",
    "bm sc.",
    "bmsc",
]

# Define specific employers/degrees with more variations
specific_employers = [
    "ivey business school at western university",
    "ivey business school",
    "western university",
    "honours business administration",
    "hba",
    "ivey",
]

# Define headline keywords/phrases that might indicate relevant fields or degrees
headline_keywords = [
    "engineering",
    "economics",
    "computer science",
    "finance",
    "software engineering",
    "analyst",
    "financial",
    "business",
    "management",
    "ai",
    "artificial intelligence",
    "health sciences",
    "political science",
    "international relations",
    "human resources management",
    "hba",
    "ivey",
    "bm.sc",
    "business administration",
]

# Define phrases indicating first-year or second-year students to exclude
exclude_phrases = [
    # First-Year Variations
    "first year",
    "1st year",
    "freshman",
    "1 year",
    "first-year",
    "1st-year",
    # Second-Year Variations
    "second year",
    "2nd year",
    "sophomore",
    "2 year",
    "second-year",
    "2nd-year",
]

# Compile regex patterns for exclusion phrases for efficient matching
exclude_patterns = re.compile(
    r"\b(" + "|".join(map(re.escape, exclude_phrases)) + r")\b", re.IGNORECASE
)


# Function to normalize strings
def normalize_string(s):
    """
    Normalize the input string by removing diacritics and converting to lowercase.
    """
    return (
        unicodedata.normalize("NFKD", s)
        .encode("ascii", "ignore")
        .decode("utf-8")
        .lower()
    )


# Function to search for a company and retrieve its public_id
def get_company_public_id(linkedin_api, company_name):
    """
    Search for a company by name and return its public_id.
    Returns None if the company is not found.
    """
    search_results = linkedin_api.search_companies(keywords=company_name)
    if search_results:
        # Assuming the first search result is the desired company
        return search_results[0].get("public_id")
    else:
        print(f"   - Company '{company_name}' not found.")
        return None


# Function to fetch company details
def fetch_company_details(linkedin_api, public_id):
    """
    Fetch company details using public_id.
    Returns a dictionary with company information or None if not found.
    """
    if not public_id:
        return None
    try:
        company_profile = linkedin_api.get_company(public_id=public_id)
        return company_profile
    except Exception as e:
        print(f"   - Error fetching company details for public_id '{public_id}': {e}")
        return None


# Function to extract company metrics
def extract_company_metrics(company_info):
    """
    Extracts followers count and employee count from company_info.
    Returns a tuple (followers_count, employee_count).
    """
    followers_count = "N/A"
    employee_count = "N/A"

    if not company_info:
        return followers_count, employee_count

    # Debugging: Print the entire company_info
    print("   - Company Info Structure:")
    print(company_info)

    # Attempt to extract follower count
    if "followerCount" in company_info:
        followers_count = company_info.get("followerCount", "N/A")
    elif "followers_count" in company_info:
        followers_count = company_info.get("followers_count", "N/A")
    elif "stats" in company_info and "followerCount" in company_info["stats"]:
        followers_count = company_info["stats"].get("followerCount", "N/A")

    # Attempt to extract employee count
    if "employeeCount" in company_info:
        employee_count = company_info.get("employeeCount", "N/A")
    elif "employee_count" in company_info:
        employee_count = company_info.get("employee_count", "N/A")
    elif "staffCountRange" in company_info:
        employee_count = company_info.get("staffCountRange", "N/A")
    elif "stats" in company_info and "employeeCount" in company_info["stats"]:
        employee_count = company_info["stats"].get("employeeCount", "N/A")

    # Additional checks for nested structures or alternative keys can be added here

    return followers_count, employee_count


# Function to check if degree is relevant
def is_relevant_degree(education_entry):
    degree = normalize_string(education_entry.get("degreeName", ""))
    field = normalize_string(education_entry.get("fieldOfStudy", ""))
    school = normalize_string(education_entry.get("schoolName", ""))

    print(f"   - Evaluating Education Entry:")
    print(f"     Degree: '{degree}'")
    print(f"     Field: '{field}'")
    print(f"     School: '{school}'")

    # Check if degree matches
    degree_match = any(degree_phrase in degree for degree_phrase in relevant_degrees)
    if degree_match:
        print(f"     -> Degree Match: '{degree}' matches relevant degrees.")
    else:
        print(f"     -> Degree Mismatch: '{degree}' does not match relevant degrees.")

    # Check if field matches
    field_match = any(field_phrase in field for field_phrase in relevant_fields)
    if field_match:
        print(f"     -> Field Match: '{field}' matches relevant fields.")
    else:
        print(f"     -> Field Mismatch: '{field}' does not match relevant fields.")

    # Check if school matches
    school_match = any(emp in school for emp in specific_employers)
    if school_match:
        print(f"     -> School Match: '{school}' matches specific employers/degrees.")
    else:
        print(
            f"     -> School Mismatch: '{school}' does not match specific employers/degrees."
        )

    result = degree_match or field_match or school_match
    print(f"     -> is_relevant_degree: {result}")
    return result


# Function to check entry year criteria
def has_valid_entry_year(education_entries):
    for edu in education_entries:
        school = normalize_string(edu.get("schoolName", ""))
        start_date = edu.get("timePeriod", {}).get("startDate", {})
        start_year = start_date.get("year")

        if not start_year:
            print(f"   - Skipping education entry without start year: {edu}")
            continue  # Skip if start year is missing

        # Check for Western University entry year
        if "western university" in school:
            if start_year <= 2022:
                print(f"   - Valid entry: Western University, start year {start_year}")
                return True
            else:
                print(f"   - Western University entry year {start_year} exceeds 2022")

        # Check for Ivey Business School entry year
        elif "ivey business school" in school or "ivey" in school:
            if start_year <= 2024:
                print(
                    f"   - Valid entry: Ivey Business School, start year {start_year}"
                )
                return True
            else:
                print(f"   - Ivey Business School entry year {start_year} exceeds 2024")

    print("   - No valid entry year found.")
    return False


# Initialize a cache dictionary for company data
company_cache = {}

filtered_people = []

# Debug counters to see how many fail each filter
headline_fail = 0
employer_fail = 0
field_fail = 0
exclusion_fail = 0
entry_year_fail = 0

for idx, person_summary in enumerate(people, start=1):
    print(f"\nProcessing Profile {idx}: {person_summary}")
    urn_id = person_summary.get("urn_id")
    public_id = person_summary.get("public_id")

    # Attempt to fetch profile using public_id or urn_id
    profile_data = None
    if public_id:
        try:
            profile_data = linkedin_api.get_profile(public_id=public_id)
            print(f" - Fetched profile using public_id: {public_id}")
        except Exception as e:
            print(f" - Error fetching profile with public_id: {e}")
    elif urn_id:
        try:
            # Attempting to use urn_id directly if supported
            profile_data = linkedin_api.get_profile(urn_id=urn_id)
            print(f" - Fetched profile using urn_id: {urn_id}")
        except Exception as e:
            print(f" - Error fetching profile with urn_id: {e}")

    if not profile_data:
        print(" - Skipping: No profile data retrieved.")
        continue

    # Gather relevant data from the profile
    first_name = profile_data.get("firstName", "")
    last_name = profile_data.get("lastName", "")
    headline = normalize_string(profile_data.get("headline", ""))
    jobtitle = normalize_string(profile_data.get("jobTitle", ""))
    location = profile_data.get("locationName", "")
    current_company = ""

    # Extract current company from 'experience' if available
    experiences = profile_data.get("experience", [])
    if experiences:
        current_job = experiences[0]
        current_company_name = current_job.get("companyName", "").strip().lower()
        current_company = normalize_string(current_job.get("companyName", ""))
        print(f" - Current Company from experience: {current_company}")
    else:
        print(" - No experiences found to extract current company.")

    # Debug: Print education data
    education = profile_data.get("education", [])
    print(f" - Education Data: {education}")

    # (A) Check if headline contains any of the undergrad fields or specific employers/degrees
    has_relevant_headline = any(kw in headline for kw in headline_keywords)
    if not has_relevant_headline:
        headline_fail += 1
        print(" - Headline does not indicate relevant field or degree.")
        # Do not skip; rely on relevant education instead
    else:
        print(" - Passes headline filter.")

    # (B) Check if current company is NOT 'Western University'
    if "western university" in current_company:
        employer_fail += 1
        print(" - Skipping: Currently employed at Western University.")
        continue

    print(" - Passes employer filter (not at Western).")

    # (C) Check if undergraduate field matches or specific employer/degrees
    # Extract relevant education entries
    relevant_education = [edu for edu in education if is_relevant_degree(edu)]

    if not relevant_education and not has_relevant_headline:
        field_fail += 1
        print(
            " - Skipping: Does not have relevant undergraduate field or specific employer/degree."
        )
        continue

    if relevant_education:
        print(" - Passes field/employer filter.")
    else:
        print(" - Passes field/employer filter based on headline.")

    # (D) Exclude profiles indicating first-year or second-year students
    combined_text = f"{headline} {jobtitle}"
    if exclude_patterns.search(combined_text):
        exclusion_fail += 1
        print(" - Skipping: Profile indicates first-year or second-year student.")
        continue

    print(" - Passes exclusion filter for first/second-year students.")

    # (E) Check entry year criteria
    if not has_valid_entry_year(education):
        entry_year_fail += 1
        print(
            " - Skipping: Does not meet entry year criteria for Western University or Ivey Business School."
        )
        continue

    print(" - Passes entry year filter.")

    # (F) Fetch company details (all available information)
    company_info_full = {}
    if current_company:
        if current_company in company_cache:
            company_info_full = company_cache[current_company]
            print(f"   - Retrieved company info from cache for '{current_company}'.")
        else:
            # Search for the company to get its public_id
            public_id_company = get_company_public_id(linkedin_api, current_company)
            if public_id_company:
                # Fetch company details
                company_info_full = fetch_company_details(
                    linkedin_api, public_id_company
                )
                if company_info_full:
                    # Store in cache
                    company_cache[current_company] = company_info_full
                    print(
                        f"   - Fetched and cached company info for '{current_company}'."
                    )
                else:
                    company_cache[current_company] = None
                    company_info_full = None
            else:
                company_info_full = None
                company_cache[current_company] = None
    else:
        print(" - No current company information available.")

    # Include the entire company_info in the output
    if company_info_full:
        print("   - Company Information:")
        print(company_info_full)
    else:
        print("   - Company Information: N/A")

    # If all checks pass, add to filtered_people
    linkedin_url = ""
    if public_id:
        linkedin_url = f"https://www.linkedin.com/in/{public_id}"
    elif urn_id:
        # Note: Using urn_id in URL may not lead to a valid profile
        linkedin_url = f"https://www.linkedin.com/in/{urn_id}"

    filtered_people.append(
        {
            "name": f"{first_name} {last_name}",
            "headline": profile_data.get("headline", ""),
            "location": location,
            "linkedin_url": linkedin_url,
            "company": current_company.title(),
            "degrees": [edu.get("degreeName", "") for edu in relevant_education],
            "fieldsOfStudy": [
                edu.get("fieldOfStudy", "") for edu in relevant_education
            ],
            "company_info": company_info_full if company_info_full else "N/A",
        }
    )

    print("   - Company Followers: N/A")  # Since we're returning full info
    print("   - Company Employee Count: N/A")  # Same as above

    # Optional: Sleep to prevent rate limiting
    time.sleep(random.uniform(0.5, 1.5))  # Adjust sleep duration as needed

# ----------------------------------------------------------------------
# STEP 5: Print out the final filtered results
# ----------------------------------------------------------------------
print("\n===== FILTERED ALUMNI WITH ADVANCED CRITERIA =====\n")
if filtered_people:
    for person in filtered_people:
        print(f"Name:         {person['name']}")
        print(f"Headline:     {person['headline']}")
        print(f"Location:     {person['location']}")
        print(f"Company:      {person['company']}")
        print("Company Info:")
        if person["company_info"] != "N/A":
            print(person["company_info"])
        else:
            print("N/A")
        print(f"Degrees:      {', '.join(person['degrees'])}")
        print(f"Fields of Study: {', '.join(person['fieldsOfStudy'])}")
        print(f"Profile:      {person['linkedin_url']}")
        print("-" * 50)
else:
    print("No profiles matched the advanced criteria.")

# ----------------------------------------------------------------------
# DEBUG Stats
# ----------------------------------------------------------------------
print("\n===== DEBUG FILTER STATS =====")
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

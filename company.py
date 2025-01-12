import time
import random
from pprint import pprint
from requests.cookies import RequestsCookieJar
from linkedin_api import Linkedin

# ----------------------------------------------------------------------
# STEP 1: Hardcoded LinkedIn Cookies
# ----------------------------------------------------------------------
# WARNING: This is insecure in production. Use environment variables in real usage.
LI_AT_COOKIE = "AQEDAShuD6kBf7LcAAABlADH33oAAAGUJNRjelYAvwyBkadPnAleFPfzwL9gGkiKdDvk2O2w-AQ5u4Cy1H_sSOuK1O55neZClOFPnn81yzxCzmWuAYVq7l1TKljG5kQjfY5MSToDrn6QyOEKUNYKrhiB"
JSESSIONID_COOKIE = "ajax:7112808018108196918"

cookies = RequestsCookieJar()
cookies.set("li_at", LI_AT_COOKIE, domain=".linkedin.com", path="/")
cookies.set("JSESSIONID", JSESSIONID_COOKIE, domain=".linkedin.com", path="/")

# ----------------------------------------------------------------------
# STEP 2: Initialize LinkedIn API
# ----------------------------------------------------------------------
try:
    linkedin_api = Linkedin("", "", cookies=cookies)
    print("LinkedIn API initialized successfully.")
except Exception as e:
    print(f"Error initializing LinkedIn API: {e}")
    exit()

# ----------------------------------------------------------------------
# Helper: Parse URN to get ID/Slug
# ----------------------------------------------------------------------
def parse_company_id_from_urn(company_urn: str) -> str:

    if not company_urn or ":" not in company_urn:
        return ""
    parts = company_urn.split(":")
    if len(parts) >= 4:
        return parts[-1]
    return ""

# ----------------------------------------------------------------------
# Summarize Company Data (so it's more readable)
# ----------------------------------------------------------------------
def summarize_company_data(company_data: dict) -> dict:
    """
    Return a smaller dictionary with a handful of key fields from the raw company_data.
    """
    if not company_data:
        return {}

    summary = {}
    
    # Basic fields
    summary["name"] = company_data.get("name", "N/A")
    summary["description"] = company_data.get("description", "N/A")
    summary["universalName"] = company_data.get("universalName", "N/A")

    # Website
    summary["website"] = company_data.get("companyPageUrl", "N/A")
    if summary["website"] == "N/A":
        summary["website"] = company_data.get("url", "N/A")

    # Staff Count (could be a single int or a range)
    staff_count = company_data.get("staffCount")
    staff_range = company_data.get("staffCountRange", {})
    if staff_count is not None:
        summary["staffCount"] = staff_count
    else:
        start = staff_range.get("start")
        end = staff_range.get("end")
        summary["staffCount"] = f"{start}–{end}" if (start and end) else "N/A"

    # Follower Count
    follower_count = "N/A"
    following_info = company_data.get("followingInfo", {})
    if following_info:
        follower_count = following_info.get("followerCount", "N/A")
    summary["followerCount"] = follower_count

    # Headquarters location
    # Attempt to parse e.g. "Toronto, CA"
    headquarter = company_data.get("headquarter", {})
    if headquarter:
        city = headquarter.get("city", "N/A")
        country = headquarter.get("country", "N/A")
        summary["headquarters"] = f"{city}, {country}"
    else:
        summary["headquarters"] = "N/A"

    return summary

# ----------------------------------------------------------------------
# Filter Function
# ----------------------------------------------------------------------
def passes_filters(company_summary: dict) -> bool:
    """
    Return True if the company_summary passes the filters:
      1. Not located in 'London, CA'
      2. Company name doesn't look like 'Western Ontario' or 'Western University'
      3. staffCount >= 10 or followerCount >= 50
    Otherwise, return False.
    """
    # 1) Check headquarters != 'London, CA'
    if company_summary.get("headquarters", "").lower() == "london, ca":
        return False

    # 2) Exclude if name/universalName includes 'western ontario' or 'western university'
    #    (We can do a simple substring check, or you can be more elaborate.)
    #    We'll do a straightforward check in both 'name' and 'universalName'.
    company_name = company_summary.get("name", "").lower()
    universal_name = company_summary.get("universalName", "").lower()

    if "western ontario" in company_name or "western ontario" in universal_name:
        return False
    if "western university" in company_name or "western university" in universal_name:
        return False

    # 3) staffCount >= 10 OR followerCount >= 50
    staff_count = company_summary.get("staffCount", 0)
    follower_count = company_summary.get("followerCount", 0)

    # staffCount might be a string if it's a range. e.g. "11–50". Let's handle that:
    sc_int = 0
    if isinstance(staff_count, int):
        sc_int = staff_count
    elif isinstance(staff_count, str) and "–" in staff_count:
        # Parse the lower bound
        lower_str = staff_count.split("–")[0]
        try:
            sc_int = int(lower_str)
        except ValueError:
            sc_int = 0

    # Convert follower_count if it's not an int
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

# ----------------------------------------------------------------------
# STEP 3: Search People
# ----------------------------------------------------------------------
try:
    people = linkedin_api.search_people(
        keywords="Western University alumni",
        limit=5
    )
    print(f"Total search results returned: {len(people)}")
except Exception as e:
    print(f"[ERROR] Searching for people: {e}")
    people = []

# ----------------------------------------------------------------------
# STEP 4: Fetch Profile + Parse + Summarize + Filter
# ----------------------------------------------------------------------
results = []
for i, person in enumerate(people, start=1):
    print(f"\n===== PERSON {i} =====")
    print(f"Name: {person.get('name')}")
    print(f"Job:  {person.get('jobtitle')}")
    print(f"Loc:  {person.get('location')}")

    # Fetch full profile
    public_id = person.get("public_id")
    urn_id = person.get("urn_id")
    profile_data = None

    try:
        if public_id:
            profile_data = linkedin_api.get_profile(public_id=public_id)
            print(f" - Fetched full profile via public_id: {public_id}")
        elif urn_id:
            profile_data = linkedin_api.get_profile(urn_id=urn_id)
            print(f" - Fetched full profile via urn_id: {urn_id}")
    except Exception as exc:
        print(f"[ERROR] fetch profile: {exc}")
        continue

    if not profile_data:
        print(" - No profile data. Skipping.")
        continue

    experiences = profile_data.get("experience", [])
    if not experiences:
        print(" - No experiences found. Skipping.")
        continue

    first_experience = experiences[0]
    # Attempt to retrieve 'companyUrn'
    company_urn = first_experience.get("companyUrn")
    if not company_urn and isinstance(first_experience.get("company"), dict):
        company_urn = first_experience["company"].get("companyUrn")

    if not company_urn:
        print(" - No company URN found. Skipping.")
        continue

    # Parse ID or Slug
    company_id_or_slug = parse_company_id_from_urn(company_urn)
    if not company_id_or_slug:
        print(" - Could not parse an ID from URN. Skipping.")
        continue

    # get_company
    try:
        raw_company_data = linkedin_api.get_company(company_id_or_slug)
        summarized_data = summarize_company_data(raw_company_data)
    except Exception as exc:
        print(f"[ERROR] get_company({company_id_or_slug}): {exc}")
        continue

    print("Summarized Data (Pre-Filter):")
    pprint(summarized_data)

    # Filter based on your rules
    if passes_filters(summarized_data):
        print("=> PASSES all filters. Adding to results.")
        results.append({
            "person_name": person.get("name", ""),
            "jobtitle": person.get("jobtitle", "N/A"),
            "location": person.get("location", "N/A"),
            "company_urn": company_urn,
            "company_id_or_slug": company_id_or_slug,
            "company_summary": summarized_data
        })
    else:
        print("=> DOES NOT PASS filters. Skipping.")
    
    # Sleep to avoid rate-limiting
    time.sleep(random.uniform(1, 2))

# ----------------------------------------------------------------------
# STEP 5: Present Final Results
# ----------------------------------------------------------------------
print("\n===== FILTERED FINAL RESULTS =====\n")
for idx, item in enumerate(results, start=1):
    print(f"Person {idx}: {item['person_name']} | {item['jobtitle']} | {item['location']}")
    print(f"Company URN:   {item['company_urn']}")
    print(f"ID or Slug:    {item['company_id_or_slug']}")
    print("Summarized Company Data:")
    pprint(item["company_summary"])
    print("-" * 70)

print("Done.")
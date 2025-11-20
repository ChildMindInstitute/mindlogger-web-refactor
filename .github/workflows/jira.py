# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "pygithub",
#     "requests",
#     "slack-sdk",
#     "typer",
# ]
# ///

import re
import subprocess
import requests
from requests.auth import HTTPBasicAuth
import os
import json
from datetime import date
from dataclasses import dataclass
from typing import List, Tuple, Optional

from github import Github, Auth
import typer
from typing_extensions import Annotated


APP_NAME = os.getenv("APP_NAME")
JIRA_USERNAME = os.getenv('JIRA_USERNAME')
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_REPO = os.getenv('GITHUB_REPO')
SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK')

JIRA_DOMAIN = os.getenv('JIRA_DOMAIN', "mindlogger.atlassian.net")
JIRA_PROJECT_KEY = os.getenv('JIRA_PROJECT_KEY', "M2")

# Me
# MENTION_USERS = ["U06P72FD37Z"]

# TODO Make this an env var
# Phillipe, Natalia, Yanina
MENTION_USERS = ["U07AP86C133", "U022MMR13KQ", "U06HTJBUXC4"]


@dataclass
class JiraIssue:
  id: str
  summary: str

  @property
  def url(self) -> str:
    return f"https://{JIRA_DOMAIN}/browse/{self.id}"

cli = typer.Typer()

def get_release_notes(tag: str) -> str:
  """Get the release notes for a given tag"""
  auth = Auth.Token(GITHUB_TOKEN)
  g = Github(auth=auth)

  print(f"Getting release notes for {tag} from repo {GITHUB_REPO}")
  repo = g.get_repo(GITHUB_REPO)
  release_notes = repo.get_release(tag).body

  return release_notes


def get_git_log(previous_tag, current_tag):
  """Get the git logs between two tags"""
  # git log --pretty=%B $previousTag..$currentTag
  result = subprocess.run(
      ["git", "log", "--pretty=%B", f"{previous_tag}..{current_tag}"],
      capture_output=True,
      text=True,
      check=True
  )
  return result.stdout.strip()


def extract_m2_codes(text):
  """Extract M2 codes from a markdown text"""
  # Step 1: Find all matches (case-insensitive)
  matches = re.findall(r'M2-\d+', text, re.IGNORECASE)

  # Step 2: Convert to uppercase
  matches = [m.upper() for m in matches]

  # Step 3: Sort and deduplicate
  unique_sorted = sorted(set(matches))

  return unique_sorted


def get_jira_issue_summary(issue):
  """Get a summary of the Jira issue"""
  url = f"https://{JIRA_DOMAIN}/rest/api/3/issue/{issue}"

  auth = HTTPBasicAuth(JIRA_USERNAME, JIRA_API_TOKEN)
  headers = {
    "Accept": "application/json"
  }

  # Make the GET request
  response = requests.get(
    url,
    auth=auth,
    headers=headers
  )

  # Check the response
  if response.status_code == 200:
    data = response.json()
    summary =  data.get("fields", {}).get("summary")
    if not summary:
      raise Exception(f"Could not extract summary for issue {issue}")
    return summary
  else:
    raise Exception(f"Error {response.status_code}: {response.text}")


def generate_slack_bullet(issue: JiraIssue)-> dict:
  jira_message = {
    "type": "rich_text_section",
    "elements": [
      {
        "type": "link",
        "url": issue.url,
        "text": issue.id,
        "style": {
          "bold": True
        }
      },
      {
        "type": "text",
        "text": f" -- {issue.summary}",
      }
    ]
  }

  return jira_message


def send_slack_notification(issues: List[JiraIssue], environment: str, tag: str):
  for issue in issues:
    print(f"[{issue.id}] - {issue.summary} || {issue.url}")

  jira_issues = [generate_slack_bullet(issue) for issue in issues]

  all_messages = {
    "type": "rich_text",
    "elements": [
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "emoji",
            "name": "jira"
          },
          {
            "type": "text",
            "text": " JIRA Issues in this release:\n"
          }
        ]
      },
      {
        "type": "rich_text_list",
        "style": "bullet",
        "indent": 0,
        "elements": jira_issues
      }
    ]
  }

  mentions = " ".join([f"<@{uid}>" for uid in MENTION_USERS])

  block_message = {
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": f":rocket: {APP_NAME.title()} Deployment to {environment.title()} Complete",
          "emoji": True
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": f"Version *{tag}* deployed successfully"
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": f"View Release :arrow_upper_right:",
            "emoji": True
          },
          "url": f"https://github.com/{GITHUB_REPO}/releases/tag/{tag}"
        }
      },
      all_messages,
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": f"cc: {mentions}",
        }
      },
      {
        "type": "divider",
      }
    ]
  }

  response = requests.post(
    SLACK_WEBHOOK,
    data=json.dumps(block_message),
    headers={"Content-Type": "application/json"}
  )

  if response.status_code != 200:
    raise ValueError(f"Request failed: {response.status_code}, {response.text}")



def get_or_create_jira_version(app_name: str, version: str) -> str:
  # Authentication and headers
  auth = HTTPBasicAuth(JIRA_USERNAME, JIRA_API_TOKEN)
  headers = {
    "Content-Type": "application/json"
  }

  full_version = f"{app_name}.{version}"

  # Step 1: Get all versions for the project
  get_versions_url = f"https://{JIRA_DOMAIN}/rest/api/3/project/{JIRA_PROJECT_KEY}/versions"
  response = requests.get(get_versions_url, headers=headers, auth=auth)

  if response.status_code != 200:
    print(f"Failed to fetch versions: {response.status_code}")
    print(response.text)
    exit()

  versions = response.json()

  # Step 2: Check if the version already exists
  existing_version = next((v for v in versions if v["name"] == full_version), None)

  if existing_version:
    print(f"Version '{full_version}' already exists with ID: {existing_version['id']}")
    return existing_version["id"]
  else:
    # Step 3: Create the version
    print(f"Creating version '{full_version}'")
    create_version_url = f"https://{JIRA_DOMAIN}/rest/api/2/version"
    today = date.today()
    formatted_date = today.strftime("%Y-%m-%d")

    payload = {
      "description": f"{app_name.title()} Release version {version}",
      "name": full_version,
      "archived": False,
      "released": True,
      "releaseDate": formatted_date,
      "project": JIRA_PROJECT_KEY
    }

    create_response = requests.post(
      create_version_url,
      data=json.dumps(payload),
      headers=headers,
      auth=auth
    )

    if create_response.status_code == 201:
      created_version = create_response.json()
      print(f"Version '{full_version}' created successfully with ID: {created_version['id']}")
      return created_version["id"]
    else:
      print(f"Failed to create version: {create_response.status_code}")
      print(create_response.text)
      raise Exception(f"Failed to create version: {create_response.status_code}")

def create_jira_version(app_name: str, version: str) -> str:
  # Endpoint
  url = f"https://{JIRA_DOMAIN}/rest/api/2/version"

  # Payload
  payload = {
    "description": f"{app_name} Release version {version}",
    "name": f"{app_name}.{version}",
    "archived": False,
    "released": True,
    "releaseDate": date.today().isoformat(),
    "project": JIRA_PROJECT_KEY
  }

  # Headers
  headers = {
    "Content-Type": "application/json"
  }

  # Make the request
  response = requests.post(
    url,
    data=json.dumps(payload),
    headers=headers,
    auth=HTTPBasicAuth(EMAIL, API_TOKEN)
  )

  # Output result
  if response.status_code == 201:
    print("Version created successfully:")
    response = json.loads(response.json())
    print(response.json())
    return response.get("id")
  else:
    print(f"Failed to create version: {response.status_code}")
    print(response.text)
    raise Exception(f"Failed to create version: {response.status_code} {response.text}")

def set_jira_fix_version(version_id: str, issue: str):
  # Authentication and headers
  auth = HTTPBasicAuth(JIRA_USERNAME, JIRA_API_TOKEN)
  headers = {
    "Content-Type": "application/json"
  }

  # Assign each issue to the version
  url = f"https://{JIRA_DOMAIN}/rest/api/3/issue/{issue}"
  payload = {
    "update": {
      "fixVersions": [
        {
          "set": [{"id": version_id}]
        }
      ]
    }
  }

  response = requests.put(url, data=json.dumps(payload), headers=headers, auth=auth)

  if response.status_code == 204:
    print(f"Issue {issue} updated successfully.")
  else:
    print(f"Failed to update {issue}: {response.status_code}")
    print(response.text)


def process_log(text: str, environment: str, tag: Optional[str] = None) -> None:
  issues = extract_m2_codes(text)
  jira_issues = [JiraIssue(issue, get_jira_issue_summary(issue)) for issue in issues]
  send_slack_notification(jira_issues, environment, tag)

  if environment == "prod":
    jira_version = get_or_create_jira_version(APP_NAME, tag)
    for issue in jira_issues:
      set_jira_fix_version(jira_version, issue.id)

@cli.command(short_help="Generate from release notes")
def from_release_notes(tag: str, environment: Annotated[str, typer.Argument(help="Environment name")]) -> None:
  text = get_release_notes(tag)
  process_log(text, environment, tag)

@cli.command(short_help="Generate from git logs between refs")
def from_refs(previous, current, environment: Annotated[str, typer.Argument(help="Environment name")]):
  text = get_git_log(previous, current)
  process_log(text, environment)

def main() -> None:
    cli()


if __name__ == "__main__":
    main()

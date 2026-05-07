#!/usr/bin/env python3
"""
Script to add users to the NestJS API.
Requires requests library: pip install requests
"""

import requests
import json
import sys

BASE_URL = "http://localhost:3000"

def add_user(first_name, last_name, email, is_active=True):
    url = f"{BASE_URL}/users"
    data = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "isActive": is_active
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, data=json.dumps(data), headers=headers)
    if response.status_code == 201:
        print(f"User {email} created successfully.")
    else:
        print(f"Failed to create user {email}: {response.text}")

def main():
    # Sample users
    users = [
        ("John", "Doe", "john.doe@example.com"),
        ("Jane", "Smith", "jane.smith@example.com"),
        ("Alice", "Johnson", "alice.johnson@example.com"),
        ("Bob", "Brown", "bob.brown@example.com"),
    ]

    for first, last, email in users:
        add_user(first, last, email)

if __name__ == "__main__":
    main()
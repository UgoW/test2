#!/usr/bin/env python3
"""
Script to get users from the NestJS API.
Requires requests library: pip install requests
"""

import requests
import json
import sys

BASE_URL = "http://localhost:3000"

def get_all_users():
    url = f"{BASE_URL}/users"
    response = requests.get(url)
    if response.status_code == 200:
        users = response.json()
        print("All users:")
        for user in users:
            print(f"- ID: {user['id']}, Name: {user['firstName']} {user['lastName']}, Email: {user['email']}, Active: {user['isActive']}")
    else:
        print(f"Failed to get users: {response.text}")

def get_user_by_id(user_id):
    url = f"{BASE_URL}/users/{user_id}"
    response = requests.get(url)
    if response.status_code == 200:
        user = response.json()
        print(f"User {user_id}:")
        print(f"Name: {user['firstName']} {user['lastName']}, Email: {user['email']}, Active: {user['isActive']}")
    else:
        print(f"Failed to get user {user_id}: {response.text}")

def main():
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        try:
            user_id = int(user_id)
            get_user_by_id(user_id)
        except ValueError:
            print("Invalid user ID. Please provide a number.")
    else:
        get_all_users()

if __name__ == "__main__":
    main()
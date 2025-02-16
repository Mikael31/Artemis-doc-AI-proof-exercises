#!/bin/bash
# for configuring instance over script
jira_external_port=8081

set -e
echo In order to work, you need to provide the Username and Password of an admin account for Jira
echo Jira Admin Account
read -p 'Username: ' jira_uservar
read -sp 'Password: ' jira_passvar

# create groups

declare -a group_names=("tutors" "instructors" "students" "editors")

jira_group_url="http://localhost:$jira_external_port/rest/api/latest/group"

for group_name in "${group_names[@]}"; do
    curl -u "$jira_uservar":"$jira_passvar" \
    -s \
    --header "Content-Type: application/json" \
    --request POST \
    --fail \
    --show-error \
    --data "{
                \"name\": \"$group_name\"
            }" \
    $jira_group_url
done

# create users

jira_user_url="http://localhost:$jira_external_port/rest/api/latest/user"
jira_group_add_url="http://localhost:$jira_external_port/rest/api/2/group/user?groupname="

for i in {1..20}; do
    # User 1-5 are students, 6-10 are tutors, 11-15 are editors and 16-20 are instructors
    group="students"
    if ((i > 5)); then
      group="tutors"
    fi
    if ((i > 10)); then
      group="editors"
    fi
    if ((i > 15)); then
      group="instructors"
    fi

    # Create user
    curl -u "$jira_uservar":"$jira_passvar" \
    -s \
    --header "Content-Type: application/json" \
    --request POST \
    --fail \
    --show-error \
    --data "{
                \"password\": \"artemis_test_user_$i\",
                \"emailAddress\": \"artemis_test_user_$i@artemis.local\",
                \"displayName\": \"Artemis Test User $i\",
                \"name\": \"artemis_test_user_$i\"

            }" \
    $jira_user_url

    # Add user to group
    curl -u "$jira_uservar":"$jira_passvar" \
    -s \
    --header "Content-Type: application/json" \
    --request POST \
    --fail \
    --show-error \
    --data "{
                \"name\": \"artemis_test_user_$i\"
            }" \
    "$jira_group_add_url$group"
done

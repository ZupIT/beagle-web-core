#!/bin/bash
#
  # Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  #
  # Licensed under the Apache License, Version 2.0 (the "License");
  # you may not use this file except in compliance with the License.
  # You may obtain a copy of the License at
  #
  #  http://www.apache.org/licenses/LICENSE-2.0
  #
  # Unless required by applicable law or agreed to in writing, software
  # distributed under the License is distributed on an "AS IS" BASIS,
  # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  # See the License for the specific language governing permissions and
  # limitations under the License.
#

IFS=$'\n'
year='2020, 2022'
company='ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA'

# ORIGIN_URL=$(git config remote.origin.url)
files_without_header=()

# Check license header only for office repositories
# if [[ $ORIGIN_URL = https://github.com/ZupIT/beagle-web-core.git* ]] ; then

# Retrieve the list of newly added files
newly_added_files=($(git diff --name-only --diff-filter=A --cached))
if [ -n "$newly_added_files" ]; then
  # Check for Copyright statement
  for newly_added_file in $newly_added_files; do
    files_without_header+=($(grep -L "Copyright $year $company" $newly_added_file))
  done

  if [ -n "$files_without_header" ]; then
    echo "Copyright $year $company license header not found in the following newly added files:"
    for file in "${files_without_header[@]}"; do
      :
      echo "   - $file"
    done
    exit 1
  else
    echo "Hooray! All new files have updated license header."
    exit 0
  fi
fi

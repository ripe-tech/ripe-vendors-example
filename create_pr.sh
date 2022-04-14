#!/bin/bash
# -*- coding: utf-8 -*-

set -e +h

echo "Bundling, and creating PR for RIPE Static."

pluginLines=$(cat plugin.json)

IFS=$'\n' pluginLinesArray=($pluginLines)

index=$(expr ${#pluginLinesArray[@]} - 2)
versionLine=${pluginLinesArray[index]}

IFS=$'"' versionLineSplit=($versionLine)
versionIndex=$(expr ${#versionLineSplit[@]} - 2)
version=${versionLineSplit[versionIndex]}

echo -e "\nFound version:"
echo $version

# get common logic from ripe-static
curl https://cdn.platforme.com/scripts/base_pr_workflow.sh -o base_pr_workflow.sh

chmod a+x base_pr_workflow.sh

TOKEN=$TOKEN GITHUB_ACTOR=$GITHUB_ACTOR ./base_pr_workflow.sh "example" $version

rm -rf base_pr_workflow.sh

echo "Finished workflow."

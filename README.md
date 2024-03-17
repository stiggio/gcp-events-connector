# Stigg events connector for GCP

This repository contains an example of integration between GCP and Stigg - forward events from Pub/Sub into Stigg for [usage-metering](https://docs.stigg.io/docs/reporting-raw-events).

It's implemented using a GCP Function listens to a Pub/Sub topic, buffer messages, and sends the events to Stigg every 1 second.

## Pre-requisites

* GCP account + project
* Pub/Sub topic to consume messages from
* Terraform installed

## Preparations

* Enable access for the required APIs on the GCP project - click [here](https://console.cloud.google.com/flows/enableapi?apiid=cloudbuild.googleapis.com,artifactregistry.googleapis.com,cloudfunctions.googleapis.com,storage.googleapis.com,compute.googleapis.com,eventarc.googleapis.com,run.googleapis.com) to enable them.
* Clone this repository
* Edit the [EventParser.ts](./function-source/src/EventParser.ts) file to map between your event format and the Stigg format.

## Deployment

* Create `terraform/terraform.tfvars` file with the following content and fill in the values:
  ```hcl
  gcp_project = ""
  pubsub_topic_id = ""
  stigg_api_key = ""
  ```
* Change directory `cd terraform/`
* Run `terraform init` to initialize the project
* Run `terraform apply -var-file=".tfvars"` to deploy the Cloud Function
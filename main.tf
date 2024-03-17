terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.34.0"
    }
  }
}

provider "google" {
  project     = var.gcp_project
  region      = var.gcp_location
}

variable "gcp_project" {
  description = "The GCP project to deploy the function to"
  type        = string
}

variable "gcp_location" {
  description = "The GCP location to deploy the function to"
  type        = string
  default     = "us-central1"
}

variable "pubsub_topic_id" {
  description = "The ID of the Pub/Sub topic to forward events from"
  type        = string
}

variable "stigg_api_key" {
  description = "The API key for the Stigg API"
  type        = string
  sensitive = true
}

resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "default" {
  name                        = "${random_id.bucket_prefix.hex}-gcf-source" # Every bucket name must be globally unique
  location                    = "US"
  uniform_bucket_level_access = true
}

data "archive_file" "function-source" {
  type        = "zip"
  output_path = "/tmp/function-source.zip"
  source_dir  = "function-source/"
  excludes = ["node_modules", ]
}

resource "google_storage_bucket_object" "default" {
  name   = "function-source.${data.archive_file.function-source.output_md5}.zip"
  bucket = google_storage_bucket.default.name
  source = data.archive_file.function-source.output_path # Path to the zipped function source code
}

resource "google_cloudfunctions2_function" "default" {
  name        = "stigg-events-connector"
  description = "Function that forwards events from Pub/Sub to Stigg API"
  location    = var.gcp_location

  build_config {
    runtime     = "nodejs20"
    entry_point = "EventForwarder"
    source {
      storage_source {
        bucket = google_storage_bucket.default.name
        object = google_storage_bucket_object.default.name
      }
    }
  }

  service_config {
    max_instance_count = 3
    min_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    environment_variables = {
      STIGG_API_KEY = var.stigg_api_key
    }
    ingress_settings               = "ALLOW_INTERNAL_ONLY"
    all_traffic_on_latest_revision = true
  }

  event_trigger {
    trigger_region = "us-central1"
    event_type     = "google.cloud.pubsub.topic.v1.messagePublished"
    pubsub_topic   = var.pubsub_topic_id
    retry_policy   = "RETRY_POLICY_RETRY"
  }
}

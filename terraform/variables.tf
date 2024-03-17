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
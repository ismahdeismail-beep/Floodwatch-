terraform {
  required_version = ">= 1.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "gcs" {
    # bucket = "floodwatch-tfstate"
    # prefix = "floodwatch-ai"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ─── Artifact Registry ────────────────────────────────────────────────

resource "google_artifact_registry_repository" "services" {
  location      = var.region
  repository_id = "floodwatch-services"
  format        = "DOCKER"
}

# ─── Object storage ────────────────────────────────────────────────────

resource "google_storage_bucket" "floodwatch_artifacts" {
  name          = "${var.project_id}-floodwatch-artifacts"
  location      = var.region
  force_destroy = false
  versioning {
    enabled = true
  }
  lifecycle_rule {
    condition { age = 365 }
    action { type = "Delete" }
  }
}

# ─── Cloud Run services ────────────────────────────────────────────────

locals {
  services = {
    api-gateway = 8000
    auth        = 8001
    weather     = 8002
    hydrology   = 8003
    satellite   = 8004
    gis         = 8005
    ai          = 8006
    alerts      = 8007
    analytics   = 8008
  }
}

resource "google_cloud_run_v2_service" "svc" {
  for_each    = local.services
  name        = "floodwatch-${each.key}"
  location    = var.region
  ingress     = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = var.ai_service == each.key ? 4 : 10
    }
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.services.name}/${each.key}:${var.image_tag}"
      ports {
        container_port = each.value
      }
      resources {
        limits = {
          cpu    = var.ai_service == each.key ? "2" : "1"
          memory = var.ai_service == each.key ? "4Gi" : "512Mi"
        }
      }
      env {
        name  = "ENVIRONMENT"
        value = "production"
      }
      env {
        name  = "PORT"
        value = tostring(each.value)
      }
    }
  }

  depends_on = [google_artifact_registry_repository.services]
}

resource "google_cloud_run_service_iam_member" "public" {
  for_each = local.services
  location = google_cloud_run_v2_service.svc[each.key].location
  service  = google_cloud_run_v2_service.svc[each.key].name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ─── Service accounts (reserved for GCS access) ───────────────────────

resource "google_service_account" "runtime" {
  account_id   = "floodwatch-runtime"
  display_name = "FloodWatch AI runtime service account"
}

resource "google_project_iam_member" "runtime_gcs" {
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}

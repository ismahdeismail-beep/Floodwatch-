output "cloud_run_urls" {
  description = "URLs of deployed Cloud Run services"
  value = {
    for k, s in google_cloud_run_v2_service.svc : k => s.uri
  }
}

output "artifact_registry_repo" {
  description = "Docker repository for service images"
  value       = google_artifact_registry_repository.services.name
}

output "gcs_bucket" {
  description = "Object storage bucket for rasters/artifacts"
  value       = google_storage_bucket.floodwatch_artifacts.name
}

# Cloudflare

Cloudflare is the edge layer for FloodWatch AI: DNS, CDN, WAF, and DDoS protection.

## DNS Records (proxied)

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | floodwatch.ai | web.vercel.app | Proxied |
| CNAME | www | floodwatch.ai | Proxied |
| CNAME | dashboard | web.vercel.app | Proxied |
| CNAME | admin | web.vercel.app | Proxied |
| CNAME | api | <cloud-run-load-balancer> | Proxied |

## WAF

- Managed ruleset (Cloudflare Managed): enabled, `HIGH` sensitivity.
- Rate limiting: `api.*` — 15,000 req/min per IP, block for 10 min after 5× breach.
- Bot Fight Mode: enabled (public surfaces only; exclude dashboard/admin).

## Headers (Transform Rules)

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` — set per app (see apps' headers config).

## Notes

- Manage via UI or `infrastructure/cloudflare` Terraform module (add provider
  `cloudflare/cloudflare` and credentials `CLOUDFLARE_API_TOKEN`).
- Origin (Cloud Run/Vercel) should restrict access to Cloudflare IPs where possible.

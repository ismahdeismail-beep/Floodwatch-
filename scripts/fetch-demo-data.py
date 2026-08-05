"""Fetch a small public demo dataset (CHIRPS rainfall for Kenya) for local work.

Usage:
    python scripts/fetch-demo-data.py --out datasets/raw/chirps --year 2023

Requires internet access. CHIRPS is open (UCSB/CHG). This is a scaffold helper —
the production ingestion pipeline lives in the weather/satellite services.
"""

import argparse
import pathlib
import urllib.request

BASE_URL = "https://data.chc.ucsb.edu/products/CHIRPS-2.0/africa_daily/tifs/p05"


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch CHIRPS demo data")
    parser.add_argument("--out", default="datasets/raw/chirps", help="output directory")
    parser.add_argument("--year", type=int, default=2023)
    parser.add_argument("--days", type=int, default=3, help="how many daily tifs to fetch")
    args = parser.parse_args()

    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    for day in range(1, args.days + 1):
        name = f"chirps-v2.0.{args.year}.{day:02d}.01.tif"
        url = f"{BASE_URL}/{args.year}/chirps-v2.0.{args.year}.01.{day:02d}.tif"
        target = out / name
        print(f"Fetching {url} -> {target}")
        try:
            urllib.request.urlretrieve(url, target)
        except Exception as exc:  # noqa: BLE001
            print(f"  skipped: {exc}")

    print("Done. Record provenance in datasets/README.md (source: CHIRPS-2.0, UCSB/CHG).")


if __name__ == "__main__":
    main()

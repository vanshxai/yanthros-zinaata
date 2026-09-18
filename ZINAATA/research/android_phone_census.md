# Android Phone Census — README

## Purpose

First-pass census of Android phone models for a phone-repair diagnostic project.

The census is designed for **wide model coverage rather than deep research per phone**. Detailed per-phone research will be performed later only for models identified as relevant.

## Scope

- Android phones only
- India-market phones first
- Global-market expansion after India coverage
- Avoid near-duplicate variants unless specifications genuinely differ
- Target: roughly **200–300+ distinct models**, expanding further when real data supports it
- Do not fabricate specifications

## Brand Order

1. Samsung
2. Xiaomi / Redmi / POCO
3. Vivo
4. Oppo
5. Realme
6. OnePlus
7. Motorola
8. Nokia / HMD
9. Infinix
10. Tecno
11. iQOO
12. Asus
13. Google Pixel
14. Lava
15. Micromax

## Catalog Schema

Each phone model should have one row with:

| Field | Description |
|---|---|
| Brand | Manufacturer / brand |
| Model | Commercial model name |
| Key SKU variants | Important model/SKU identifiers where relevant |
| Release year | Initial release year |
| Chipset | SoC/platform |
| RAM/storage options | Commercial memory configurations |
| Battery (mAh) | Rated battery capacity |
| Display | Size, resolution, refresh rate |
| Rear camera (MP, count) | Main/rear camera megapixels and camera count |
| Price tier | Budget / mid / upper-mid / flagship |
| Region availability | India / global / both |
| Source | Source used to verify the entry |

## Research Rules

### 1. Incremental processing

Work **brand by brand**.

After completing each brand:

- Output that brand's complete table section
- Provide the running model count
- Record data-quality hurdles
- Then move to the next brand

### 2. Search effort

Use approximately **10–15 searches per brand** as a reasonable first-pass limit.

Stop when searches are clearly producing diminishing returns in new, distinct models.

### 3. Verification

Do not guess specifications.

If a field cannot be reliably verified:

- Leave it blank
- Record the issue in the Hurdles section

Prefer manufacturer sources, official launch announcements, and reliable specification databases.

### 4. Variant handling

Do not create separate rows merely because a phone has:

- Different RAM/storage configurations
- Different colors
- Carrier/retailer naming
- Minor regional SKU differences

Create separate rows when the variant has a **genuine hardware/specification difference**, such as:

- Different chipset
- Different camera hardware
- Different display
- Different battery
- Other materially different hardware

## Current Progress

### Samsung

**Models catalogued: 36**

The current Samsung section includes older Galaxy S/Note devices and selected A/M/S/Z-series models, with India and global availability distinguished where applicable.

## Current Census Count

**36 models**

## Hurdles

- **Samsung:** Older Galaxy M/F generations and some discontinued A-series devices have fragmented archived documentation.
- **Samsung:** Exact regional SKU numbers and some chipset/display-refresh fields remain unverified for certain models.
- **Samsung global:** Some 5G variants were documented globally but were not established as India-market models.
- **Samsung S-series:** Some older official pages provide processor details without clearly naming the commercial chipset; those fields should remain blank rather than being inferred.

## Output Format

Each completed brand should use:

```markdown
## Brand: X

| Brand | Model | Key SKU variants | Release year | Chipset | RAM/storage options | Battery (mAh) | Display (size, resolution, refresh rate) | Rear camera (MP, count) | Price tier | Region availability | Source |
|---|---|---|---:|---|---|---:|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**X running total: N models**
```

## Important

This is a **first-pass census**, not a definitive technical database.

The purpose is to identify the population of phone models that may later require deeper research for repair diagnostics, hardware identification, sensor mapping, fault analysis, and related work.

All future additions should preserve the same schema and avoid fabricated or weakly supported specifications.

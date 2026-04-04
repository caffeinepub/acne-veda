# Acne Veda

## Current State
Backend Motoko canister has correct code but deployed canister reports IC0537 (no wasm module installed).

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Force full rebuild and deploy so backend wasm gets installed

### Remove
- Nothing

## Implementation Plan
1. No code changes - backend Motoko code is correct
2. Trigger full build+deploy to fix IC0537 and enable signup/login

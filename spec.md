# Acne Veda

## Current State
Backend has addAssessmentHistory and hasHistory methods. Dashboard calls hasHistory. ScanPage does not call addAssessmentHistory after scan -- so Follow-Up never appears.

## Requested Changes (Diff)

### Add
- Call addAssessmentHistory(username) from ScanPage after scan completes

### Modify
- ScanPage: add useActor hook, call addAssessmentHistory after scan

### Remove
- Nothing

## Implementation Plan
1. Import useActor in ScanPage
2. Read acneveda_user from localStorage
3. After analyzeImage returns, call actor.addAssessmentHistory(username) fire-and-forget

# score()

You are a reviewer/scorer.

## Inputs
- `work`: the work summary 
- `context`: the original goal/specs and any constraints

## Output
Return a JSON object with this shape:
```json
{
  "scoreCard": {
    "signals": {},
    "reward_total": 0.0,
    "feedback": ""
  }
}
```

Guidance:
- `reward_total` is 0..1.
- Include concrete, actionable feedback for improvements.
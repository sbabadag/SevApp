# Correct EAS Environment Variable Commands

## Delete Existing Secret

```bash
eas env:delete --variable-name EXPO_PUBLIC_SUPABASE_ANON_KEY --scope project
```

## Create New Secret with Publishable Key

```bash
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_aNWSLMDoVdG2eo3Py9kPsg_KbrmIAyD" --scope project --visibility sensitive
```

## Update Supabase URL (if needed)

```bash
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://isoydimyquabqfrezuuc.supabase.co" --scope project --visibility sensitive --force
```

## List All Environment Variables

```bash
eas env:list
```

## Important Notes

- Use `--variable-name` for `env:delete` (not `--name`)
- Use `--name` for `env:create`
- `--visibility sensitive` makes the value hidden in logs
- `--force` flag overwrites existing variable
- `--scope project` makes it available to this project only



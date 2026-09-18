#!/usr/bin/env bash
# Fail if prod compose files contain secret-looking literals or denylist keys without ${VAR}.
set -euo pipefail

DENYLIST_RE='(PASSWORD|SECRET|TOKEN|ENCRYPTION_KEY|DATABASE_URL)'
LITERAL_RE='[A-Za-z0-9+/=_-]{20,}'
INTERP_RE='\$\{[A-Za-z_][A-Za-z0-9_]*(:-[^}]*)?\}|\$[A-Za-z_][A-Za-z0-9_]*'

strip_interp() {
  local s=$1
  s=$(printf '%s' "$s" | sed -E 's/\$\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\}//g')
  s=$(printf '%s' "$s" | sed -E 's/\$\{[A-Za-z_][A-Za-z0-9_]*\}//g')
  s=$(printf '%s' "$s" | sed -E 's/\$[A-Za-z_][A-Za-z0-9_]*//g')
  printf '%s' "$s"
}

has_interp() {
  printf '%s' "$1" | grep -Eq "$INTERP_RE"
}

leading_spaces() {
  local line=$1
  local trimmed="${line#"${line%%[![:space:]]*}"}"
  echo $(( ${#line} - ${#trimmed} ))
}

should_skip() {
  local f=$1
  local base
  base=$(basename "$f")
  case "$base" in
    docker-compose.yml|docker-compose.local.yml)
      if [[ "$f" != */infra/* && "$f" != infra/* ]]; then
        return 0
      fi
      ;;
  esac
  return 1
}

check_file() {
  local file=$1
  local errors=0

  if should_skip "$file"; then
    echo "skip (root dev compose): $file"
    return 0
  fi

  if [[ ! -f "$file" ]]; then
    echo "ERROR: file not found: $file" >&2
    return 1
  fi

  local section=""
  local section_indent=-1
  local line_no=0
  local line key value raw_value stripped indent

  while IFS= read -r line || [[ -n "$line" ]]; do
    line_no=$((line_no + 1))

    # blank / full-line comment
    if [[ "$line" =~ ^[[:space:]]*$ || "$line" =~ ^[[:space:]]*# ]]; then
      continue
    fi

    indent=$(leading_spaces "$line")

    if [[ "$line" =~ ^[[:space:]]*(environment|command|labels):[[:space:]]*$ ]]; then
      section="${BASH_REMATCH[1]}"
      section_indent=$indent
      continue
    fi

    if [[ -n "$section" ]]; then
      # content must be indented further than the section key
      if [[ "$indent" -le "$section_indent" ]]; then
        section=""
        section_indent=-1
        # fall through — this line may open another section
        if [[ "$line" =~ ^[[:space:]]*(environment|command|labels):[[:space:]]*$ ]]; then
          section="${BASH_REMATCH[1]}"
          section_indent=$indent
        fi
        continue
      fi
    else
      continue
    fi

    key=""
    value=""

    if [[ "$line" =~ ^[[:space:]]+-[[:space:]]*(.*)$ ]]; then
      raw_value="${BASH_REMATCH[1]}"
      if [[ "$raw_value" =~ ^([A-Za-z0-9_]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
      elif [[ "$raw_value" =~ ^([A-Za-z0-9_]+):[[:space:]]*(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
      else
        # list flag/value: prefer RHS of last '=' if present (Traefik --flag=value)
        if [[ "$raw_value" == *"="* ]]; then
          value="${raw_value#*=}"
        else
          value="$raw_value"
        fi
      fi
    elif [[ "$line" =~ ^[[:space:]]*([A-Za-z0-9_]+):[[:space:]]*(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
    else
      continue
    fi

    # strip surrounding quotes
    if [[ "$value" =~ ^\"(.*)\"$ ]]; then
      value="${BASH_REMATCH[1]}"
    elif [[ "$value" =~ ^\'(.*)\'$ ]]; then
      value="${BASH_REMATCH[1]}"
    fi

    if [[ -n "$key" ]] && printf '%s' "$key" | grep -Eiq "$DENYLIST_RE"; then
      if ! has_interp "$value"; then
        echo "ERROR: $file:$line_no: denylist key '$key' value lacks \${VAR} interpolation" >&2
        errors=$((errors + 1))
      fi
    fi

    stripped=$(strip_interp "$value")
    if printf '%s' "$stripped" | grep -Eq "$LITERAL_RE"; then
      local match
      match=$(printf '%s' "$stripped" | grep -Eo "$LITERAL_RE" | head -1)
      echo "ERROR: $file:$line_no: secret-looking literal (${#match} chars) in $section: $match" >&2
      errors=$((errors + 1))
    fi
  done < "$file"

  if [[ "$errors" -gt 0 ]]; then
    echo "FAIL: $file ($errors issue(s))" >&2
    return 1
  fi
  echo "OK: $file"
  return 0
}

main() {
  local files=()
  if [[ "$#" -gt 0 ]]; then
    files=("$@")
  else
    while IFS= read -r f; do
      files+=("$f")
    done < <(find infra -type f \( -name 'docker-compose.yml' -o -name 'docker-compose*.yml' \) 2>/dev/null | sort)
  fi

  if [[ "${#files[@]}" -eq 0 ]]; then
    echo "ERROR: no compose files to check" >&2
    exit 1
  fi

  local rc=0
  local f
  for f in "${files[@]}"; do
    if ! check_file "$f"; then
      rc=1
    fi
  done
  exit "$rc"
}

main "$@"

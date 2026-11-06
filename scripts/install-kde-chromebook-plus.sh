#!/usr/bin/env bash
# Install KDE Plasma and KDE apps on a Chromebook Plus
# (ChromeOS Linux / Crostini).
#
# On the Chromebook:
#   1. Settings → Advanced → Developers → Linux development environment → Turn on
#   2. Open the Terminal app
#   3. Copy this file in, then:
#        chmod +x install-kde-chromebook-plus.sh
#        ./install-kde-chromebook-plus.sh
#
# This does not replace ChromeOS. It installs KDE inside Linux so you can
# run Dolphin, Kate, Okular, Plasma apps, and (optionally) a Plasma session.

set -euo pipefail

log() { printf "\n\033[1;32m==>\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }
die() { printf "\033[1;31m[error]\033[0m %s\n" "$*"; exit 1; }

need_crostini() {
  if [[ -f /dev/.cros_milestone ]] || grep -qi "penguin\|chrome" /etc/hostname 2>/dev/null; then
    return 0
  fi
  if [[ -d /mnt/chromeos ]] || [[ -n "${SOMMELIER_VERSION:-}" ]]; then
    return 0
  fi
  warn "This does not look like ChromeOS Linux. Continuing anyway in 5s (Ctrl+C to stop)."
  sleep 5
}

need_root_apt() {
  command -v apt-get >/dev/null || die "apt-get not found. Enable Linux on the Chromebook first."
  sudo -n true 2>/dev/null || sudo -v || die "sudo is required."
}

pick_set() {
  local choice="${1:-standard}"
  case "$choice" in
    apps|minimal)
      echo "dolphin konsole kate okular gwenview ark plasma-workspace"
      ;;
    standard|*)
      echo "kde-standard"
      ;;
    full)
      echo "kde-full"
      ;;
  esac
}

main() {
  local flavor="${1:-standard}"
  need_crostini
  need_root_apt

  log "Updating package lists"
  sudo apt-get update

  log "Installing KDE ($flavor)"
  # kde-standard = Plasma desktop + core apps
  # kde-full     = nearly everything (large download)
  # apps         = file manager / editor / viewer only
  # shellcheck disable=SC2046
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends $(pick_set "$flavor") \
    kdeconnect \
    plasma-browser-integration \
    || sudo DEBIAN_FRONTEND=noninteractive apt-get install -y kde-plasma-desktop dolphin konsole kate

  log "KDE packages are installed"

  cat <<'EOF'

Run KDE apps from the ChromeOS launcher (they show up after a minute) or:

  dolphin &
  kate &
  konsole &

Full Plasma session inside Linux (experimental on Crostini):

  startplasma-x11

If startplasma-x11 is missing:

  sudo apt-get install -y plasma-workspace-wayland plasma-workspace

Usage:
  ./install-kde-chromebook-plus.sh           # kde-standard (recommended)
  ./install-kde-chromebook-plus.sh apps      # lighter app set
  ./install-kde-chromebook-plus.sh full      # kde-full (several GB)

EOF
}

main "${1:-standard}"

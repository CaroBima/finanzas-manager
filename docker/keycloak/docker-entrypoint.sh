#!/bin/bash
set -e
mkdir -p /opt/keycloak/data/import
sed "s/KEYCLOAK_CLIENT_SECRET_PLACEHOLDER/${KEYCLOAK_CLIENT_SECRET}/g" \
    /tmp/realm-template/realm-finanzas.json \
    > /opt/keycloak/data/import/realm-finanzas.json
exec /opt/keycloak/bin/kc.sh "$@"

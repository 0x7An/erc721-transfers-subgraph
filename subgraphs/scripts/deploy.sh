#!/usr/bin/env bash

set -xo errexit

# Default is to deploy all live configs
configs=$@
: ${configs:=configs/live/**/*.json}

for config in $configs; do
  subgraph=$(jq -r '.output' $config)
  npx graph-compiler --config ${config} --include src/datasources --export-schema --export-subgraph
  npx graph codegen ${subgraph}subgraph.yaml

  if [ "$(jq -r '.deploy[].type' $config)" = "local" ]; then
    node=$(jq -r '.deploy[].node' $config)
    ipfs=$(jq -r '.deploy[].ipfs' $config)
    name=$(jq -r '.deploy[].name' $config)
    npx graph create --node $node $name
    npx graph deploy --node ${node} --ipfs ${ipfs} ${name} ${subgraph}subgraph.yaml --debug
  else
    jq -cr '.deploy[].type+" "+.deploy[].name' $config | while read endpoint; do
      npx graph deploy --product ${endpoint} ${subgraph}subgraph.yaml
    done
  fi

done

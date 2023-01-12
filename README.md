# ERC-721 transfers sub-graph

This repository contains one sub-graph for ERC-721 transfers.

## Setup
  - `cp .env.example .env` and fill in the values
  - `yarn install` to install dependencies
  - `yarn node-up` to start a local node with docker-compose (see `docker-compose.yml` for details)
  - `yarn chain-up` to start a local chain i'm using ganache-cli
  - `yarn graph-compile` to compile the sub-graph (see `subgraph.yaml` for details)
  - `yarn graph-deploy` to deploy the sub-graph to the local node running on docker
  - `yarn graph-logs` to see the logs of the sub-graph running on the local node (run this on a separate terminal)
  - `yarn contract-mint` to mint a token on the local chain and check the logs to see if the sub-graph picked it up the contracts.

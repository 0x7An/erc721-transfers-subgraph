

# Graph Node Docker Image

Preconfigured Docker image for running a Graph Node.

## Usage

```sh
docker run -it \
  -e postgres_host=<HOST> \
  -e postgres_port=<PORT> \
  -e postgres_user=<USER> \
  -e postgres_pass=<PASSWORD> \
  -e postgres_db=<DBNAME> \
  -e ipfs=<HOST>:<PORT> \
  -e ethereum=<NETWORK_NAME>:<ETHEREUM_RPC_URL> \
  graphprotocol/graph-node:latest
```

### Example usage

```sh
docker run -it \
  -e postgres_host=host.docker.internal \
  -e postgres_port=5432 \
  -e postgres_user=graph-node \
  -e postgres_pass=oh-hello \
  -e postgres_db=graph-node \
  -e ipfs=host.docker.internal:5001 \
  -e ethereum=mainnet:http://localhost:8545/ \
  graphprotocol/graph-node:latest
```

## Docker Compose

The Docker Compose setup requires an Ethereum network name and node
to connect to. By default, it will use `mainnet:http://host.docker.internal:8545`
in order to connect to an Ethereum node running on your host machine.
You can replace this with anything else in `docker-compose.yaml`.

> **Note for Linux users:** On Linux, `host.docker.internal` is not
> currently supported. Instead, you will have to replace it with the
> IP address of your Docker host (from the perspective of the Graph
> Node container).
> To do this, run:
>
> ```
> CONTAINER_ID=$(docker container ls | grep graph-node | cut -d' ' -f1)
> docker exec $CONTAINER_ID /bin/bash -c 'apt install -y iproute2 && ip route' | awk '/^default via /{print $3}'
> ```
>
> This will print the host's IP address. Then, put it into `docker-compose.yml`:
>
> ```
> sed -i -e 's/host.docker.internal/<IP ADDRESS>/g' docker-compose.yml
> ```

After you have set up an Ethereum node—e.g. Ganache or Parity—simply
clone this repository and run

```sh
docker-compose up
```

This will start IPFS, Postgres and Graph Node in Docker and create persistent
data directories for IPFS and Postgres in `./data/ipfs` and `./data/postgres`. You
can access these via:

- Graph Node:
  - GraphiQL: `http://localhost:8000/`
  - HTTP: `http://localhost:8000/subgraphs/name/<subgraph-name>`
  - WebSockets: `ws://localhost:8001/subgraphs/name/<subgraph-name>`
  - Admin: `http://localhost:8020/`
- IPFS:
  - `127.0.0.1:5001` or `/ip4/127.0.0.1/tcp/5001`
- Postgres:
  - `postgresql://graph-node:let-me-in@localhost:5432/graph-node`

Once this is up and running, you can use
[`graph-cli`](https://github.com/graphprotocol/graph-cli) to create and
deploy your subgraph to the running Graph Node.
  
### Running Graph Node on an Macbook M1
  
We do not currently build native images for Macbook M1, which can lead to processes being killed due to out-of-memory errors (code 137). Based on the example `docker-compose.yml` is possible to rebuild the image for your M1 by running the following, then running `docker-compose up` as normal:
 
> **Important** Increase memory limits for the docker engine running on your machine. Otherwise docker build command will fail due to out of memory error. To do that, open docker-desktop and go to Resources/advanced/memory.
```
# Remove the original image
docker rmi graphprotocol/graph-node:latest

# Build the image
./docker/build.sh

# Tag the newly created image
docker tag graph-node graphprotocol/graph-node:latest
```



# ERC-721 Non-Fungible Token Metadata Subgraph

The subgraph monitors all transfer events, gets the token's tokenURI link if the event is related with ERC721 token transfer, and then retrieves and parses the metadata json file to get rich metadata information, according to ERC721 metadata schema and OpenSea metadata standards, if the tokenURI points to a valid json file on IPFS network.

Furthermore, for ERC721 metadata parsing, there are some edge cases to consider: 

1. Some ERC721 contracts still use centralized web service for metadata hosting. For example, the tokenURI for fancybear is something like https://api.fancybearsmetaverse.com/1

For this case, the subgraph will try its best to retrieve the IPFS hash from the tokenURI if it contains IPFS hash. Otherwise, the subgraph will just store the tokenURI and won’t move forward to parse the metadata.

2. Some ERC721 contracts use centralized web service for metadata hosting at first and then switch to IPFS later on. For example, after minting out, the bayc contract switched to IPFS for metadata hosting after minting out. It changed the tokenURI by resetting the baseURI for the contract.

For this case, the subgraph monitors whether the tokenURI has changed by comparing with the token's tokenURI seen before in every transfer event handling. If the tokenURI changes, then the subgraph will update the specific token's tokenURI and metadata. 

ERC-721 Non-Fungible Token Standard

- https://ethereum.org/en/developers/docs/standards/tokens/erc-721/

OpenSea Metadata Standards

- https://docs.opensea.io/docs/metadata-standards


# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `ERC721_ADDRESS_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten ERC721_ADDRESS_ADDRESS "Hello, Hardhat!"
```

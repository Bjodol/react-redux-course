# Install node

## Purpose

Setting up development environment.

## NVM

To avoid frustrations between within a team it is beneficial that all developers within a team runs the same version of node. To helpe ease this we'll use a common version manager for node called [nvm](https://github.com/nvm-sh/nvm).

## Tasks

1. Setup node with nvm by running the command. _[(Installation documentation if needed)](https://github.com/nvm-sh/nvm#installing-and-updating)_

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

2. Verify node is present by running the command.

```bash
node -v
# Should output something similar to: `v18.10.0`
```
